import React, { useState, useMemo } from 'react';
import { TeamWithLogo, TeamLogo } from './teamLogos';

// Reuse your existing getPositionType function
const getPositionType = (position) => {
  if (!position) return null;
  const pos = position.toLowerCase();
  
  const isHC = pos === 'head coach' || 
               pos.startsWith('head coach/') || 
               pos.startsWith('head coach,') ||
               pos.startsWith('head coach &') ||
               pos === 'head coach/general manager' ||
               (pos.includes('interim head coach') && !pos.includes('assistant')) ||
               (pos.includes('head football coach'));
  if (isHC) {
    return 'hc';
  }
  
  if (pos.includes('offensive coordinator') || 
      pos.includes('co-offensive coordinator') ||
      /\boc\b/.test(pos) ||
      /\boc\//.test(pos) ||
      /\/oc\b/.test(pos)) {
    return 'oc';
  }
  
  if (pos.includes('defensive coordinator') || 
      pos.includes('co-defensive coordinator') ||
      /\bdc\b/.test(pos) ||
      /\bdc\//.test(pos) ||
      /\/dc\b/.test(pos)) {
    return 'dc';
  }
  
  return null;
};

// Normalize team name from coaches data to stats format
const normalizeTeamForStats = (team) => {
  if (!team) return '';
  
  const teamMappings = {
    'appalachian state': 'App State',
    'arizona state': 'Arizona St',
    'arkansas state': 'Arkansas St',
    'ball state': 'Ball St',
    'boise state': 'Boise St',
    'central michigan': 'C Michigan',
    'coastal carolina': 'Coastal Car',
    'colorado state': 'Colorado St',
    'east carolina': 'E Carolina',
    'eastern michigan': 'E Michigan',
    'florida state': 'Florida St',
    'florida international': 'Florida Intl',
    'fiu': 'Florida Intl',
    'fresno state': 'Fresno St',
    'georgia southern': 'Georgia So',
    'georgia state': 'Georgia St',
    'iowa state': 'Iowa St',
    'james madison': 'J Madison',
    'jacksonville state': 'Jacksonville St',
    'kansas state': 'Kansas St',
    'kennesaw state': 'Kennesaw St',
    'kent state': 'Kent St',
    'louisiana state': 'LSU',
    'michigan state': 'Michigan St',
    'middle tennessee': 'Middle Tenn',
    'mississippi state': 'Mississippi St',
    'new mexico state': 'New Mexico St',
    'north carolina state': 'NC State',
    'nc state': 'NC State',
    'north texas': 'N Texas',
    'northern illinois': 'N Illinois',
    'ohio state': 'Ohio St',
    'oklahoma state': 'Oklahoma St',
    'oregon state': 'Oregon St',
    'penn state': 'Penn St',
    'south alabama': 'S Alabama',
    'south florida': 'S Florida',
    'san diego state': 'San Diego St',
    'san jose state': 'San Jose St',
    'southern california': 'USC',
    'southern methodist': 'SMU',
    'southern mississippi': 'Southern Miss',
    'texas christian': 'TCU',
    'texas state': 'Texas St',
    'louisiana-monroe': 'UL Monroe',
    'utah state': 'Utah St',
    'washington state': 'Washington St',
    'western michigan': 'W Michigan',
    'western kentucky': 'W Kentucky',
    'central florida': 'UCF',
    'massachusetts': 'UMass',
    'connecticut': 'UConn',
    'miami (fl)': 'Miami',
    'miami (oh)': 'Miami OH',
    'ole miss': 'Mississippi',
  };
  
  const normalized = team.toLowerCase().trim();
  return teamMappings[normalized] || team;
};

