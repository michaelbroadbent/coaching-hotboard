import React, { useState, useMemo } from 'react';
import { TeamWithLogo, TeamLogo, getTeamLogoUrl } from './teamLogos';

// Position type classification
const getPositionType = (position) => {
  if (!position) return null;
  const pos = position.toLowerCase();
  // HC: must be "head coach" as the actual role, not "assistant to the head coach", 
  // "associate head coach", "assistant head coach", etc.
  const isHC = pos === 'head coach' || 
               pos.startsWith('head coach/') || 
               pos.startsWith('head coach,') ||
               pos.startsWith('head coach &') ||
               pos === 'head coach/general manager' ||
               (pos.includes('interim head coach') && !pos.includes('assistant')) ||
               (pos.includes('head football coach'));
  if (isHC) return 'hc';
  if (pos.includes('offensive coordinator') || pos.includes('co-offensive coordinator') ||
      /\boc\b/.test(pos) || /\bco-oc\b/.test(pos)) return 'oc';
  if (pos.includes('defensive coordinator') || pos.includes('co-defensive coordinator') ||
      /\bdc\b/.test(pos) || /\bco-dc\b/.test(pos)) return 'dc';
  return null;
};

// Position sort priority (lower = higher on staff list)
const getPositionPriority = (position) => {
  if (!position) return 99;
  const pos = position.toLowerCase();
  
  // Head coach - always first (whitelist approach to avoid false positives)
  const isHC = pos === 'head coach' || 
               pos.startsWith('head coach/') || 
               pos.startsWith('head coach,') ||
               pos.startsWith('head coach &') ||
               pos === 'head coach/general manager' ||
               (pos.includes('interim head coach') && !pos.includes('assistant')) ||
               (pos.includes('head football coach'));
  if (isHC) return 0;
  
  // Offensive Coordinators (all variations together, right after HC)
  if (pos.includes('offensive coordinator') || pos === 'oc' || 
      (pos.startsWith('oc') && (pos.length <= 5 || pos[2] === '/')) ||
      /\bco-oc\b/.test(pos) || /\boc\b/.test(pos)) return 10;
  
  // Defensive Coordinators (all variations together, after OC)
  if (pos.includes('defensive coordinator') || pos === 'dc' ||
      (pos.startsWith('dc') && (pos.length <= 5 || pos[2] === '/')) ||
      /\bco-dc\b/.test(pos) || /\bdc\b/.test(pos)) return 11;
  
  // Special Teams Coordinator
  if (pos.includes('special teams coordinator') || /\bstc\b/.test(pos)) return 12;
  
  // Other coordinators (passing game, run game, etc.)
  if (pos.includes('coordinator')) return 15;
  
  // Associate / Assistant HC - after coordinators
  if (pos.includes('associate head coach') || /\bahc\b/.test(pos)) return 20;
  if (pos.includes('assistant head coach')) return 21;
  
  // Position coaches
  if (pos.includes('quarterback')) return 30;
  if (pos.includes('running back')) return 31;
  if (pos.includes('wide receiver') || pos.includes('receivers')) return 32;
  if (pos.includes('tight end')) return 33;
  if (pos.includes('offensive line')) return 34;
  if (pos.includes('defensive line') || pos.includes('d-line')) return 40;
  if (pos.includes('linebacker')) return 41;
  if (pos.includes('secondary') || pos.includes('defensive back') || pos.includes('cornerback') || pos.includes('safety')) return 42;
  
  // Abbreviated positions
  if (/\bqb\b/.test(pos)) return 30;
  if (/\brb\b/.test(pos)) return 31;
  if (/\bwr\b/.test(pos)) return 32;
  if (/\bte\b/.test(pos)) return 33;
  if (/\bol\b/.test(pos)) return 34;
  if (/\bdl\b/.test(pos)) return 40;
  if (/\blb\b/.test(pos)) return 41;
  if (/\bdb\b/.test(pos) || /\bcb\b/.test(pos)) return 42;
  if (/\bst\b/.test(pos)) return 45;
  
  // Analysts, quality control, GAs, etc.
  if (pos.includes('analyst')) return 80;
  if (pos.includes('quality control')) return 81;
  if (pos.includes('graduate') || pos.includes('ga') || pos.includes('intern')) return 85;
  if (pos.includes('director') || pos.includes('recruiting')) return 75;
  if (pos.includes('strength')) return 70;
  
  return 50;
};

