import React, { useState, useMemo, useEffect } from 'react';

// Normalize school names for matching - keep it simple, just lowercase and trim
const normalizeSchool = (name) => {
  if (!name) return '';
  return name.toLowerCase().trim();
};

// Format year range - show single year if start equals end
const formatYearRange = (start, end) => {
  if (start === end) return `${start}`;
  return `${start}–${end}`;
};

// Check if two school names refer to the same school
const schoolsMatch = (school1, school2) => {
  if (!school1 || !school2) return false;
  
  const s1 = normalizeSchool(school1);
  const s2 = normalizeSchool(school2);
  
  // Exact match
  if (s1 === s2) return true;
  
  // Remove only University/College suffixes (NOT "State" - that changes meaning)
  const stripSuffixes = (s) => s
    .replace(/\s+university$/i, '')
    .replace(/\s+college$/i, '')
    .trim();
  
  const s1Stripped = stripSuffixes(s1);
  const s2Stripped = stripSuffixes(s2);
  
  // After stripping suffixes, check for exact match
  if (s1Stripped === s2Stripped && s1Stripped.length >= 5) return true;
  
  // Check if one starts with the other (for variations like "Penn State" and "Penn State University")
  const shorter = s1.length < s2.length ? s1 : s2;
  const longer = s1.length < s2.length ? s2 : s1;
  
  // Must be at least 6 chars to avoid false positives
  if (shorter.length < 6) return false;
  
  // Ratio check - shorter must be at least 70% of longer
  const ratio = shorter.length / longer.length;
  if (ratio < 0.7) return false;
  
  // The shorter string must match at the START of the longer string
  // AND the next character in longer must be a space (word boundary)
  if (longer.startsWith(shorter)) {
    // Make sure we're at a word boundary
    if (longer.length === shorter.length || longer[shorter.length] === ' ') {
      return true;
    }
  }
  
  return false;
};

// Get all unique schools from currentTeam field (where coaches currently work)
const getAllCurrentTeams = (data) => {
  const teams = new Set();
  data.forEach(coach => {
    if (coach.currentTeam) teams.add(coach.currentTeam);
  });
  return Array.from(teams).sort();
};

// Find coaches who CURRENTLY work at a specific school
const getCurrentCoachesAtSchool = (data, school) => {
  return data.filter(coach => {
    return schoolsMatch(coach.currentTeam, school);
  });
};

// Find all overlapping connections for current coaches at a school
// This looks at their ENTIRE career history and finds overlaps with coaches at OTHER schools
const findExternalConnections = (data, selectedSchool) => {
  // Get coaches who currently work at the selected school
  const currentStaff = getCurrentCoachesAtSchool(data, selectedSchool);
  
  // Get all other coaches (not currently at selected school)
  const otherCoaches = data.filter(coach => {
    return !schoolsMatch(coach.currentTeam, selectedSchool);
  });
  
  const connections = [];
  
  // For each current staff member, check their entire career for overlaps
  currentStaff.forEach(staffCoach => {
    staffCoach.coaching_career?.forEach(staffJob => {
      // Check against all other coaches' careers
      otherCoaches.forEach(otherCoach => {
        otherCoach.coaching_career?.forEach(otherJob => {
          // Check if they were at the same school using proper matching
          if (schoolsMatch(staffJob.school, otherJob.school)) {
            // Check for year overlap
            if (staffJob.years && otherJob.years) {
              const overlapStart = Math.max(staffJob.years.start, otherJob.years.start);
              const overlapEnd = Math.min(staffJob.years.end, otherJob.years.end);
              
              if (overlapStart <= overlapEnd) {
                connections.push({
                  currentCoach: {
                    name: staffCoach.name,
                    currentTeam: staffCoach.currentTeam,
                    currentPosition: staffCoach.currentPosition,
                    position: staffJob.position,
                    years: staffJob.years,
                    school: staffJob.school
                  },
                  otherCoach: {
                    name: otherCoach.name,
                    currentTeam: otherCoach.currentTeam,
                    currentPosition: otherCoach.currentPosition,
                    position: otherJob.position,
                    years: otherJob.years,
                    school: otherJob.school
                  },
                  connectionSchool: staffJob.school,
                  overlapStart,
                  overlapEnd,
                  overlapYears: overlapEnd - overlapStart + 1
                });
              }
            }
          }
        });
      });
    });
  });
  
  // Sort by overlap duration, then by current coach name
  return connections.sort((a, b) => {
    if (b.overlapYears !== a.overlapYears) return b.overlapYears - a.overlapYears;
    return a.currentCoach.name.localeCompare(b.currentCoach.name);
  });
};