// Stats abbreviation -> Full display name (for consistent display across app)
const statsToDisplayName = {
  'App State': 'Appalachian State',
  'Arizona St': 'Arizona State',
  'Arkansas St': 'Arkansas State',
  'Ball St': 'Ball State',
  'Boise St': 'Boise State',
  'C Michigan': 'Central Michigan',
  'Coastal Car': 'Coastal Carolina',
  'Colorado St': 'Colorado State',
  'E Carolina': 'East Carolina',
  'E Michigan': 'Eastern Michigan',
  'Florida Intl': 'FIU',
  'Florida St': 'Florida State',
  'Fresno St': 'Fresno State',
  'Georgia So': 'Georgia Southern',
  'Georgia St': 'Georgia State',
  "Hawai&#039;i": "Hawai'i",
  'Iowa St': 'Iowa State',
  'J Madison': 'James Madison',
  'Jacksonville St': 'Jacksonville State',
  'Kansas St': 'Kansas State',
  'Kennesaw St': 'Kennesaw State',
  'Kent St': 'Kent State',
  'Miami OH': 'Miami (OH)',
  'Michigan St': 'Michigan State',
  'Middle Tenn': 'Middle Tennessee',
  'Mississippi': 'Ole Miss',
  'Mississippi St': 'Mississippi State',
  'Missouri St': 'Missouri State',
  'N Illinois': 'Northern Illinois',
  'N Texas': 'North Texas',
  'New Mexico St': 'New Mexico State',
  'Ohio St': 'Ohio State',
  'Oklahoma St': 'Oklahoma State',
  'Oregon St': 'Oregon State',
  'Penn St': 'Penn State',
  'S Alabama': 'South Alabama',
  'S Florida': 'South Florida',
  'San Diego St': 'San Diego State',
  'San Jose St': 'San José State',
  'Southern Miss': 'Southern Miss',
  'Texas St': 'Texas State',
  'UL Monroe': 'Louisiana–Monroe',
  'UMass': 'UMass',
  'Utah St': 'Utah State',
  'W Kentucky': 'Western Kentucky',
  'W Michigan': 'Western Michigan',
  'Washington St': 'Washington State',
};

// Reverse mapping: stats abbreviation -> full name (for advanced stats lookup)
const statsToFullName = {
  'Arizona St': 'Arizona State',
  'Arkansas St': 'Arkansas State',
  'Ball St': 'Ball State',
  'Boise St': 'Boise State',
  'C Michigan': 'Central Michigan',
  'Coastal Car': 'Coastal Carolina',
  'Colorado St': 'Colorado State',
  'E Carolina': 'East Carolina',
  'E Michigan': 'Eastern Michigan',
  'Florida Intl': 'Florida International',
  'Florida St': 'Florida State',
  'Fresno St': 'Fresno State',
  'Georgia So': 'Georgia Southern',
  'Georgia St': 'Georgia State',
  "Hawai&#039;i": "Hawai'i",
  'Iowa St': 'Iowa State',
  'J Madison': 'James Madison',
  'Jacksonville St': 'Jacksonville State',
  'Kansas St': 'Kansas State',
  'Kennesaw St': 'Kennesaw State',
  'Kent St': 'Kent State',
  'Miami OH': 'Miami (OH)',
  'Michigan St': 'Michigan State',
  'Middle Tenn': 'Middle Tennessee',
  'Mississippi': 'Ole Miss',
  'Mississippi St': 'Mississippi State',
  'Missouri St': 'Missouri State',
  'N Illinois': 'Northern Illinois',
  'N Texas': 'North Texas',
  'New Mexico St': 'New Mexico State',
  'Ohio St': 'Ohio State',
  'Oklahoma St': 'Oklahoma State',
  'Oregon St': 'Oregon State',
  'Penn St': 'Penn State',
  'S Alabama': 'South Alabama',
  'S Florida': 'South Florida',
  'San Diego St': 'San Diego State',
  'San Jose St': 'San José State',
  'Southern Miss': 'Southern Mississippi',
  'Texas St': 'Texas State',
  'UMass': 'Massachusetts',
  'Utah St': 'Utah State',
  'W Kentucky': 'Western Kentucky',
  'W Michigan': 'Western Michigan',
  'Washington St': 'Washington State',
};

// Get display name for a stats team (use full name for consistency)
const getDisplayName = (statsTeam) => {
  return statsToDisplayName[statsTeam] || statsToFullName[statsTeam] || statsTeam;
};