// Get color for position type
const getPositionColor = (position) => {
  const type = getPositionType(position);
  if (type === 'hc') return '#ff6b35';
  if (type === 'oc') return '#4ade80';
  if (type === 'dc') return '#60a5fa';
  return '#8892b0';
};

// Get badge color for position type
const getPositionBadgeBg = (position) => {
  const type = getPositionType(position);
  if (type === 'hc') return 'rgba(255,107,53,0.15)';
  if (type === 'oc') return 'rgba(74,222,128,0.1)';
  if (type === 'dc') return 'rgba(96,165,250,0.1)';
  return 'rgba(255,255,255,0.04)';
};

// Check if two school names refer to the same school
const schoolsMatch = (school1, school2) => {
  if (!school1 || !school2) return false;
  const s1 = school1.toLowerCase().trim();
  const s2 = school2.toLowerCase().trim();
  if (s1 === s2) return true;
  
  const stripSuffixes = (s) => s
    .replace(/\s+university$/i, '')
    .replace(/\s+college$/i, '')
    .trim();
  
  const s1s = stripSuffixes(s1);
  const s2s = stripSuffixes(s2);
  if (s1s === s2s && s1s.length >= 5) return true;
  
  const shorter = s1.length < s2.length ? s1 : s2;
  const longer = s1.length < s2.length ? s2 : s1;
  if (shorter.length < 6 || shorter.length / longer.length < 0.7) return false;
  if (longer.startsWith(shorter) && (longer.length === shorter.length || longer[shorter.length] === ' ')) return true;
  
  return false;
};