// Deduplicate connections (same two coaches might have multiple overlaps)
const dedupeConnections = (connections) => {
  const seen = new Set();
  return connections.filter(conn => {
    const key = `${conn.currentCoach.name}|${conn.otherCoach.name}|${conn.connectionSchool}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function CoachingHotboard() {
  const [coachesData, setCoachesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('overlaps');
  const [currentStaff, setCurrentStaff] = useState([]);
  const [connections, setConnections] = useState([]);
  
  // Load data from JSON file
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'coaches_data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load coaches data');
        return res.json();
      })
      .then(data => {
        setCoachesData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  const allSchools = useMemo(() => getAllCurrentTeams(coachesData), [coachesData]);
  
  const filteredSchools = useMemo(() => {
    if (!searchTerm) return allSchools;
    const term = searchTerm.toLowerCase();
    return allSchools.filter(s => s.toLowerCase().includes(term));
  }, [allSchools, searchTerm]);
  
  // Calculate connections when school is selected - use useEffect to show loading state
  useEffect(() => {
    if (!selectedSchool) {
      setCurrentStaff([]);
      setConnections([]);
      return;
    }
    
    setCalculating(true);
    
    // Use setTimeout to allow the loading spinner to render before heavy calculation
    const timer = setTimeout(() => {
      const staff = getCurrentCoachesAtSchool(coachesData, selectedSchool);
      setCurrentStaff(staff);
      
      const allConnections = findExternalConnections(coachesData, selectedSchool);
      const dedupedConnections = dedupeConnections(allConnections);
      setConnections(dedupedConnections);
      
      setCalculating(false);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [selectedSchool, coachesData]);
  
  // Group connections by current staff member, then by other coach
  const connectionsByCoach = useMemo(() => {
    const grouped = {};
    connections.forEach(conn => {
      if (!grouped[conn.currentCoach.name]) {
        grouped[conn.currentCoach.name] = {
          coach: conn.currentCoach,
          connectionsByOtherCoach: {}
        };
      }
      
      // Group by other coach name
      const otherName = conn.otherCoach.name;
      if (!grouped[conn.currentCoach.name].connectionsByOtherCoach[otherName]) {
        grouped[conn.currentCoach.name].connectionsByOtherCoach[otherName] = {
          otherCoach: conn.otherCoach,
          overlaps: []
        };
      }
      grouped[conn.currentCoach.name].connectionsByOtherCoach[otherName].overlaps.push({
        connectionSchool: conn.connectionSchool,
        overlapStart: conn.overlapStart,
        overlapEnd: conn.overlapEnd,
        overlapYears: conn.overlapYears,
        staffPosition: conn.currentCoach.position,
        staffYears: conn.currentCoach.years,
        otherPosition: conn.otherCoach.position,
        otherYears: conn.otherCoach.years
      });
    });
    
    // Convert to array and sort
    return Object.values(grouped).map(group => ({
      coach: group.coach,
      otherCoaches: Object.values(group.connectionsByOtherCoach).sort((a, b) => {
        // Sort by total overlap years descending
        const aTotal = a.overlaps.reduce((sum, o) => sum + o.overlapYears, 0);
        const bTotal = b.overlaps.reduce((sum, o) => sum + o.overlapYears, 0);
        return bTotal - aTotal;
      })
    })).sort((a, b) => b.otherCoaches.length - a.otherCoaches.length);
  }, [connections]);
  
  // Get unique other coaches connected to (for stats)
  const uniqueOtherCoaches = useMemo(() => {
    const coaches = new Set();
    connections.forEach(conn => {
      coaches.add(conn.otherCoach.name);
    });
    return coaches;
  }, [connections]);
  
  // Get unique other teams connected to
  const connectedTeams = useMemo(() => {
    const teams = new Set();
    connections.forEach(conn => {
      if (conn.otherCoach.currentTeam) {
        teams.add(conn.otherCoach.currentTeam);
      }
    });
    return teams;
  }, [connections]);

  // Popular schools for quick selection
  const popularSchools = useMemo(() => {
    // Get schools with most coaches
    const schoolCounts = {};
    coachesData.forEach(coach => {
      if (coach.currentTeam) {
        schoolCounts[coach.currentTeam] = (schoolCounts[coach.currentTeam] || 0) + 1;
      }
    });
    return Object.entries(schoolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([school]) => school);
  }, [coachesData]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: "'JetBrains Mono', monospace"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏈</div>
          <div>Loading coaches data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: "'JetBrains Mono', monospace"
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ marginBottom: '1rem' }}>Error loading data: {error}</div>
          <div style={{ fontSize: '0.9rem', color: '#8892b0' }}>
            Make sure <code>coaches_data.json</code> is in the <code>public</code> folder.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: '#e0e0e0',
      padding: '2rem'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '3rem',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #ff6b35, #f7c59f, #ff6b35, transparent)',
          borderRadius: '2px'
        }} />
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 50%, #ff8c42 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
          textTransform: 'uppercase'
        }}>
          Coaching Hotboard
        </h1>
        <p style={{
          color: '#8892b0',
          fontSize: '1rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          Mapping Coaching Trees & Connections
        </p>
      </header>

      {/* School Selector */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto 2rem',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '1rem',
        alignItems: 'end'
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#8892b0',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            Select a School
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search schools..."
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,107,53,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(255,107,53,0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,107,53,0.2)'}
            />
            {searchTerm && filteredSchools.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#1a1a2e',
                border: '1px solid rgba(255,107,53,0.3)',
                borderRadius: '8px',
                marginTop: '4px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 100
              }}>
                {filteredSchools.slice(0, 15).map(school => (
                  <div
                    key={school}
                    onClick={() => {
                      setSelectedSchool(school);
                      setSearchTerm('');
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,107,53,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    {school}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* View Toggle */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(255,255,255,0.03)',
          padding: '0.5rem',
          borderRadius: '8px',
          border: '1px solid rgba(255,107,53,0.2)'
        }}>
          {[{id: 'overlaps', label: 'All Connections'}, {id: 'timeline', label: 'By Coach'}].map(mode => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              style={{
                padding: '0.75rem 1.25rem',
                background: viewMode === mode.id ? 'rgba(255,107,53,0.3)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: viewMode === mode.id ? '#ff6b35' : '#8892b0',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease'
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected School Badge */}
      {selectedSchool && (
        <div style={{
          maxWidth: '900px',
          margin: '0 auto 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(247,197,159,0.1))',
            padding: '0.75rem 1.25rem',
            borderRadius: '100px',
            border: '1px solid rgba(255,107,53,0.4)'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🏈</span>
            <span style={{ fontWeight: 700, color: '#f7c59f' }}>{selectedSchool}</span>
            <button
              onClick={() => setSelectedSchool('')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                color: '#888',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
          {!calculating && (
            <div style={{ color: '#8892b0', fontSize: '0.9rem' }}>
              <span style={{ color: '#ff6b35', fontWeight: 700 }}>{currentStaff.length}</span> current staff · 
              <span style={{ color: '#ff6b35', fontWeight: 700 }}> {uniqueOtherCoaches.size}</span> coaches connected ·
              <span style={{ color: '#ff6b35', fontWeight: 700 }}> {connectedTeams.size}</span> other programs
            </div>
          )}
        </div>
      )}

      {/* Loading Spinner for Calculations */}
      {calculating && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          gap: '1.5rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,107,53,0.2)',
            borderTop: '4px solid #ff6b35',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{ color: '#8892b0', fontSize: '1rem' }}>
            Finding coaching connections...
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Main Content */}
      {selectedSchool && !calculating && (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {viewMode === 'overlaps' ? (
            /* Connections View */
            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {connections.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: '#8892b0'
                }}>
                  No external coaching connections found for {selectedSchool} staff
                </div>
              ) : (
                connections.map((conn, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,107,53,0.15)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      gap: '1.5rem',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,107,53,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,107,53,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      e.currentTarget.style.borderColor = 'rgba(255,107,53,0.15)';
                    }}
                  >
                    {/* Current Staff Coach */}
                    <div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#4ade80',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '0.25rem'
                      }}>
                        {selectedSchool} Staff
                      </div>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: '0.25rem'
                      }}>
                        {conn.currentCoach.name}
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#f7c59f',
                        marginBottom: '0.5rem'
                      }}>
                        {conn.currentCoach.currentPosition}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#8892b0',
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        Was: {conn.currentCoach.position} @ {conn.connectionSchool}
                        <br />({formatYearRange(conn.currentCoach.years.start, conn.currentCoach.years.end)})
                      </div>
                    </div>
                    
                    {/* Overlap Indicator */}
                    <div style={{
                      textAlign: 'center',
                      padding: '1rem'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #ff6b35, #f7c59f)',
                        borderRadius: '50%',
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.5rem',
                        boxShadow: '0 0 30px rgba(255,107,53,0.3)'
                      }}>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#0f0f23'
                        }}>
                          {conn.overlapYears}
                        </div>
                        <div style={{
                          fontSize: '0.6rem',
                          color: '#0f0f23',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {conn.overlapYears === 1 ? 'year' : 'years'}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#f7c59f',
                        fontWeight: 600
                      }}>
                        {conn.connectionSchool}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#8892b0'
                      }}>
                        {formatYearRange(conn.overlapStart, conn.overlapEnd)}
                      </div>
                    </div>
                    
                    {/* External Coach */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#60a5fa',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '0.25rem'
                      }}>
                        Now @ {conn.otherCoach.currentTeam}
                      </div>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: '0.25rem'
                      }}>
                        {conn.otherCoach.name}
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#f7c59f',
                        marginBottom: '0.5rem'
                      }}>
                        {conn.otherCoach.currentPosition}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#8892b0',
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        Was: {conn.otherCoach.position} @ {conn.connectionSchool}
                        <br />({formatYearRange(conn.otherCoach.years.start, conn.otherCoach.years.end)})
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* By Staff Member View */
            <div style={{
              display: 'grid',
              gap: '2rem'
            }}>
              {connectionsByCoach.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: '#8892b0'
                }}>
                  No external coaching connections found
                </div>
              ) : (
                connectionsByCoach.map((group, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,107,53,0.15)',
                      borderRadius: '12px',
                      padding: '1.5rem'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#0f0f23'
                      }}>
                        {group.otherCoaches.length}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>
                          {group.coach.name}
                        </div>
                        <div style={{ color: '#8892b0', fontSize: '0.85rem' }}>
                          {group.coach.currentPosition} @ {group.coach.currentTeam}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '0.75rem'
                    }}>
                      {group.otherCoaches.map((otherCoachGroup, connIdx) => {
                        const totalYears = otherCoachGroup.overlaps.reduce((sum, o) => sum + o.overlapYears, 0);
                        return (
                          <div
                            key={connIdx}
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              borderRadius: '8px',
                              padding: '0.75rem',
                              fontSize: '0.85rem'
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'flex-start',
                              marginBottom: '0.5rem'
                            }}>
                              <div>
                                <div style={{ color: '#fff', fontWeight: 600 }}>
                                  {otherCoachGroup.otherCoach.name}
                                </div>
                                <div style={{ color: '#60a5fa', fontSize: '0.8rem' }}>
                                  {otherCoachGroup.otherCoach.currentPosition} @ {otherCoachGroup.otherCoach.currentTeam}
                                </div>
                              </div>
                              {otherCoachGroup.overlaps.length > 1 && (
                                <div style={{
                                  background: 'linear-gradient(135deg, #ff6b35, #f7c59f)',
                                  borderRadius: '12px',
                                  padding: '0.2rem 0.5rem',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  color: '#0f0f23'
                                }}>
                                  {totalYears} yrs total
                                </div>
                              )}
                            </div>
                            
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              gap: '0.25rem',
                              marginTop: '0.5rem'
                            }}>
                              {otherCoachGroup.overlaps.map((overlap, overlapIdx) => (
                                <div 
                                  key={overlapIdx}
                                  style={{ 
                                    color: '#8892b0', 
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    background: 'rgba(255,107,53,0.1)',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <span style={{ color: '#f7c59f' }}>{overlap.connectionSchool}</span>
                                  {' '}({formatYearRange(overlap.overlapStart, overlap.overlapEnd)})
                                  <span style={{ color: '#666', marginLeft: '0.25rem' }}>
                                    · {overlap.overlapYears} {overlap.overlapYears === 1 ? 'yr' : 'yrs'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Current Staff Directory */}
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              color: '#f7c59f',
              marginBottom: '1rem',
              fontWeight: 700,
              letterSpacing: '0.05em'
            }}>
              🎯 Current {selectedSchool} Staff ({currentStaff.length})
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem'
            }}>
              {currentStaff.map((coach, idx) => {
                // Count unique other coaches this person has connections with
                const coachGroup = connectionsByCoach.find(g => g.coach.name === coach.name);
                const uniqueConnections = coachGroup ? coachGroup.otherCoaches.length : 0;
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,107,53,0.1)',
                      borderRadius: '10px',
                      padding: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,107,53,0.4)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,107,53,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: '0.25rem'
                    }}>
                      {coach.name}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#ff8c42',
                      marginBottom: '0.5rem'
                    }}>
                      {coach.currentPosition}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: uniqueConnections > 0 ? '#4ade80' : '#8892b0'
                    }}>
                      {uniqueConnections > 0 
                        ? `${uniqueConnections} external connection${uniqueConnections === 1 ? '' : 's'}`
                        : 'No external connections found'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedSchool && !calculating && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1.5rem',
            filter: 'grayscale(0.3)'
          }}>
            🏟️
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#f7c59f',
            marginBottom: '1rem',
            fontWeight: 700
          }}>
            Select a School to Explore
          </h2>
          <p style={{
            color: '#8892b0',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Discover coaching connections and see which coaches worked together 
            at the same program. Perfect for building a coaching hotboard or 
            understanding coaching trees.
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            {popularSchools.map(school => (
              <button
                key={school}
                onClick={() => setSelectedSchool(school)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,107,53,0.1)',
                  border: '1px solid rgba(255,107,53,0.3)',
                  borderRadius: '100px',
                  color: '#ff8c42',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,107,53,0.2)';
                  e.target.style.borderColor = 'rgba(255,107,53,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,107,53,0.1)';
                  e.target.style.borderColor = 'rgba(255,107,53,0.3)';
                }}
              >
                {school}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '4rem',
        padding: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        color: '#8892b0',
        fontSize: '0.75rem'
      }}>
        <p>If you wanna talk more about some CFB data projects, hit me up!</p>
        <a href="https://x.com/MikeBbent" style={{
          color: '#8892b0',
          fontSize: '1rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          Mike Broadbent
        </a>
      </footer>
    </div>
  );
}