// Format salary for display
const formatSalary = (amount) => {
  if (!amount) return null;
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}K`;
  }
  return `$${amount.toLocaleString()}`;
};

// Get salary info for a coach
const getSalaryInfo = (coach) => {
  if (!coach?.salary?.length) return null;
  const salaryEntry = coach.salary[0];
  const amount = salaryEntry['2024'];
  if (amount) {
    return {
      amount,
      formatted: formatSalary(amount),
      school: salaryEntry.school || null
    };
  }
  return null;
};

// Calculate age from birthdate
const calculateAge = (birthdate) => {
  if (!birthdate) return null;
  const birthDate = new Date(birthdate);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Get rank color
const getRankColor = (rank) => {
  if (rank <= 10) return '#4ade80';
  if (rank <= 25) return '#a3e635';
  if (rank <= 50) return '#facc15';
  if (rank <= 75) return '#fb923c';
  if (rank <= 100) return '#f87171';
  return '#ef4444';
};

// Helper to safely format alma_mater for display
const formatAlmaMater = (almaMater) => {
  if (!almaMater) return null;
  
  // Handle string
  if (typeof almaMater === 'string') return almaMater;
  
  // Handle object with {school, year, degree}
  if (typeof almaMater === 'object' && !Array.isArray(almaMater)) {
    if (almaMater.school) {
      return almaMater.year ? `${almaMater.school} ('${String(almaMater.year).slice(-2)})` : almaMater.school;
    }
    return null;
  }
  
  // Handle array
  if (Array.isArray(almaMater) && almaMater.length > 0) {
    const first = almaMater[0];
    if (typeof first === 'string') return first;
    if (typeof first === 'object' && first.school) {
      return first.year ? `${first.school} ('${String(first.year).slice(-2)})` : first.school;
    }
  }
  
  return null;
};