export default function StaffHistory({ coachesData, onSelectCoach }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [expandedYears, setExpandedYears] = useState(new Set());
  const [filterPosition, setFilterPosition] = useState('all'); // 'all', 'hc', 'oc', 'dc', 'coordinators', 'position'

  // Get all unique schools from coaching_career
  const allSchools = useMemo(() => {
    const schools = new Map(); // name -> count of coaches
    coachesData.forEach(coach => {
      coach.coaching_career?.forEach(entry => {
        if (entry.school) {
          const key = entry.school;
          schools.set(key, (schools.get(key) || 0) + 1);
        }
      });
    });
    // Sort by frequency (most common first), then alphabetically
    return Array.from(schools.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name]) => name);
  }, [coachesData]);

  // Filter schools based on search
  const filteredSchools = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return allSchools.filter(s => s.toLowerCase().includes(term)).slice(0, 50);
  }, [allSchools, searchTerm]);

  // Build year-by-year staff for selected school
  const staffByYear = useMemo(() => {
    if (!selectedSchool) return null;

    // Find all coaches who worked at this school
    const yearMap = {}; // year -> [{coach, position, raw_years}]
    const currentYear = new Date().getFullYear();
    
    coachesData.forEach(coach => {
      coach.coaching_career?.forEach(entry => {
        if (schoolsMatch(entry.school, selectedSchool) && entry.years) {
          const start = entry.years.start;
          let end = entry.years.end;
          
          // If the coach's currentTeam matches this school and this is their
          // most recent career entry at this school, extend through current year
          if (schoolsMatch(coach.currentTeam, selectedSchool)) {
            const latestAtSchool = coach.coaching_career
              .filter(e => schoolsMatch(e.school, selectedSchool) && e.years)
              .reduce((max, e) => Math.max(max, e.years.end), 0);
            if (end === latestAtSchool && end < currentYear) {
              end = currentYear;
            }
          }
          
          for (let year = start; year <= end; year++) {
            if (!yearMap[year]) yearMap[year] = [];
            yearMap[year].push({
              name: coach.name,
              position: entry.position,
              positionType: getPositionType(entry.position),
              url: coach.url,
              currentTeam: coach.currentTeam,
              currentPosition: coach.currentPosition,
              birthdate: coach.birthdate,
              alma_mater: coach.alma_mater,
              isPresent: entry.raw_years?.toLowerCase().includes('present') && year === end,
              startYear: start,
              endYear: end,
              rawYears: entry.raw_years,
              _coachRef: coach
            });
          }
        }
      });
    });

    // Sort coaches within each year by position priority
    Object.values(yearMap).forEach(staff => {
      staff.sort((a, b) => getPositionPriority(a.position) - getPositionPriority(b.position));
    });

    // Convert to sorted array of years (descending)
    const years = Object.keys(yearMap)
      .map(Number)
      .sort((a, b) => b - a);

    return { yearMap, years };
  }, [selectedSchool, coachesData]);

  // Get the head coaches timeline for the sidebar
  const headCoachTimeline = useMemo(() => {
    if (!staffByYear) return [];
    
    const hcEntries = [];
    const seen = new Set();
    
    // Go through years in order to find HC tenures
    const sortedYears = [...staffByYear.years].sort((a, b) => a - b);
    
    sortedYears.forEach(year => {
      const staff = staffByYear.yearMap[year];
      const hc = staff?.find(s => getPositionType(s.position) === 'hc');
      if (hc) {
        const key = `${hc.name}-${hc.startYear}`;
        if (!seen.has(key)) {
          seen.add(key);
          hcEntries.push({
            name: hc.name,
            startYear: hc.startYear,
            endYear: hc.endYear,
            isPresent: hc.rawYears?.toLowerCase().includes('present'),
            _coachRef: hc._coachRef
          });
        }
      }
    });
    
    return hcEntries.sort((a, b) => b.startYear - a.startYear);
  }, [staffByYear]);

  // Filter staff by position type
  const getFilteredStaff = (staff) => {
    if (filterPosition === 'all') return staff;
    if (filterPosition === 'coordinators') {
      return staff.filter(s => {
        const type = getPositionType(s.position);
        return type === 'hc' || type === 'oc' || type === 'dc';
      });
    }
    if (filterPosition === 'hc') return staff.filter(s => getPositionType(s.position) === 'hc');
    if (filterPosition === 'oc') return staff.filter(s => getPositionType(s.position) === 'oc');
    if (filterPosition === 'dc') return staff.filter(s => getPositionType(s.position) === 'dc');
    if (filterPosition === 'position') {
      return staff.filter(s => {
        const type = getPositionType(s.position);
        return type !== 'hc' && type !== 'oc' && type !== 'dc';
      });
    }
    return staff;
  };

  const toggleYear = (year) => {
    setExpandedYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  const expandAll = () => {
    if (staffByYear) setExpandedYears(new Set(staffByYear.years));
  };

  const collapseAll = () => setExpandedYears(new Set());

  // Detect staff changes between years
  const getStaffChanges = (year) => {
    if (!staffByYear) return null;
    const prevYear = year + 1; // previous season (years are descending)
    // Actually we want changes FROM the prior year TO this year
    const priorYear = year - 1;
    const currentStaff = staffByYear.yearMap[year] || [];
    const priorStaff = staffByYear.yearMap[priorYear] || [];
    
    if (priorStaff.length === 0) return null;
    
    const currentNames = new Set(currentStaff.map(s => s.name));
    const priorNames = new Set(priorStaff.map(s => s.name));
    
    const arrivals = currentStaff.filter(s => !priorNames.has(s.name));
    const departures = priorStaff.filter(s => !currentNames.has(s.name));
    
    if (arrivals.length === 0 && departures.length === 0) return null;
    
    return { arrivals, departures };
  };

  if (!selectedSchool) {
    // School search view
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ position: 'relative' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#8892b0',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            Search for a School or Program
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search schools (e.g., Alabama, Ohio State, Clemson)..."
            autoFocus
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(251,191,36,0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(251,191,36,0.2)'}
          />
          {searchTerm && filteredSchools.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#1a1a2e',
              border: '1px solid rgba(251,191,36,0.3)',
              borderRadius: '8px',
              marginTop: '4px',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 100
            }}>
              {filteredSchools.map(school => (
                <div
                  key={school}
                  onClick={() => {
                    setSelectedSchool(school);
                    setSearchTerm('');
                    // Auto-expand the 3 most recent years
                    setTimeout(() => {
                      // This will be handled by the initial render
                    }, 0);
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background 0.2s ease',
                    color: '#ccd6f6'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(251,191,36,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <TeamWithLogo team={school} size={20} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Staff history view
  const currentYear = new Date().getFullYear();
  const displayYears = staffByYear?.years || [];

  // Auto-expand most recent 3 years on first render
  if (expandedYears.size === 0 && displayYears.length > 0) {
    const initial = new Set(displayYears.slice(0, 3));
    // Use a ref-like approach - just set it directly since it's the first render
    setTimeout(() => setExpandedYears(initial), 0);
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header with school name and controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))',
          padding: '0.75rem 1.25rem',
          borderRadius: '100px',
          border: '1px solid rgba(251,191,36,0.4)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>{getTeamLogoUrl(selectedSchool) ? <TeamLogo team={selectedSchool} size={28} /> : '📋'}</span>
          <span style={{ fontWeight: 700, color: '#fbbf24' }}>{selectedSchool}</span>
          <span style={{ color: '#8892b0', fontSize: '0.85rem' }}>
            ({displayYears.length > 0 ? `${displayYears[displayYears.length - 1]}–${displayYears[0]}` : 'No data'})
          </span>
          <button
            onClick={() => {
              setSelectedSchool('');
              setExpandedYears(new Set());
              setFilterPosition('all');
            }}
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
              justifyContent: 'center',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={expandAll} style={{
            padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
            color: '#8892b0', cursor: 'pointer', fontSize: '0.7rem',
            fontWeight: 600, textTransform: 'uppercase'
          }}>Expand All</button>
          <button onClick={collapseAll} style={{
            padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
            color: '#8892b0', cursor: 'pointer', fontSize: '0.7rem',
            fontWeight: 600, textTransform: 'uppercase'
          }}>Collapse All</button>
        </div>
      </div>

      {/* Position filter */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'all', label: 'All Staff' },
          { id: 'coordinators', label: 'HC/OC/DC' },
          { id: 'hc', label: 'HC Only', color: '#ff6b35' },
          { id: 'oc', label: 'OC Only', color: '#4ade80' },
          { id: 'dc', label: 'DC Only', color: '#60a5fa' },
          { id: 'position', label: 'Position Coaches' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilterPosition(f.id)}
            style={{
              padding: '0.35rem 0.7rem',
              background: filterPosition === f.id ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.03)',
              border: filterPosition === f.id ? '1px solid rgba(251,191,36,0.4)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '5px',
              color: filterPosition === f.id ? (f.color || '#fbbf24') : '#8892b0',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              transition: 'all 0.2s ease'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Head Coach timeline */}
      {headCoachTimeline.length > 0 && (
        <div style={{
          background: 'rgba(255,107,53,0.05)',
          border: '1px solid rgba(255,107,53,0.15)',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ 
            color: '#ff6b35', 
            fontSize: '0.7rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            marginBottom: '0.75rem',
            fontWeight: 700
          }}>
            Head Coach Timeline
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {headCoachTimeline.map((hc, idx) => (
              <div
                key={`${hc.name}-${hc.startYear}`}
                onClick={() => onSelectCoach?.(hc._coachRef)}
                style={{
                  padding: '0.4rem 0.75rem',
                  background: 'rgba(255,107,53,0.1)',
                  border: '1px solid rgba(255,107,53,0.25)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.8rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,107,53,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255,107,53,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,107,53,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,107,53,0.25)';
                }}
              >
                <span style={{ color: '#ff6b35', fontWeight: 700 }}>{hc.name}</span>
                <span style={{ color: '#8892b0', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                  {hc.startYear}–{hc.isPresent ? 'present' : hc.endYear}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Year-by-year staff */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {displayYears.map(year => {
          const rawStaff = staffByYear.yearMap[year] || [];
          const staff = getFilteredStaff(rawStaff);
          const isExpanded = expandedYears.has(year);
          const changes = getStaffChanges(year);
          const hc = rawStaff.find(s => getPositionType(s.position) === 'hc');
          const oc = rawStaff.find(s => getPositionType(s.position) === 'oc');
          const dc = rawStaff.find(s => getPositionType(s.position) === 'dc');

          return (
            <div key={year} style={{
              background: 'rgba(255,255,255,0.02)',
              borderRadius: isExpanded ? '10px' : '6px',
              overflow: 'hidden',
              border: isExpanded ? '1px solid rgba(251,191,36,0.15)' : '1px solid rgba(255,255,255,0.04)',
              transition: 'all 0.2s ease'
            }}>
              {/* Year header row */}
              <div
                onClick={() => toggleYear(year)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr auto',
                  alignItems: 'center',
                  padding: '0.6rem 1rem',
                  cursor: 'pointer',
                  background: isExpanded ? 'rgba(251,191,36,0.05)' : 'transparent',
                  transition: 'background 0.2s ease',
                  gap: '1rem'
                }}
                onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Year */}
                <div style={{ 
                  fontWeight: 800, 
                  color: isExpanded ? '#fbbf24' : '#ccd6f6',
                  fontFamily: 'monospace',
                  fontSize: '1rem'
                }}>
                  {year}
                </div>
                
                {/* Summary: HC / OC / DC */}
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  fontSize: '0.8rem',
                  flexWrap: 'wrap',
                  minWidth: 0
                }}>
                  {hc && (
                    <span>
                      <span style={{ color: '#ff6b35', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>HC </span>
                      <span style={{ color: '#ccd6f6' }}>{hc.name}</span>
                    </span>
                  )}
                  {oc && (
                    <span>
                      <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OC </span>
                      <span style={{ color: '#ccd6f6' }}>{oc.name}</span>
                    </span>
                  )}
                  {dc && (
                    <span>
                      <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DC </span>
                      <span style={{ color: '#ccd6f6' }}>{dc.name}</span>
                    </span>
                  )}
                </div>

                {/* Staff count + expand indicator */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  flexShrink: 0
                }}>
                  {changes && (
                    <span style={{ 
                      fontSize: '0.65rem', 
                      color: '#8892b0',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px'
                    }}>
                      {changes.arrivals.length > 0 && <span style={{ color: '#4ade80' }}>+{changes.arrivals.length}</span>}
                      {changes.arrivals.length > 0 && changes.departures.length > 0 && ' '}
                      {changes.departures.length > 0 && <span style={{ color: '#f87171' }}>−{changes.departures.length}</span>}
                    </span>
                  )}
                  <span style={{ 
                    color: '#8892b0', 
                    fontSize: '0.75rem',
                    fontFamily: 'monospace'
                  }}>
                    {rawStaff.length}
                  </span>
                  <span style={{ 
                    color: '#8892b0',
                    fontSize: '0.75rem',
                    transition: 'transform 0.2s ease',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                  }}>
                    ▸
                  </span>
                </div>
              </div>

              {/* Expanded staff list */}
              {isExpanded && (
                <div style={{ 
                  padding: '0 1rem 0.75rem',
                  borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                  {/* Staff changes callout */}
                  {changes && (
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '0.5rem 0.75rem',
                      margin: '0.5rem 0',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      flexWrap: 'wrap'
                    }}>
                      {changes.arrivals.length > 0 && (
                        <div>
                          <span style={{ color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                            Arrivals:{' '}
                          </span>
                          <span style={{ color: '#8892b0' }}>
                            {changes.arrivals.map(a => a.name).join(', ')}
                          </span>
                        </div>
                      )}
                      {changes.departures.length > 0 && (
                        <div>
                          <span style={{ color: '#f87171', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                            Departures:{' '}
                          </span>
                          <span style={{ color: '#8892b0' }}>
                            {changes.departures.map(d => d.name).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Staff grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '4px',
                    marginTop: '0.5rem'
                  }}>
                    {staff.map((member, idx) => (
                      <div
                        key={`${member.name}-${member.position}-${idx}`}
                        onClick={() => onSelectCoach?.(member._coachRef)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.15rem',
                          padding: '0.4rem 0.6rem',
                          background: getPositionBadgeBg(member.position),
                          borderRadius: '5px',
                          cursor: 'pointer',
                          borderLeft: `2px solid ${getPositionColor(member.position)}`,
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = getPositionBadgeBg(member.position);
                        }}
                      >
                        <span style={{
                          color: getPositionColor(member.position),
                          fontWeight: 700,
                          fontSize: '0.6rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          lineHeight: 1.2
                        }}>
                          {member.position || 'Staff'}
                        </span>
                        <span style={{ 
                          color: '#ccd6f6', 
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          lineHeight: 1.2
                        }}>
                          {member.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  {staff.length === 0 && (
                    <div style={{ color: '#555', fontSize: '0.8rem', padding: '0.5rem', textAlign: 'center' }}>
                      No coaches match the current filter
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {displayYears.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#8892b0'
        }}>
          No coaching history found for {selectedSchool}
        </div>
      )}
    </div>
  );
}