export default function ByStatsTable({ coachesData = [], statsData = null, onCoachClick }) {
  const [activeTab, setActiveTab] = useState('offense'); // 'offense' or 'defense'
  const [sortConfig, setSortConfig] = useState({ key: 'ppg', direction: 'desc' });
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025'); // NEW: Year selector

  // Available years (based on stats data)
  const availableYears = useMemo(() => {
    if (!statsData?.offense?.PointsPerGame) return ['2025'];
    const years = new Set();
    Object.values(statsData.offense.PointsPerGame).forEach(teamData => {
      Object.keys(teamData).forEach(year => years.add(year));
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
  }, [statsData]);

  // Get all FBS teams from stats data for selected year
  const allTeams = useMemo(() => {
    if (!statsData?.offense?.PointsPerGame) return [];
    // Get teams that have data for the selected year
    return Object.entries(statsData.offense.PointsPerGame)
      .filter(([team, data]) => data[selectedYear] !== undefined)
      .map(([team]) => team)
      .sort();
  }, [statsData, selectedYear]);

  // Build stats for each team based on selected year
  const teamStats = useMemo(() => {
    if (!statsData) return [];

    return allTeams.map(team => {
      // Helper to get stat value for selected year
      const getStat = (category, statKey) => {
        return statsData[category]?.[statKey]?.[team]?.[selectedYear] || null;
      };

      // Get advanced stats (uses full team names)
      const getAdvanced = (category) => {
        // Try abbreviated name first
        let result = statsData[category]?.[selectedYear]?.[team];
        if (result) return result;
        
        // Try full name mapping
        const fullName = statsToFullName[team];
        if (fullName) {
          result = statsData[category]?.[selectedYear]?.[fullName];
          if (result) return result;
        }
        
        // Try without "State" suffix variations
        const variations = [
          team,
          team.replace(' St', ' State'),
          team.replace('St', 'State'),
        ];
        
        for (const variant of variations) {
          result = statsData[category]?.[selectedYear]?.[variant];
          if (result) return result;
        }
        
        return null;
      };

      return {
        team,
        displayName: getDisplayName(team), // Use full display name
        offense: {
          ppg: getStat('offense', 'PointsPerGame'),
          ypg: getStat('offense', 'YardsPerGame'),
          rushYpg: getStat('offense', 'RushYardsPerGame'),
          passYpg: getStat('offense', 'PassYardsPerGame'),
          ypa: getStat('offense', 'YardsPerPassAtt'),
          sacked: getStat('offense', 'QBSackedPerGame'),
          advanced: getAdvanced('advancedOffense')
        },
        defense: {
          ppg: getStat('defense', 'OppPointsPerGame'),
          ypg: getStat('defense', 'OppYardsPerGame'),
          rushYpg: getStat('defense', 'OppRushYPG'),
          passYpg: getStat('defense', 'OppPassYPG'),
          sacks: getStat('defense', 'SacksPerGame'),
          takeaways: getStat('defense', 'TakeawaysPerGame'),
          advanced: getAdvanced('advancedDefense')
        }
      };
    });
  }, [statsData, allTeams, selectedYear]);

  // Pre-compute coordinator lookup table ONCE when data loads
  // Structure: { normalizedTeam: { year: { offense: [...], defense: [...] } } }
  const coordinatorLookup = useMemo(() => {
    const lookup = {};
    
    coachesData.forEach(coach => {
      if (!coach.coaching_career) return;
      
      coach.coaching_career.forEach(job => {
        const posType = getPositionType(job.position);
        if (!posType || posType === 'hc') return; // Only OC/DC
        
        const type = posType === 'oc' ? 'offense' : 'defense';
        const normalizedTeam = normalizeTeamForStats(job.school);
        const startYear = job.years?.start;
        const endYear = job.years?.end || new Date().getFullYear();
        
        if (!startYear) return;
        
        // Add to lookup for each year they held this position
        for (let year = startYear; year <= Math.min(endYear, 2025); year++) {
          const yearStr = String(year);
          
          // Initialize nested structure
          if (!lookup[normalizedTeam]) lookup[normalizedTeam] = {};
          if (!lookup[normalizedTeam][yearStr]) lookup[normalizedTeam][yearStr] = { offense: [], defense: [] };
          
          // Also index by original team name for matching
          const origTeam = job.school;
          if (!lookup[origTeam]) lookup[origTeam] = {};
          if (!lookup[origTeam][yearStr]) lookup[origTeam][yearStr] = { offense: [], defense: [] };
          
          // Check for duplicates before adding
          const targetArray = lookup[normalizedTeam][yearStr][type];
          if (!targetArray.find(c => c.name === coach.name)) {
            const coordEntry = {
              ...coach,
              positionThatYear: job.position,
              teamThatYear: job.school,
              isStillThere: normalizeTeamForStats(coach.currentTeam) === normalizedTeam ||
                           coach.currentTeam === normalizedTeam ||
                           normalizeTeamForStats(coach.currentTeam)?.toLowerCase() === normalizedTeam.toLowerCase()
            };
            targetArray.push(coordEntry);
            
            // Also add to original team name if different
            if (origTeam !== normalizedTeam) {
              if (!lookup[origTeam][yearStr][type].find(c => c.name === coach.name)) {
                lookup[origTeam][yearStr][type].push(coordEntry);
              }
            }
          }
        }
      });
    });
    
    return lookup;
  }, [coachesData]);

  // O(1) lookup for coordinators
  const getCoordinatorsForTeam = (statsTeam, type, year) => {
    return coordinatorLookup[statsTeam]?.[year]?.[type] || [];
  };

  // Column definitions
  const offenseColumns = [
    { key: 'ppg', label: 'PPG', decimals: 1, tooltip: 'Points Per Game' },
    { key: 'ypg', label: 'YPG', decimals: 1, tooltip: 'Yards Per Game' },
    { key: 'passYpg', label: 'Pass', decimals: 1, tooltip: 'Pass Yards Per Game' },
    { key: 'rushYpg', label: 'Rush', decimals: 1, tooltip: 'Rush Yards Per Game' },
    { key: 'ypa', label: 'Y/A', decimals: 2, tooltip: 'Yards Per Pass Attempt' },
  ];

  const defenseColumns = [
    { key: 'ppg', label: 'PPG', decimals: 1, tooltip: 'Points Allowed Per Game' },
    { key: 'ypg', label: 'YPG', decimals: 1, tooltip: 'Yards Allowed Per Game' },
    { key: 'passYpg', label: 'Pass', decimals: 1, tooltip: 'Pass Yards Allowed' },
    { key: 'rushYpg', label: 'Rush', decimals: 1, tooltip: 'Rush Yards Allowed' },
    { key: 'sacks', label: 'Sacks', decimals: 2, tooltip: 'Sacks Per Game' },
    { key: 'takeaways', label: 'TO', decimals: 2, tooltip: 'Takeaways Per Game' },
  ];

  const advancedOffenseColumns = [
    { key: 'AdjEPAPlay', label: 'Adj EPA', decimals: 2 },
    { key: 'SRPct', label: 'SR%', decimals: 1, isPercent: true },
    { key: 'EPADB', label: 'EPA/DB', decimals: 2 },
    { key: 'EPARush', label: 'EPA/Rush', decimals: 2 },
    { key: 'HavocPct', label: 'Havoc%', decimals: 1, isPercent: true },
  ];

  const advancedDefenseColumns = [
    { key: 'AdjEPAPlay', label: 'Adj EPA', decimals: 2 },
    { key: 'SRPct', label: 'SR%', decimals: 1, isPercent: true },
    { key: 'HavocPct', label: 'Havoc%', decimals: 1, isPercent: true },
  ];

  const columns = activeTab === 'offense' ? offenseColumns : defenseColumns;
  const advancedColumns = activeTab === 'offense' ? advancedOffenseColumns : advancedDefenseColumns;

  // Sort and filter data
  const sortedData = useMemo(() => {
    let data = [...teamStats];

    // Filter by search
    if (searchTerm) {
      data = data.filter(item =>
        item.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortConfig.key) {
      data.sort((a, b) => {
        const side = activeTab;
        let aVal, bVal;

        // Check if it's an advanced stat
        if (advancedColumns.find(c => c.key === sortConfig.key)) {
          aVal = a[side].advanced?.[sortConfig.key]?.rank;
          bVal = b[side].advanced?.[sortConfig.key]?.rank;
        } else {
          aVal = a[side][sortConfig.key]?.rank;
          bVal = b[side][sortConfig.key]?.rank;
        }

        // Handle nulls - push them to the bottom
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        // For ranks, lower is better
        // 'desc' = best first (lowest ranks first), 'asc' = worst first (highest ranks first)
        return sortConfig.direction === 'desc' ? aVal - bVal : bVal - aVal;
      });
    }

    return data;
  }, [teamStats, sortConfig, searchTerm, activeTab, advancedColumns]);

  // Handle sort click
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Format stat cell
  const formatStatCell = (statData, decimals = 1, isPercent = false) => {
    if (!statData) return { display: '—', rank: null };
    const { value, rank } = statData;
    let display = isPercent 
      ? `${(value * 100).toFixed(decimals)}%` 
      : value.toFixed(decimals);
    return { display, rank };
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,107,53,0.15)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#ff6b35',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          📊 By Stats
        </h2>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(255,255,255,0.03)',
          padding: '0.25rem',
          borderRadius: '8px'
        }}>
          {[
            { id: 'offense', label: '🏈 Offense', color: '#4ade80' },
            { id: 'defense', label: '🛡️ Defense', color: '#60a5fa' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedTeam(null);
                setSortConfig({ key: 'ppg', direction: 'desc' });
              }}
              style={{
                padding: '0.5rem 1rem',
                background: activeTab === tab.id ? `${tab.color}20` : 'transparent',
                border: activeTab === tab.id ? `1px solid ${tab.color}50` : '1px solid transparent',
                borderRadius: '6px',
                color: activeTab === tab.id ? tab.color : '#8892b0',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Year Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ color: '#8892b0', fontSize: '0.85rem' }}>Season:</label>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setExpandedTeam(null);
            }}
            style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,107,53,0.3)',
              borderRadius: '8px',
              color: '#ff6b35',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {availableYears.map(year => (
              <option key={year} value={year} style={{ background: '#1a1f35' }}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.85rem',
            outline: 'none',
            width: '200px'
          }}
        />
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '1rem',
        fontSize: '0.75rem',
        color: '#8892b0'
      }}>
        <span>Regular Stats</span>
        <span style={{ color: '#a78bfa' }}>● Advanced Stats (2014+)</span>
        <span style={{ marginLeft: 'auto' }}>Click team for coordinator info</span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '8px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          minWidth: '900px'
        }}>
          <thead>
            <tr style={{ background: activeTab === 'offense' ? 'rgba(74,222,128,0.1)' : 'rgba(96,165,250,0.1)' }}>
              <th style={{
                padding: '0.75rem',
                textAlign: 'left',
                color: '#8892b0',
                fontWeight: 600,
                position: 'sticky',
                left: 0,
                background: '#0a0f1c',
                zIndex: 2,
                width: '160px'
              }}>
                Team
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  title={col.tooltip}
                  style={{
                    padding: '0.75rem 0.5rem',
                    textAlign: 'center',
                    color: sortConfig.key === col.key ? '#ff6b35' : '#8892b0',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s ease'
                  }}
                >
                  {col.label}
                  {sortConfig.key === col.key && (
                    <span style={{ marginLeft: '4px' }}>
                      {sortConfig.direction === 'desc' ? '↓' : '↑'}
                    </span>
                  )}
                </th>
              ))}
              {advancedColumns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{
                    padding: '0.75rem 0.5rem',
                    textAlign: 'center',
                    color: sortConfig.key === col.key ? '#ff6b35' : '#a78bfa',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s ease'
                  }}
                >
                  {col.label}
                  {sortConfig.key === col.key && (
                    <span style={{ marginLeft: '4px' }}>
                      {sortConfig.direction === 'desc' ? '↓' : '↑'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => {
              const isExpanded = expandedTeam === row.team;
              const coordinators = getCoordinatorsForTeam(row.team, activeTab, selectedYear);
              const side = activeTab;

              return (
                <React.Fragment key={row.team}>
                  {/* Main row */}
                  <tr
                    onClick={() => setExpandedTeam(isExpanded ? null : row.team)}
                    style={{
                      cursor: 'pointer',
                      background: isExpanded
                        ? 'rgba(255,107,53,0.1)'
                        : idx % 2 === 0
                          ? 'rgba(255,255,255,0.02)'
                          : 'transparent',
                      borderBottom: isExpanded ? 'none' : '1px solid rgba(255,255,255,0.03)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) e.currentTarget.style.background = 'rgba(255,107,53,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';
                    }}
                  >
                    <td style={{
                      padding: '0.75rem',
                      fontWeight: 600,
                      color: isExpanded ? '#ff6b35' : '#fff',
                      position: 'sticky',
                      left: 0,
                      background: isExpanded ? 'rgba(255,107,53,0.1)' : idx % 2 === 0 ? '#0d1220' : '#0a0f1c',
                      zIndex: 1
                    }}>
                      <span style={{ marginRight: '0.5rem', transition: 'transform 0.2s ease', display: 'inline-block', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)' }}>
                        ▶
                      </span>
                      <TeamLogo team={row.displayName} size={20} style={{ marginRight: '0.4rem' }} />
                      {row.displayName}
                    </td>
                    {columns.map(col => {
                      const { display, rank } = formatStatCell(row[side][col.key], col.decimals, col.isPercent);
                      return (
                        <td key={col.key} style={{ padding: '0.5rem', textAlign: 'center', fontFamily: 'monospace' }}>
                          {rank ? (
                            <>
                              <span style={{ color: getRankColor(rank) }}>#{rank}</span>
                              <span style={{ color: '#8892b0', fontSize: '0.7rem', marginLeft: '4px' }}>({display})</span>
                            </>
                          ) : (
                            <span style={{ color: '#555' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                    {advancedColumns.map(col => {
                      const advData = row[side].advanced?.[col.key];
                      const { display, rank } = formatStatCell(advData, col.decimals, col.isPercent);
                      return (
                        <td key={col.key} style={{ padding: '0.5rem', textAlign: 'center', fontFamily: 'monospace' }}>
                          {rank ? (
                            <>
                              <span style={{ color: getRankColor(rank) }}>#{rank}</span>
                              <span style={{ color: '#a78bfa', fontSize: '0.7rem', marginLeft: '4px' }}>({display})</span>
                            </>
                          ) : (
                            <span style={{ color: '#555' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Expanded coordinator info */}
                  {isExpanded && (
                    <tr>
                      <td
                        colSpan={columns.length + advancedColumns.length + 1}
                        style={{
                          padding: '1rem 1.5rem',
                          background: 'rgba(255,107,53,0.05)',
                          borderBottom: '1px solid rgba(255,107,53,0.2)'
                        }}
                      >
                        <div style={{
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '12px',
                          padding: '1.25rem'
                        }}>
                          <h4 style={{
                            color: activeTab === 'offense' ? '#4ade80' : '#60a5fa',
                            margin: '0 0 1rem 0',
                            fontSize: '0.9rem',
                            fontWeight: 700
                          }}>
                            {activeTab === 'offense' ? '🏈 Offensive' : '🛡️ Defensive'} Coordinator{coordinators.length > 1 ? 's' : ''} ({selectedYear})
                          </h4>

                          {coordinators.length > 0 ? (
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                              gap: '1rem'
                            }}>
                              {coordinators.map((coord, cIdx) => {
                                const salaryInfo = getSalaryInfo(coord);
                                const age = calculateAge(coord.birthdate);
                                const isCo = coord.positionThatYear?.toLowerCase().includes('co-');
                                const almaMaterDisplay = formatAlmaMater(coord.alma_mater);

                                return (
                                  <div
                                    key={cIdx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onCoachClick) onCoachClick(coord);
                                    }}
                                    style={{
                                      background: 'rgba(255,255,255,0.03)',
                                      border: '1px solid rgba(255,255,255,0.1)',
                                      borderRadius: '10px',
                                      padding: '1rem',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.borderColor = 'rgba(255,107,53,0.4)';
                                      e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                      e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    <div style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      marginBottom: '0.5rem',
                                      flexWrap: 'wrap'
                                    }}>
                                      <span style={{
                                        fontWeight: 700,
                                        color: '#fff',
                                        fontSize: '1rem'
                                      }}>
                                        {coord.name}
                                      </span>
                                      {isCo && (
                                        <span style={{
                                          background: 'rgba(167,139,250,0.3)',
                                          color: '#a78bfa',
                                          padding: '0.15rem 0.5rem',
                                          borderRadius: '100px',
                                          fontSize: '0.65rem',
                                          fontWeight: 600
                                        }}>
                                          Co-{activeTab === 'offense' ? 'OC' : 'DC'}
                                        </span>
                                      )}
                                    </div>

                                    {/* Position that year */}
                                    <div style={{
                                      color: '#8892b0',
                                      fontSize: '0.8rem',
                                      marginBottom: '0.5rem'
                                    }}>
                                      {coord.positionThatYear || coord.currentPosition}
                                    </div>

                                    {/* Current status - where are they now? */}
                                    {!coord.isStillThere && coord.currentTeam && (
                                      <div style={{
                                        background: 'rgba(255,107,53,0.15)',
                                        border: '1px solid rgba(255,107,53,0.3)',
                                        borderRadius: '6px',
                                        padding: '0.5rem 0.75rem',
                                        marginBottom: '0.75rem',
                                        fontSize: '0.75rem'
                                      }}>
                                        <span style={{ color: '#ff6b35', fontWeight: 600 }}>Now: </span>
                                        <span style={{ color: '#fff' }}>{coord.currentPosition}</span>
                                        <span style={{ color: '#8892b0' }}> at </span>
                                        <span style={{ color: '#fff', fontWeight: 600 }}>
                                          <TeamLogo team={coord.currentTeam} size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                          {coord.currentTeam}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {coord.isStillThere && (
                                      <div style={{
                                        background: 'rgba(74,222,128,0.15)',
                                        border: '1px solid rgba(74,222,128,0.3)',
                                        borderRadius: '6px',
                                        padding: '0.5rem 0.75rem',
                                        marginBottom: '0.75rem',
                                        fontSize: '0.75rem',
                                        color: '#4ade80'
                                      }}>
                                        ✓ Still at {row.displayName}
                                      </div>
                                    )}

                                    <div style={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: '0.75rem',
                                      fontSize: '0.75rem'
                                    }}>
                                      {almaMaterDisplay && (
                                        <span style={{ color: '#ccd6f6' }}>
                                          🎓 {almaMaterDisplay}
                                        </span>
                                      )}
                                      {age && (
                                        <span style={{ color: '#ccd6f6' }}>
                                          📅 Age {age}
                                        </span>
                                      )}
                                      {salaryInfo && (
                                        <span style={{ color: '#4ade80' }}>
                                          💰 {salaryInfo.formatted}
                                        </span>
                                      )}
                                    </div>

                                    {coord.url && (
                                      <a
                                        href={coord.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                          display: 'inline-block',
                                          marginTop: '0.75rem',
                                          fontSize: '0.7rem',
                                          color: '#8892b0',
                                          textDecoration: 'none'
                                        }}
                                      >
                                        Wikipedia →
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div style={{
                              color: '#8892b0',
                              fontStyle: 'italic',
                              fontSize: '0.85rem'
                            }}>
                              No {activeTab === 'offense' ? 'offensive' : 'defensive'} coordinator data available for {row.displayName} in {selectedYear}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.75rem',
        color: '#8892b0',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Showing {sortedData.length} of {allTeams.length} teams ({selectedYear} stats)</span>
        <span>Lower rank = better performance</span>
      </div>
    </div>
  );
}
