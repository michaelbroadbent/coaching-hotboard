import React, { useState, useMemo, useEffect } from 'react';
import ByStatsTable from './ByStatsTable';
import StaffHistory from './StaffHistory';
import { TeamWithLogo, TeamLogo, getTeamLogoUrl } from './teamLogos';
import SchoolRoster from './SchoolRoster';
import { supabase } from './supabaseClient';

// ═══════════════════════════════════════════════════════════════════════════
// SCHOOL NAME CANONICALIZATION
// Maps variant names to canonical forms for consistent display and matching
// ═══════════════════════════════════════════════════════════════════════════

const SCHOOL_CANONICAL_MAP = {
  // Big names with common variants
  "university of alabama": "Alabama",
  "alabama crimson tide": "Alabama",
  "university of alabama at birmingham": "UAB",
  "alabama-birmingham": "UAB",
  "university of alabama: birmingham": "UAB",
  "uab": "UAB",
  "alabama state university": "Alabama State",
  
  "university of michigan": "Michigan",
  "michigan wolverines": "Michigan",
  "michigan state university": "Michigan State",
  "western michigan university": "Western Michigan",
  "eastern michigan university": "Eastern Michigan",
  "central michigan university": "Central Michigan",
  "northern michigan university": "Northern Michigan",
  
  "university of florida": "Florida",
  "florida gators": "Florida",
  "florida state university": "Florida State",
  "university of central florida": "UCF",
  "central florida": "UCF",
  "ucf": "UCF",
  "florida international university": "FIU",
  "florida international": "FIU",
  "fiu": "FIU",
  "florida atlantic university": "Florida Atlantic",
  "fau": "Florida Atlantic",
  
  "university of georgia": "Georgia",
  "georgia bulldogs": "Georgia",
  "georgia state university": "Georgia State",
  "georgia southern university": "Georgia Southern",
  "georgia institute of technology": "Georgia Tech",
  
  "university of texas": "Texas",
  "texas longhorns": "Texas",
  "texas tech university": "Texas Tech",
  "university of texas at el paso": "UTEP",
  "utep": "UTEP",
  "texas a&m university": "Texas A&M",
  "texas a&m university - commerce": "Texas A&M–Commerce",
  "texas a&m university–commerce": "Texas A&M–Commerce",
  "texas a&m-commerce": "Texas A&M–Commerce",
  "university of north texas": "North Texas",
  "texas state university": "Texas State",
  "university of texas at san antonio": "UTSA",
  "utsa": "UTSA",
  
  "ohio state university": "Ohio State",
  "the ohio state university": "Ohio State",
  "ohio state buckeyes": "Ohio State",
  "ohio university": "Ohio",
  "bowling green state university": "Bowling Green",
  "kent state university": "Kent State",
  "miami university": "Miami (OH)",
  "miami (ohio)": "Miami (OH)",
  "miami redhawks": "Miami (OH)",
  
  "penn state university": "Penn State",
  "pennsylvania state university": "Penn State",
  "university of pennsylvania": "Penn",
  "temple university": "Temple",
  
  "university of oregon": "Oregon",
  "oregon ducks": "Oregon",
  "oregon state university": "Oregon State",
  "eastern oregon university": "Eastern Oregon",
  "southern oregon university": "Southern Oregon",
  "western oregon university": "Western Oregon",
  "portland state university": "Portland State",
  
  "university of tennessee": "Tennessee",
  "tennessee volunteers": "Tennessee",
  "university of tennessee at chattanooga": "Chattanooga",
  "tennessee-chattanooga": "Chattanooga",
  "middle tennessee state university": "Middle Tennessee",
  "middle tennessee state": "Middle Tennessee",
  "tennessee tech university": "Tennessee Tech",
  "tennessee state university": "Tennessee State",
  "east tennessee state university": "East Tennessee State",
  
  "university of south carolina": "South Carolina",
  "south carolina gamecocks": "South Carolina",
  "university of north carolina": "North Carolina",
  "north carolina state university": "NC State",
  "nc state": "NC State",
  "n.c. state": "NC State",
  "north carolina state": "NC State",
  "east carolina university": "East Carolina",
  "western carolina university": "Western Carolina",
  "coastal carolina university": "Coastal Carolina",
  "appalachian state university": "Appalachian State",
  
  "west virginia university": "West Virginia",
  "virginia tech university": "Virginia Tech",
  "virginia polytechnic institute": "Virginia Tech",
  "university of virginia": "Virginia",
  "old dominion university": "Old Dominion",
  "james madison university": "James Madison",
  
  "western kentucky university": "Western Kentucky",
  "eastern kentucky university": "Eastern Kentucky",
  "university of kentucky": "Kentucky",
  "university of louisville": "Louisville",
  "murray state university": "Murray State",
  "morehead state university": "Morehead State",
  
  "louisiana state university": "LSU",
  "lsu tigers": "LSU",
  "lsu": "LSU",
  "louisiana-lafayette": "Louisiana",
  "louisiana lafayette": "Louisiana",
  "ul lafayette": "Louisiana",
  "louisiana-monroe": "Louisiana–Monroe",
  "louisiana monroe": "Louisiana–Monroe",
  "university of louisiana at lafayette": "Louisiana",
  "university of louisiana at monroe": "Louisiana–Monroe",
  "louisiana tech university": "Louisiana Tech",
  "southeastern louisiana university": "Southeastern Louisiana",
  "northwestern state university": "Northwestern State",
  
  "university of mississippi": "Ole Miss",
  "mississippi": "Ole Miss",
  "mississippi state university": "Mississippi State",
  "southern mississippi": "Southern Miss",
  "university of southern mississippi": "Southern Miss",
  "jackson state university": "Jackson State",
  
  "brigham young university": "BYU",
  "brigham young": "BYU",
  "byu": "BYU",
  
  "university of miami": "Miami (FL)",
  "miami hurricanes": "Miami (FL)",
  "miami": "Miami (FL)",
  
  "university of pittsburgh": "Pittsburgh",
  "pitt panthers": "Pittsburgh",
  "pitt": "Pittsburgh",
  
  "university of southern california": "USC",
  "southern california": "USC",
  "usc": "USC",
  
  "university of connecticut": "UConn",
  "connecticut huskies": "UConn",
  "connecticut": "UConn",
  "uconn": "UConn",
  
  "university of massachusetts": "UMass",
  "massachusetts": "UMass",
  "umass": "UMass",
  
  "university of notre dame": "Notre Dame",
  "notre dame fighting irish": "Notre Dame",
  
  "sam houston state university": "Sam Houston State",
  "sam houston": "Sam Houston State",
  
  "california university of pennsylvania": "Cal U (PA)",
  "clarion university of pennsylvania": "Clarion",
  
  // More state schools
  "university of arizona": "Arizona",
  "arizona state university": "Arizona State",
  "university of utah": "Utah",
  "utah state university": "Utah State",
  "university of colorado": "Colorado",
  "colorado state university": "Colorado State",
  "university of wyoming": "Wyoming",
  
  "university of washington": "Washington",
  "washington state university": "Washington State",
  "eastern washington university": "Eastern Washington",
  "central washington university": "Central Washington",
  
  "university of california, los angeles": "UCLA",
  "ucla": "UCLA",
  "university of california, berkeley": "California",
  "cal": "California",
  "stanford university": "Stanford",
  "san diego state university": "San Diego State",
  "sdsu": "San Diego State",
  "san jose state university": "San Jose State",
  "sjsu": "San Jose State",
  "fresno state university": "Fresno State",
  "unlv": "UNLV",
  "university of nevada, las vegas": "UNLV",
  "smu": "SMU",
  "southern methodist university": "SMU",
  "southern methodist": "SMU",
  "tcu": "TCU",
  "texas christian university": "TCU",
  "texas christian": "TCU",
  
  "university of iowa": "Iowa",
  "iowa state university": "Iowa State",
  "university of northern iowa": "Northern Iowa",
  
  "university of kansas": "Kansas",
  "kansas state university": "Kansas State",
  
  "university of missouri": "Missouri",
  "missouri state university": "Missouri State",
  "central missouri state": "Central Missouri",
  "central missouri state university": "Central Missouri",
  "university of central missouri": "Central Missouri",
  "southeast missouri state": "Southeast Missouri State",
  "southeast missouri state university": "Southeast Missouri State",
  "northwest missouri state": "Northwest Missouri State",
  "northwest missouri state university": "Northwest Missouri State",
  "missouri western state": "Missouri Western",
  "missouri western state university": "Missouri Western",
  "missouri southern state": "Missouri Southern",
  "missouri southern state university": "Missouri Southern",
  
  "university of nebraska": "Nebraska",
  "university of oklahoma": "Oklahoma",
  "oklahoma state university": "Oklahoma State",
  "central oklahoma": "Central Oklahoma",
  "university of central oklahoma": "Central Oklahoma",
  
  "university of arkansas": "Arkansas",
  "arkansas state university": "Arkansas State",
  "arkansas state": "Arkansas State",
  "central arkansas": "Central Arkansas",
  "university of central arkansas": "Central Arkansas",
  
  "university of wisconsin": "Wisconsin",
  "university of minnesota": "Minnesota",
  "university of illinois": "Illinois",
  "northwestern university": "Northwestern",
  "purdue university": "Purdue",
  "indiana university": "Indiana",
  "ball state university": "Ball State",
  
  "rutgers university": "Rutgers",
  "syracuse university": "Syracuse",
  "boston college": "Boston College",
  "boston university": "Boston University",
  
  // FCS Schools
  "north dakota state university": "North Dakota State",
  "south dakota state university": "South Dakota State",
  "university of north dakota": "North Dakota",
  "university of south dakota": "South Dakota",
  "montana state university": "Montana State",
  "university of montana": "Montana",
  
  // D2/D3 Schools that appear often
  "adrian": "Adrian",
  "adrian college": "Adrian",
  "ashland": "Ashland",
  "ashland university": "Ashland",
  "augustana": "Augustana",
  "augustana college": "Augustana",
  "bemidji state": "Bemidji State",
  "bemidji state university": "Bemidji State",
  "central washington": "Central Washington",
  "concordia": "Concordia",
  "concordia university": "Concordia",
  "delta state": "Delta State",
  "delta state university": "Delta State",
  "emporia state": "Emporia State",
  "emporia state university": "Emporia State",
  "ferris state": "Ferris State",
  "ferris state university": "Ferris State",
  "findlay": "Findlay",
  "university of findlay": "Findlay",
  "fort hays state": "Fort Hays State",
  "fort hays state university": "Fort Hays State",
  "grand valley state": "Grand Valley State",
  "grand valley state university": "Grand Valley State",
  "henderson state": "Henderson State",
  "henderson state university": "Henderson State",
  "hillsdale": "Hillsdale",
  "hillsdale college": "Hillsdale",
  "indianapolis": "Indianapolis",
  "university of indianapolis": "Indianapolis",
  "lenoir-rhyne": "Lenoir-Rhyne",
  "lenoir-rhyne university": "Lenoir-Rhyne",
  "lindenwood": "Lindenwood",
  "lindenwood university": "Lindenwood",
  "mary": "Mary",
  "university of mary": "Mary",
  "midwestern state": "Midwestern State",
  "midwestern state university": "Midwestern State",
  "minnesota state": "Minnesota State",
  "minnesota state university": "Minnesota State",
  "minnesota state mankato": "Minnesota State",
  "pittsburg state": "Pittsburg State",
  "pittsburg state university": "Pittsburg State",
  "saginaw valley state": "Saginaw Valley State",
  "saginaw valley state university": "Saginaw Valley State",
  "shepherd": "Shepherd",
  "shepherd university": "Shepherd",
  "shippensburg": "Shippensburg",
  "shippensburg university": "Shippensburg",
  "sioux falls": "Sioux Falls",
  "university of sioux falls": "Sioux Falls",
  "slippery rock": "Slippery Rock",
  "slippery rock university": "Slippery Rock",
  "southwest baptist": "Southwest Baptist",
  "southwest baptist university": "Southwest Baptist",
  "tarleton state": "Tarleton State",
  "tarleton state university": "Tarleton State",
  "texas a&m-kingsville": "Texas A&M–Kingsville",
  "texas a&m university-kingsville": "Texas A&M–Kingsville",
  "truman state": "Truman State",
  "truman state university": "Truman State",
  "tuskegee": "Tuskegee",
  "tuskegee university": "Tuskegee",
  "valdosta state": "Valdosta State",
  "valdosta state university": "Valdosta State",
  "washburn": "Washburn",
  "washburn university": "Washburn",
  "wayne state": "Wayne State",
  "wayne state university": "Wayne State",
  "west alabama": "West Alabama",
  "university of west alabama": "West Alabama",
  "west georgia": "West Georgia",
  "university of west georgia": "West Georgia",
  "west texas a&m": "West Texas A&M",
  "west texas a&m university": "West Texas A&M",
  "western oregon": "Western Oregon",
  "winona state": "Winona State",
  "winona state university": "Winona State",
  
  // Service academies
  "united states military academy": "Army",
  "united states naval academy": "Navy",
  "united states air force academy": "Air Force",
};

// ═══════════════════════════════════════════════════════════════════════════
// CACHING FOR PERFORMANCE
// ═══════════════════════════════════════════════════════════════════════════
const canonicalCache = new Map();
const schoolMatchCache = new Map();

// Normalize school names for matching - canonicalize known schools
const normalizeSchool = (name) => {
  if (!name) return '';
  const lower = name.toLowerCase().trim();
  return SCHOOL_CANONICAL_MAP[lower] || name;
};

// Get canonical name for display (used in dropdowns, lists) - WITH CACHING
const canonicalizeSchoolName = (name) => {
  if (!name) return name;
  
  // Check cache first
  if (canonicalCache.has(name)) {
    return canonicalCache.get(name);
  }
  
  let normalized = name.trim();
  const lower = normalized.toLowerCase();
  
  // Check direct mapping first
  if (SCHOOL_CANONICAL_MAP[lower]) {
    const result = SCHOOL_CANONICAL_MAP[lower];
    canonicalCache.set(name, result);
    return result;
  }
  
  // Expand common abbreviations BEFORE other transformations
  normalized = normalized
    .replace(/\bSt\.\s*/gi, 'State ')  // "St." -> "State"
    .replace(/\bU\.\s*/gi, 'University ')  // "U." -> "University"
    .replace(/\bUniv\.\s*/gi, 'University ')  // "Univ." -> "University"
    .replace(/\s+/g, ' ')  // Clean up multiple spaces
    .trim();
  
  // Check mapping again after expansion
  const expandedLower = normalized.toLowerCase();
  if (SCHOOL_CANONICAL_MAP[expandedLower]) {
    const result = SCHOOL_CANONICAL_MAP[expandedLower];
    canonicalCache.set(name, result);
    return result;
  }
  
  // Strip common suffixes if no direct mapping
  let result = normalized
    // "X State University" -> "X State"
    .replace(/\s+State\s+University$/i, ' State')
    // "University of X" -> "X" (but not "University of X at Y")
    .replace(/^University\s+of\s+(?!.*\s+at\s+)/i, '')
    // "X University" at end -> "X"
    .replace(/\s+University$/i, '')
    // "X College" at end -> "X"
    .replace(/\s+College$/i, '')
    .trim();
  
  // Final check after stripping
  const strippedLower = result.toLowerCase();
  if (SCHOOL_CANONICAL_MAP[strippedLower]) {
    result = SCHOOL_CANONICAL_MAP[strippedLower];
  }
  
  canonicalCache.set(name, result);
  return result;
};

// Format year range - show single year if start equals end, show "present" if raw_years contains it
const formatYearRange = (start, end, rawYears = null) => {
  // Handle null/undefined years
  if (start == null && end == null) {
    return null; // Will be filtered out in display
  }
  if (start == null) {
    return `–${end}`;
  }
  if (end == null) {
    return `${start}–`;
  }
  
  // Check if raw_years contains "present"
  if (rawYears && rawYears.toLowerCase().includes('present')) {
    return `${start}–present`;
  }
  // Treat current year or next year as "present" (roster scrape uses 2026 for current jobs)
  const currentYear = new Date().getFullYear();
  if (end >= currentYear) {
    return `${start}–present`;
  }
  if (start === end) return `${start}`;
  return `${start}–${end}`;
};

// Calculate age from birthdate string (format: "YYYY-MM-DD" or "Month DD, YYYY")
const calculateAge = (birthdate) => {
  if (!birthdate) return null;
  
  let birthDate;
  
  // Try parsing ISO format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
    birthDate = new Date(birthdate);
  } else {
    // Try parsing "Month DD, YYYY" format
    birthDate = new Date(birthdate);
  }
  
  if (isNaN(birthDate.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Estimate age from alma mater graduation year (assumes graduation at ~22)
const estimateAgeFromAlmaMater = (almaMater) => {
  if (!almaMater) return null;
  
  let gradYear = null;
  
  if (Array.isArray(almaMater)) {
    // Find the earliest graduation year
    for (const am of almaMater) {
      if (typeof am === 'object' && am.year) {
        const year = parseInt(am.year, 10);
        if (year && (!gradYear || year < gradYear)) {
          gradYear = year;
        }
      }
    }
  } else if (typeof almaMater === 'object' && almaMater.year) {
    gradYear = parseInt(almaMater.year, 10);
  }
  
  if (!gradYear || gradYear < 1950 || gradYear > new Date().getFullYear()) {
    return null;
  }
  
  // Assume graduation at age 22
  const currentYear = new Date().getFullYear();
  return currentYear - gradYear + 22;
};

// Get coach age - uses birthdate if available, otherwise estimates from alma mater
// Returns { age: number, isEstimate: boolean } or null
const getCoachAge = (coach) => {
  if (!coach) return null;
  
  // Try birthdate first (exact)
  if (coach.birthdate) {
    const age = calculateAge(coach.birthdate);
    if (age) return { age, isEstimate: false };
  }
  
  // Fall back to alma mater estimate
  const estimatedAge = estimateAgeFromAlmaMater(coach.alma_mater);
  if (estimatedAge) return { age: estimatedAge, isEstimate: true };
  
  return null;
};

// Format birthdate for display
const formatBirthdate = (birthdate) => {
  if (!birthdate) return null;
  
  // If already in readable format, return as is
  if (/^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(birthdate)) {
    return birthdate;
  }
  
  // Try to parse and format ISO date
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
    const date = new Date(birthdate);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  }
  
  return birthdate;
};

// Get all unique alma maters from coaches
// Helper to extract school name from alma_mater entry (can be string or object)
const getAlmaMaterSchool = (am) => {
  if (!am) return null;
  if (typeof am === 'string') return am;
  if (typeof am === 'object' && am.school) return am.school;
  return null;
};

// Helper to format alma_mater for display
const formatAlmaMater = (almaMater) => {
  if (!almaMater) return null;
  if (typeof almaMater === 'string') return almaMater;
  if (Array.isArray(almaMater)) {
    return almaMater
      .map(am => getAlmaMaterSchool(am))
      .filter(Boolean)
      .join(', ');
  }
  return getAlmaMaterSchool(almaMater);
};

const getAllAlmaMaters = (data) => {
  const almaMaters = new Set();
  data.forEach(coach => {
    if (coach.alma_mater) {
      if (Array.isArray(coach.alma_mater)) {
        coach.alma_mater.forEach(am => {
          const school = getAlmaMaterSchool(am);
          if (school) {
            // Handle comma-separated strings within array items
            if (school.includes(', ')) {
              school.split(', ').forEach(s => {
                const canonical = canonicalizeSchoolName(s.trim());
                if (canonical) almaMaters.add(canonical);
              });
            } else {
              const canonical = canonicalizeSchoolName(school);
              if (canonical) almaMaters.add(canonical);
            }
          }
        });
      } else {
        const school = getAlmaMaterSchool(coach.alma_mater);
        if (school) {
          // Split comma-separated strings into individual schools
          if (school.includes(', ')) {
            school.split(', ').forEach(s => {
              const canonical = canonicalizeSchoolName(s.trim());
              if (canonical) almaMaters.add(canonical);
            });
          } else {
            const canonical = canonicalizeSchoolName(school);
            if (canonical) almaMaters.add(canonical);
          }
        }
      }
    }
  });
  return Array.from(almaMaters).sort();
};

// Find coaches by alma mater
const getCoachesByAlmaMater = (data, almaMater) => {
  return data.filter(coach => {
    if (!coach.alma_mater) return false;
    if (Array.isArray(coach.alma_mater)) {
      return coach.alma_mater.some(am => {
        const school = getAlmaMaterSchool(am);
        if (!school) return false;
        // Handle comma-separated strings within array items
        if (school.includes(', ')) {
          return school.split(', ').some(s => schoolsMatch(s.trim(), almaMater));
        }
        return schoolsMatch(school, almaMater);
      });
    }
    const school = getAlmaMaterSchool(coach.alma_mater);
    if (!school) return false;
    // Handle comma-separated strings
    if (school.includes(', ')) {
      return school.split(', ').some(s => schoolsMatch(s.trim(), almaMater));
    }
    return schoolsMatch(school, almaMater);
  });
};

// Check if two school names refer to the same school
// Schools where "X" and "X State" are DIFFERENT schools - never match these
// Defined outside function for performance
const DISTINCT_STATE_SCHOOLS = new Set([
  'iowa', 'penn', 'michigan', 'ohio', 'washington', 'oregon', 
  'arizona', 'mississippi', 'oklahoma', 'kansas', 'florida',
  'colorado', 'utah', 'georgia', 'louisiana', 'kentucky',
  'tennessee', 'alabama', 'north carolina', 'south carolina',
  'new mexico', 'fresno', 'san diego', 'san jose', 'boise'
]);

// Helper functions defined outside for performance
const normalizeForMatch = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\bst\.\s*/g, 'state ')
    .replace(/\bu\.\s*/g, 'university ')
    .replace(/\buniv\.\s*/g, 'university ')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
};

const stripUniCollege = (name) => {
  return name
    .replace(/\s+state\s+university$/i, ' state')
    .replace(/\s+university$/i, '')
    .replace(/\s+college$/i, '')
    .trim();
};

const schoolsMatch = (school1, school2) => {
  if (!school1 || !school2) return false;
  
  // Check cache first (order-independent key)
  const cacheKey = school1 < school2 ? `${school1}|||${school2}` : `${school2}|||${school1}`;
  if (schoolMatchCache.has(cacheKey)) {
    return schoolMatchCache.get(cacheKey);
  }
  
  // Canonicalize both names first (uses its own cache)
  const c1 = canonicalizeSchoolName(school1);
  const c2 = canonicalizeSchoolName(school2);
  
  // Exact match after canonicalization
  if (c1.toLowerCase() === c2.toLowerCase()) {
    schoolMatchCache.set(cacheKey, true);
    return true;
  }
  
  // Also try direct lookup normalization
  const s1 = normalizeSchool(school1);
  const s2 = normalizeSchool(school2);
  if (s1.toLowerCase() === s2.toLowerCase()) {
    schoolMatchCache.set(cacheKey, true);
    return true;
  }
  
  // Normalize both for comparison
  const n1 = normalizeForMatch(c1);
  const n2 = normalizeForMatch(c2);
  if (n1 === n2) {
    schoolMatchCache.set(cacheKey, true);
    return true;
  }
  
  // Strip university/college suffix and compare (keeps "State")
  const u1 = stripUniCollege(n1);
  const u2 = stripUniCollege(n2);
  if (u1 === u2 && u1.length >= 4) {
    schoolMatchCache.set(cacheKey, true);
    return true;
  }
  
  // Check if one is base + suffix of the other (e.g., "Adrian" vs "Adrian College")
  // BUT NOT for schools where X and X State are different (Iowa vs Iowa State)
  const shorter = n1.length < n2.length ? n1 : n2;
  const longer = n1.length < n2.length ? n2 : n1;
  
  // Must be at least 4 chars to avoid false positives
  if (shorter.length >= 4) {
    // Check if this is a case where X and X State are different schools
    const shorterBase = shorter.replace(/\s+state$/i, '').trim();
    if (DISTINCT_STATE_SCHOOLS.has(shorterBase)) {
      // Only match if both have "state" or neither has "state"
      const shorterHasState = /\s+state$/i.test(shorter);
      const longerHasState = /\s+state/i.test(longer);
      if (shorterHasState !== longerHasState) {
        schoolMatchCache.set(cacheKey, false);
        return false; // "Iowa" should NOT match "Iowa State"
      }
    }
    
    // Check if longer starts with shorter + space + suffix
    // Only allow college/university suffix, NOT "state" for base schools
    const suffixPattern = new RegExp(`^${shorter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(college|university)$`, 'i');
    if (suffixPattern.test(longer)) {
      schoolMatchCache.set(cacheKey, true);
      return true;
    }
  }
  
  schoolMatchCache.set(cacheKey, false);
  return false;
};

// Get all unique schools from currentTeam field (where coaches currently work)
const getAllCurrentTeams = (data) => {
  const teams = new Set();
  data.forEach(coach => {
    if (coach.currentTeam) {
      const canonical = canonicalizeSchoolName(coach.currentTeam);
      teams.add(canonical);
    }
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
            if (staffJob.years?.start != null && staffJob.years?.end != null && 
                otherJob.years?.start != null && otherJob.years?.end != null) {
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
                    rawYears: staffJob.raw_years,
                    school: staffJob.school
                  },
                  otherCoach: {
                    name: otherCoach.name,
                    currentTeam: otherCoach.currentTeam,
                    currentPosition: otherCoach.currentPosition,
                    position: otherJob.position,
                    years: otherJob.years,
                    rawYears: otherJob.raw_years,
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

// Get salary info for a coach - first check coach object, then fall back to statsData
const getSalaryInfo = (coach, statsData) => {
  if (!coach) return null;
  
  // First check if coach has salary in their object
  if (coach.salary && coach.salary.length > 0) {
    const salaryEntry = coach.salary[0];
    const amount = salaryEntry['2024'];
    const salarySchool = salaryEntry.school; // Only present if different from current team
    
    if (amount) {
      return {
        amount,
        formatted: formatSalary(amount),
        school: salarySchool || null,
        sameSchool: !salarySchool // If no school field, they're at the same school
      };
    }
  }
  
  // Fall back to statsData lookup
  if (!statsData?.salaries || !coach.name) return null;
  
  const normalizedName = coach.name.toLowerCase().trim();
  const salaryEntry = statsData.salaries[normalizedName];
  
  if (!salaryEntry) return null;
  
  const formatted = formatSalary(salaryEntry.amount);
  const sameSchool = normalizeSchool(salaryEntry.school) === normalizeSchool(coach.currentTeam);
  
  return {
    amount: salaryEntry.amount,
    formatted,
    school: salaryEntry.school,
    sameSchool
  };
};

// Determine position type: 'hc', 'oc', 'dc', or null
const getPositionType = (position) => {
  if (!position) return null;
  const pos = position.toLowerCase();
  
  // Check for Head Coach first (whitelist approach to avoid false positives like 
  // "assistant to the head coach", "associate head coach", etc.)
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
  
  // Check for OC - full name or abbreviation
  // Match: "offensive coordinator", "OC", "OC/QB", "co-oc", etc.
  if (pos.includes('offensive coordinator') || 
      pos.includes('co-offensive coordinator') ||
      /\boc\b/.test(pos) ||  // standalone "oc"
      /\boc\//.test(pos) ||  // "oc/" like "oc/qb"
      /\/oc\b/.test(pos)) {  // "/oc" like "ahc/oc"
    return 'oc';
  }
  
  // Check for DC - full name or abbreviation
  // Match: "defensive coordinator", "DC", "AHC/DC", "co-dc", etc.
  if (pos.includes('defensive coordinator') || 
      pos.includes('co-defensive coordinator') ||
      /\bdc\b/.test(pos) ||  // standalone "dc"
      /\bdc\//.test(pos) ||  // "dc/" 
      /\/dc\b/.test(pos)) {  // "/dc" like "ahc/dc"
    return 'dc';
  }
  
  return null;
};

// Normalize team name for stats lookup
const normalizeTeamForStats = (team) => {
  if (!team) return '';
  
  // Map from coaches_data team names to stats team names
  const teamMappings = {
    'appalachian state': 'App State',
    'appalachian state mountaineers': 'App State',
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
    'missouri state': 'Missouri St',
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
    'usf': 'S Florida',
    'san diego state': 'San Diego St',
    'san jose state': 'San Jose St',
    'southern california': 'USC',
    'southern methodist': 'SMU',
    'southern mississippi': 'Southern Miss',
    'southern miss': 'Southern Miss',
    'texas christian': 'TCU',
    'texas state': 'Texas St',
    'louisiana-monroe': 'UL Monroe',
    'ul monroe': 'UL Monroe',
    'utah state': 'Utah St',
    'washington state': 'Washington St',
    'western michigan': 'W Michigan',
    'western kentucky': 'W Kentucky',
    'central florida': 'UCF',
    'ucf': 'UCF',
    'massachusetts': 'UMass',
    'umass': 'UMass',
    'connecticut': 'UConn',
    'uconn': 'UConn',
    'unlv': 'UNLV',
    'utep': 'UTEP',
    'utsa': 'UTSA',
    'uab': 'UAB',
    'miami (fl)': 'Miami',
    'miami (oh)': 'Miami OH',
    'ole miss': 'Mississippi',
    'mississippi': 'Mississippi',
  };
  
  const normalized = team.toLowerCase().trim();
  return teamMappings[normalized] || team;
};

// Check if coach has any HC/OC/DC experience
const hasCoordinatorExperience = (coach) => {
  if (!coach?.coaching_career) return false;
  return coach.coaching_career.some(job => getPositionType(job.position) !== null);
};

// Get stats years for a coach based on their roles
const getCoachStatsYears = (coach, statsData) => {
  if (!coach?.coaching_career || !statsData) {
    return [];
  }
  
  const statsYears = [];
  
  // Helper to find team in basic stats (stat -> team -> year -> {value, rank})
  const findBasicStat = (statCategory, statKey, team, yearStr) => {
    const normalizedTeam = normalizeTeamForStats(team);
    let val = statCategory?.[statKey]?.[normalizedTeam]?.[yearStr];
    if (val === undefined) {
      val = statCategory?.[statKey]?.[team]?.[yearStr];
    }
    return val; // Returns {value, rank} or undefined
  };
  
  // Helper to find team in advanced stats (year -> team -> stats)
  const findAdvancedStats = (advancedCategory, team, yearStr) => {
    const normalizedTeam = normalizeTeamForStats(team);
    let val = advancedCategory?.[yearStr]?.[normalizedTeam];
    if (val === undefined) {
      val = advancedCategory?.[yearStr]?.[team];
    }
    return val; // Returns object with all advanced stats or undefined
  };
  
  coach.coaching_career.forEach(job => {
    const posType = getPositionType(job.position);
    if (!posType) return;
    
    const team = job.school;
    const startYear = job.years?.start;
    const endYear = job.years?.end || new Date().getFullYear();
    
    if (!startYear) return;
    
    for (let year = startYear; year <= endYear; year++) {
      const yearStr = String(year);
      
      // Get ALL basic offensive stats
      const offenseStats = {
        ppg: findBasicStat(statsData.offense, 'PointsPerGame', team, yearStr),
        ypg: findBasicStat(statsData.offense, 'YardsPerGame', team, yearStr),
        rushYpg: findBasicStat(statsData.offense, 'RushYardsPerGame', team, yearStr),
        passYpg: findBasicStat(statsData.offense, 'PassYardsPerGame', team, yearStr),
        sacked: findBasicStat(statsData.offense, 'QBSackedPerGame', team, yearStr),
        ypa: findBasicStat(statsData.offense, 'YardsPerPassAtt', team, yearStr),
      };
      
      // Get ALL basic defensive stats
      const defenseStats = {
        ppg: findBasicStat(statsData.defense, 'OppPointsPerGame', team, yearStr),
        ypg: findBasicStat(statsData.defense, 'OppYardsPerGame', team, yearStr),
        rushYpg: findBasicStat(statsData.defense, 'OppRushYPG', team, yearStr),
        passYpg: findBasicStat(statsData.defense, 'OppPassYPG', team, yearStr),
        sacks: findBasicStat(statsData.defense, 'SacksPerGame', team, yearStr),
        takeaways: findBasicStat(statsData.defense, 'TakeawaysPerGame', team, yearStr),
      };
      
      // Get advanced stats (2014+)
      const advOff = findAdvancedStats(statsData.advancedOffense, team, yearStr);
      const advDef = findAdvancedStats(statsData.advancedDefense, team, yearStr);
      
      // Only include if we have relevant stats
      let stats = null;
      const hasOffense = offenseStats.ppg !== undefined;
      const hasDefense = defenseStats.ppg !== undefined;
      
      if (posType === 'hc') {
        if (hasOffense || hasDefense) {
          stats = { 
            offense: hasOffense ? offenseStats : null,
            defense: hasDefense ? defenseStats : null,
            advancedOffense: advOff,
            advancedDefense: advDef
          };
        }
      } else if (posType === 'oc') {
        if (hasOffense) {
          stats = { 
            offense: offenseStats,
            advancedOffense: advOff
          };
        }
      } else if (posType === 'dc') {
        if (hasDefense) {
          stats = { 
            defense: defenseStats,
            advancedDefense: advDef
          };
        }
      }
      
      if (stats) {
        statsYears.push({
          year,
          team,
          position: job.position,
          positionType: posType,
          ...stats
        });
      }
    }
  });
  
  // Sort by year descending
  return statsYears.sort((a, b) => b.year - a.year);
};

export default function CoachingHotboard() {
  const [coachesData, setCoachesData] = useState([]);
  const [statsData, setStatsData] = useState(null); // Salaries and team stats
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [secondarySchool, setSecondarySchool] = useState('');
  const [secondarySearchTerm, setSecondarySearchTerm] = useState('');
  const [selectedStaffMember, setSelectedStaffMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('overlaps');
  const [currentStaff, setCurrentStaff] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [coachingTree, setCoachingTree] = useState(null);
  const [searchMode, setSearchMode] = useState('school'); // 'school', 'almaMater', or 'coach'
  const [selectedAlmaMater, setSelectedAlmaMater] = useState('');
  const [almaMaterCoaches, setAlmaMaterCoaches] = useState([]);
  const [searchedCoach, setSearchedCoach] = useState(null); // Coach selected from search
  const [modalTab, setModalTab] = useState('career'); // 'career', 'tree', or 'stats'
  const [advancedStatsView, setAdvancedStatsView] = useState('offense'); // 'offense' or 'defense' for HC stats
  
  // Build coaching tree for a selected coach
  const buildCoachingTree = (coach, allCoachesData) => {
    if (!coach || !allCoachesData.length) return null;
    
    const tree = {
      coach: coach,
      workedUnder: [], // Head coaches they worked under
      mentored: [] // Coaches they mentored who became HCs
    };
    
    // Find the full coach data if we only have partial
    const fullCoachData = allCoachesData.find(c => c.name === coach.name) || coach;
    
    // For each job in their career, find the head coach at that school/team
    fullCoachData.coaching_career?.forEach(job => {
      const wasHeadCoach = job.position?.toLowerCase().startsWith('head coach');
      
      if (!wasHeadCoach) {
        // Find head coaches at this school during this time
        allCoachesData.forEach(otherCoach => {
          if (otherCoach.name === fullCoachData.name) return;
          
          otherCoach.coaching_career?.forEach(otherJob => {
            const isHeadCoach = otherJob.position?.toLowerCase().startsWith('head coach');
            if (!isHeadCoach) return;
            
            // Check if same school
            if (!schoolsMatch(job.school, otherJob.school)) return;
            
            // Check year overlap
            if (job.years?.start != null && job.years?.end != null && 
                otherJob.years?.start != null && otherJob.years?.end != null) {
              const overlapStart = Math.max(job.years.start, otherJob.years.start);
              const overlapEnd = Math.min(job.years.end, otherJob.years.end);
              
              if (overlapStart <= overlapEnd) {
                // Check if already added this coach
                const existing = tree.workedUnder.find(
                  w => w.coach.name === otherCoach.name
                );
                if (existing) {
                  // Add another stint under this coach
                  existing.stints.push({
                    school: job.school,
                    years: { start: overlapStart, end: overlapEnd },
                    myPosition: job.position,
                    rawYears: otherJob.raw_years
                  });
                } else {
                  tree.workedUnder.push({
                    coach: otherCoach,
                    stints: [{
                      school: job.school,
                      years: { start: overlapStart, end: overlapEnd },
                      myPosition: job.position,
                      rawYears: otherJob.raw_years
                    }]
                  });
                }
              }
            }
          });
        });
      } else {
        // They were a head coach - find assistants who later became head coaches
        allCoachesData.forEach(otherCoach => {
          if (otherCoach.name === fullCoachData.name) return;
          
          let workedTogetherStints = [];
          let becameHeadCoach = null;
          
          otherCoach.coaching_career?.forEach(otherJob => {
            // Check if they worked at the same school while selected coach was HC
            if (schoolsMatch(job.school, otherJob.school)) {
              if (job.years?.start != null && job.years?.end != null && 
                  otherJob.years?.start != null && otherJob.years?.end != null) {
                const overlapStart = Math.max(job.years.start, otherJob.years.start);
                const overlapEnd = Math.min(job.years.end, otherJob.years.end);
                
                if (overlapStart <= overlapEnd) {
                  // They worked together, and the other coach wasn't also HC
                  const otherWasHC = otherJob.position?.toLowerCase().startsWith('head coach');
                  if (!otherWasHC) {
                    workedTogetherStints.push({
                      school: job.school,
                      position: otherJob.position,
                      years: { start: overlapStart, end: overlapEnd }
                    });
                  }
                }
              }
            }
            
            // Check if they later became a head coach
            const isHC = otherJob.position?.toLowerCase().startsWith('head coach');
            if (isHC && otherJob.years) {
              if (!becameHeadCoach || otherJob.years.start < becameHeadCoach.years.start) {
                becameHeadCoach = {
                  school: otherJob.school,
                  years: otherJob.years,
                  rawYears: otherJob.raw_years
                };
              }
            }
          });
          
          // If they worked together and later became HC
          if (workedTogetherStints.length > 0 && becameHeadCoach) {
            // Make sure they became HC AFTER working together (use earliest stint)
            const earliestStint = workedTogetherStints.reduce((earliest, s) => 
              s.years.start < earliest.years.start ? s : earliest
            );
            if (becameHeadCoach.years.start >= earliestStint.years.start) {
              const existing = tree.mentored.find(m => m.coach.name === otherCoach.name);
              if (existing) {
                // Add stints to existing entry
                workedTogetherStints.forEach(stint => {
                  const alreadyHas = existing.stints.find(s => 
                    s.school === stint.school && s.years.start === stint.years.start
                  );
                  if (!alreadyHas) {
                    existing.stints.push(stint);
                  }
                });
              } else {
                tree.mentored.push({
                  coach: otherCoach,
                  stints: workedTogetherStints,
                  becameHC: becameHeadCoach
                });
              }
            }
          }
        });
      }
    });
    
    // Sort workedUnder by earliest stint year
    tree.workedUnder.sort((a, b) => {
      const aEarliest = Math.min(...a.stints.map(s => s.years.start));
      const bEarliest = Math.min(...b.stints.map(s => s.years.start));
      return aEarliest - bEarliest;
    });
    
    // Sort stints within each workedUnder entry
    tree.workedUnder.forEach(w => {
      w.stints.sort((a, b) => a.years.start - b.years.start);
    });
    
    // Sort mentored by when they became HC
    tree.mentored.sort((a, b) => a.becameHC.years.start - b.becameHC.years.start);
    
    // Sort stints within each mentored entry
    tree.mentored.forEach(m => {
      m.stints.sort((a, b) => a.years.start - b.years.start);
    });
    
    return tree;
  };
  
  // Handle coach click
  const handleCoachClick = (coach) => {
    const fullCoach = coachesData.find(c => c.name === coach.name) || coach;
    setSelectedCoach(fullCoach);
    setCoachingTree(buildCoachingTree(fullCoach, coachesData));
    setModalTab('career'); // Reset to career tab
  };
  
  // Close modal
  const closeModal = () => {
    setSelectedCoach(null);
    setCoachingTree(null);
    setModalTab('career'); // Reset tab
    setAdvancedStatsView('offense'); // Reset advanced stats view
  };
  
  // Load data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        // Helper function to fetch all rows with pagination (Supabase default limit is 1000)
        async function fetchAllRows(table, selectQuery = '*', filters = {}) {
          const allRows = [];
          const pageSize = 1000;
          let offset = 0;
          let hasMore = true;

          while (hasMore) {
            let query = supabase
              .from(table)
              .select(selectQuery)
              .range(offset, offset + pageSize - 1);

            // Apply filters
            if (filters.eq) {
              for (const [col, val] of Object.entries(filters.eq)) {
                query = query.eq(col, val);
              }
            }
            if (filters.order) {
              query = query.order(filters.order.column, { ascending: filters.order.ascending });
            }

            const { data, error } = await query;
            if (error) throw error;

            allRows.push(...data);
            hasMore = data.length === pageSize;
            offset += pageSize;
          }

          return allRows;
        }

        console.log('Loading data from Supabase...');

        // Fetch all data (with pagination for large tables)
        const [coaches, schools, stints, almaMaters] = await Promise.all([
          fetchAllRows('coaches', '*', { eq: { is_primary: true } }),
          fetchAllRows('schools', 'id, canonical_name'),
          fetchAllRows('coaching_stints', '*', { order: { column: 'start_year', ascending: false } }),
          fetchAllRows('coach_alma_maters', '*')
        ]);

        console.log(`Loaded: ${coaches.length} coaches, ${schools.length} schools, ${stints.length} stints, ${almaMaters.length} alma maters`);

        // Create school lookup map
        const schoolMap = {};
        schools.forEach(s => {
          schoolMap[s.id] = s.canonical_name;
        });

        // Group stints by coach
        const stintsByCoach = {};
        stints.forEach(stint => {
          if (!stintsByCoach[stint.coach_id]) {
            stintsByCoach[stint.coach_id] = [];
          }
          stintsByCoach[stint.coach_id].push({
            school: schoolMap[stint.school_id] || 'Unknown',
            position: stint.position,
            years: {
              start: stint.start_year,
              end: stint.end_year
            },
            raw_years: stint.raw_years
          });
        });

        // Group alma maters by coach
        const almaByCoach = {};
        almaMaters.forEach(am => {
          if (!almaByCoach[am.coach_id]) {
            almaByCoach[am.coach_id] = [];
          }
          almaByCoach[am.coach_id].push({
            school: schoolMap[am.school_id] || 'Unknown',
            year: am.graduation_year,
            degree: am.degree
          });
        });

        // Transform to expected format
        const transformedCoaches = coaches.map(coach => ({
          id: coach.id,
          name: coach.name,
          currentTeam: schoolMap[coach.current_team_id] || null,
          currentPosition: coach.current_position,
          birthdate: coach.birthdate,
          birthplace: coach.birthplace,
          hometown: coach.hometown,
          wikipedia_url: coach.wikipedia_url,
          source: coach.source,
          alma_mater: almaByCoach[coach.id] || [],
          coaching_career: stintsByCoach[coach.id] || []
        }));

        setCoachesData(transformedCoaches);

        // Load stats data (still from JSON for now)
        try {
          const statsRes = await fetch(import.meta.env.BASE_URL + 'coaching_stats_data.json');
          if (statsRes.ok) {
            const statsDataResult = await statsRes.json();
            setStatsData(statsDataResult);
          }
        } catch (statsErr) {
          console.warn('Stats data not available:', statsErr);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    loadData();
  }, []);
  
  const allSchools = useMemo(() => getAllCurrentTeams(coachesData), [coachesData]);
  
  const allAlmaMaters = useMemo(() => getAllAlmaMaters(coachesData), [coachesData]);
  
  const filteredSchools = useMemo(() => {
    if (!searchTerm) return allSchools;
    const term = searchTerm.toLowerCase();
    return allSchools.filter(s => s.toLowerCase().includes(term));
  }, [allSchools, searchTerm]);
  
  const filteredAlmaMaters = useMemo(() => {
    if (!searchTerm) return allAlmaMaters;
    const term = searchTerm.toLowerCase();
    return allAlmaMaters.filter(s => s.toLowerCase().includes(term));
  }, [allAlmaMaters, searchTerm]);
  
  // Get all coaches sorted by name
  const allCoachesSorted = useMemo(() => {
    return [...coachesData].sort((a, b) => a.name.localeCompare(b.name));
  }, [coachesData]);
  
  const filteredCoaches = useMemo(() => {
    if (!searchTerm) return allCoachesSorted.slice(0, 50); // Show first 50 by default
    const term = searchTerm.toLowerCase();
    return allCoachesSorted.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.currentTeam?.toLowerCase().includes(term) ||
      c.currentPosition?.toLowerCase().includes(term)
    );
  }, [allCoachesSorted, searchTerm]);
  
  // Calculate connections when school is selected - use useEffect to show loading state
  useEffect(() => {
    if (!selectedSchool) {
      setCurrentStaff([]);
      setConnections([]);
      setSecondarySchool('');
      setSecondarySearchTerm('');
      setSelectedStaffMember(null);
      return;
    }
    
    // Clear secondary filter and staff filter when primary school changes
    setSecondarySchool('');
    setSecondarySearchTerm('');
    setSelectedStaffMember(null);
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
  
  // Calculate coaches when alma mater is selected
  useEffect(() => {
    if (!selectedAlmaMater) {
      setAlmaMaterCoaches([]);
      return;
    }
    
    setCalculating(true);
    
    const timer = setTimeout(() => {
      const coaches = getCoachesByAlmaMater(coachesData, selectedAlmaMater);
      setAlmaMaterCoaches(coaches);
      setCalculating(false);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [selectedAlmaMater, coachesData]);
  
  // Clear selections when switching search modes
  const handleSearchModeChange = (mode) => {
    setSearchMode(mode);
    setSearchTerm('');
    
    // Clear school-related state
    if (mode !== 'school') {
      setSelectedSchool('');
      setCurrentStaff([]);
      setConnections([]);
      setSecondarySchool('');
      setSecondarySearchTerm('');
      setSelectedStaffMember(null);
    }
    
    // Clear alma mater-related state
    if (mode !== 'almaMater') {
      setSelectedAlmaMater('');
      setAlmaMaterCoaches([]);
    }
    
    // Clear coach search state
    if (mode !== 'coach') {
      setSearchedCoach(null);
    }
  };
  
  // Filter connections by secondary school and/or staff member
  const filteredConnections = useMemo(() => {
    let result = connections;
    
    // Filter by staff member if selected
    if (selectedStaffMember) {
      result = result.filter(conn => conn.currentCoach.name === selectedStaffMember.name);
    }
    
    // Filter by secondary school if selected
    if (secondarySchool) {
      result = result.filter(conn => 
        schoolsMatch(conn.otherCoach.currentTeam, secondarySchool)
      );
    }
    
    return result;
  }, [connections, secondarySchool, selectedStaffMember]);

  // Group connections by coach pair (for All Connections view)
  const groupedConnections = useMemo(() => {
    const grouped = {};
    filteredConnections.forEach(conn => {
      const key = `${conn.currentCoach.name}|${conn.otherCoach.name}`;
      if (!grouped[key]) {
        grouped[key] = {
          currentCoach: conn.currentCoach,
          otherCoach: conn.otherCoach,
          overlaps: []
        };
      }
      grouped[key].overlaps.push({
        connectionSchool: conn.connectionSchool,
        overlapStart: conn.overlapStart,
        overlapEnd: conn.overlapEnd,
        overlapYears: conn.overlapYears,
        currentPosition: conn.currentCoach.position,
        currentYears: conn.currentCoach.years,
        currentRawYears: conn.currentCoach.rawYears,
        otherPosition: conn.otherCoach.position,
        otherYears: conn.otherCoach.years,
        otherRawYears: conn.otherCoach.rawYears
      });
    });
    
    // Convert to array and calculate total years, sort by total years
    return Object.values(grouped).map(group => ({
      ...group,
      // Sort overlaps chronologically (earliest first)
      overlaps: group.overlaps.sort((a, b) => a.overlapStart - b.overlapStart),
      totalYears: group.overlaps.reduce((sum, o) => sum + o.overlapYears, 0)
    })).sort((a, b) => b.totalYears - a.totalYears);
  }, [filteredConnections]);

  // Group connections by current staff member, then by other coach
  const connectionsByCoach = useMemo(() => {
    const connectionsToUse = (secondarySchool || selectedStaffMember) ? filteredConnections : connections;
    const grouped = {};
    connectionsToUse.forEach(conn => {
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
        staffRawYears: conn.currentCoach.rawYears,
        otherPosition: conn.otherCoach.position,
        otherYears: conn.otherCoach.years,
        otherRawYears: conn.otherCoach.rawYears
      });
    });
    
    // Convert to array and sort
    return Object.values(grouped).map(group => ({
      coach: group.coach,
      otherCoaches: Object.values(group.connectionsByOtherCoach).map(oc => ({
        ...oc,
        // Sort overlaps chronologically (earliest first)
        overlaps: oc.overlaps.sort((a, b) => a.overlapStart - b.overlapStart)
      })).sort((a, b) => {
        // Sort by total overlap years descending
        const aTotal = a.overlaps.reduce((sum, o) => sum + o.overlapYears, 0);
        const bTotal = b.overlaps.reduce((sum, o) => sum + o.overlapYears, 0);
        return bTotal - aTotal;
      })
    })).sort((a, b) => b.otherCoaches.length - a.otherCoaches.length);
  }, [connections, filteredConnections, secondarySchool, selectedStaffMember]);
  
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

  // Get sorted list of connected teams for secondary filter dropdown
  const connectedTeamsList = useMemo(() => {
    return Array.from(connectedTeams).sort();
  }, [connectedTeams]);

  // Filter secondary school search
  const filteredSecondarySchools = useMemo(() => {
    if (!secondarySearchTerm) return connectedTeamsList;
    const term = secondarySearchTerm.toLowerCase();
    return connectedTeamsList.filter(s => s.toLowerCase().includes(term));
  }, [connectedTeamsList, secondarySearchTerm]);

  // Filtered stats
  const filteredUniqueOtherCoaches = useMemo(() => {
    const coaches = new Set();
    filteredConnections.forEach(conn => {
      coaches.add(conn.otherCoach.name);
    });
    return coaches;
  }, [filteredConnections]);

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
            Check your Supabase connection settings in <code>.env</code> file.
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
      padding: '1rem'
    }}>
      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 640px) {
          .ch-root { padding: 2rem !important; }
          .ch-header-title { font-size: 2.8rem !important; }
          .ch-header-subtitle { font-size: 1rem !important; }
          .ch-mode-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 900px) {
          .ch-mode-grid { grid-template-columns: repeat(6, 1fr) !important; }
        }
      `}</style>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #ff6b35, #f7c59f, #ff6b35, transparent)',
          borderRadius: '2px'
        }} />
        <h1 className="ch-header-title" style={{
          fontSize: '1.6rem',
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
        <p className="ch-header-subtitle" style={{
          color: '#8892b0',
          fontSize: '0.7rem',
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
        padding: '0 1rem'
      }}>
        {/* Search Mode Toggle */}
        <div className="ch-mode-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.4rem',
          marginBottom: '0.75rem'
        }}>
          {[
            { id: 'school', label: 'By School', emoji: '🏈', color: '255,107,53', tooltip: 'Select a school to see coaching connections — find which coaches on the current staff have worked together before and where their careers have overlapped.' },
            { id: 'almaMater', label: 'By Alma Mater', emoji: '🎓', color: '96,165,250', tooltip: 'Search by alma mater to find all current coaches in the database who played at a specific school as student-athletes.' },
            { id: 'coach', label: 'By Coach', emoji: '👤', color: '74,222,128', tooltip: 'Look up any coach directly to view their full career history, current position, bio details, and stats at each stop.' },
            { id: 'stats', label: 'By Stats', emoji: '📊', color: '167,139,250', tooltip: 'Browse team offensive and defensive stats with sortable rankings, and see which coordinators are responsible for each unit.' },
            { id: 'staffHistory', label: 'Staff History', emoji: '📋', color: '251,191,36', tooltip: 'View the full year-by-year coaching staff breakdown for any school — see who was on staff each season and how the staff evolved.' },
            { id: 'schoolHistory', label: 'School History', emoji: '🏫', color: '232,121,249', tooltip: 'Search for a school to see every coach in the database who has ever coached there, sorted by current staff first then most recent.' },
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => handleSearchModeChange(mode.id)}
              title={mode.tooltip}
              style={{
                padding: '0.55rem 0.5rem',
                background: searchMode === mode.id ? `rgba(${mode.color},0.3)` : 'rgba(255,255,255,0.05)',
                border: searchMode === mode.id ? `1px solid rgba(${mode.color},0.5)` : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: searchMode === mode.id ? `rgb(${mode.color})` : '#8892b0',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                textAlign: 'center'
              }}
            >
              {mode.emoji} {mode.label}
            </button>
          ))}
        </div>

        {/* Section Description */}
        <p style={{
          color: '#8892b0',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          margin: '0 0 1rem 0',
          padding: '0.6rem 0.8rem',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '6px',
          borderLeft: (() => {
            const colors = { school: '255,107,53', almaMater: '96,165,250', coach: '74,222,128', stats: '167,139,250', staffHistory: '251,191,36', schoolHistory: '232,121,249' };
            return `3px solid rgba(${colors[searchMode] || '255,255,255'},0.4)`;
          })()
        }}>
          {searchMode === 'school' && 'Select a school to discover coaching connections. See which coaches on the current staff have overlapping career histories — where they worked together, for how long, and what positions they held.'}
          {searchMode === 'almaMater' && 'Find all current coaches in the database who played at a specific school as student-athletes. See where former players have gone on to coach and what positions they hold.'}
          {searchMode === 'coach' && 'Look up any coach directly by name. View their full career history, current position, bio details, salary information, and statistical performance at each stop along the way.'}
          {searchMode === 'stats' && 'Browse team offensive and defensive stats with sortable rankings. Click into any school to see which coordinators are responsible for each unit and how the numbers have trended over time.'}
          {searchMode === 'staffHistory' && 'View the full year-by-year coaching staff breakdown for any school. See who was on staff each season, track arrivals and departures, and watch how the coaching staff evolved over time.'}
          {searchMode === 'schoolHistory' && 'Search for any school to see every coach in the database who has ever coached there. Current staff appear first sorted by position hierarchy, followed by former coaches sorted by most recent tenure.'}
        </p>

        {/* View Toggle - only show for school search */}
        {searchMode === 'school' && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.03)',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(255,107,53,0.2)',
            marginBottom: '0.75rem'
          }}>
            {[{id: 'overlaps', label: 'All Connections'}, {id: 'timeline', label: 'By Coach'}].map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                style={{
                  padding: '0.6rem 1rem',
                  background: viewMode === mode.id ? 'rgba(255,107,53,0.3)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: viewMode === mode.id ? '#ff6b35' : '#8892b0',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        )}
        
        <div>
          {searchMode !== 'stats' && searchMode !== 'staffHistory' && searchMode !== 'schoolHistory' && (
            <>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#8892b0',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}>
                {searchMode === 'school' ? 'Select a School' : searchMode === 'almaMater' ? 'Select an Alma Mater' : 'Search for a Coach'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchMode === 'school' ? "Type to search schools..." : searchMode === 'almaMater' ? "Type to search alma maters..." : "Type coach name, team, or position..."}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${searchMode === 'school' ? 'rgba(255,107,53,0.2)' : searchMode === 'almaMater' ? 'rgba(96,165,250,0.2)' : 'rgba(74,222,128,0.2)'}`,
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = searchMode === 'school' ? 'rgba(255,107,53,0.6)' : searchMode === 'almaMater' ? 'rgba(96,165,250,0.6)' : 'rgba(74,222,128,0.6)'}
              onBlur={(e) => e.target.style.borderColor = searchMode === 'school' ? 'rgba(255,107,53,0.2)' : searchMode === 'almaMater' ? 'rgba(96,165,250,0.2)' : 'rgba(74,222,128,0.2)'}
            />
            {searchMode === 'school' && searchTerm && filteredSchools.length > 0 && (
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
                {filteredSchools.slice(0, 500).map(school => (
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
                    <TeamWithLogo team={school} size={20} />
                  </div>
                ))}
              </div>
            )}
            {searchMode === 'almaMater' && searchTerm && filteredAlmaMaters.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#1a1a2e',
                border: '1px solid rgba(96,165,250,0.3)',
                borderRadius: '8px',
                marginTop: '4px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 100
              }}>
                {filteredAlmaMaters.slice(0, 500).map(almaMater => (
                  <div
                    key={almaMater}
                    onClick={() => {
                      setSelectedAlmaMater(almaMater);
                      setSearchTerm('');
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(96,165,250,0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <TeamWithLogo team={almaMater} size={20} />
                  </div>
                ))}
              </div>
            )}
            {searchMode === 'coach' && searchTerm && filteredCoaches.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#1a1a2e',
                border: '1px solid rgba(74,222,128,0.3)',
                borderRadius: '8px',
                marginTop: '4px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 100
              }}>
                {filteredCoaches.slice(0, 50).map((coach, idx) => (
                  <div
                    key={coach.url || idx}
                    onClick={() => {
                      setSearchedCoach(coach);
                      setSearchTerm('');
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(74,222,128,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontWeight: 600, color: '#fff' }}>{coach.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#8892b0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      {coach.currentPosition} @ <TeamWithLogo team={coach.currentTeam} size={16} nameStyle={{ color: '#8892b0' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
            </>
          )}
        </div>
      </div>

      {/* Selected Alma Mater Badge & Results */}
      {selectedAlmaMater && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 2rem'
        }}>
          {/* Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(147,197,253,0.1))',
              padding: '0.75rem 1.25rem',
              borderRadius: '100px',
              border: '1px solid rgba(96,165,250,0.4)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🎓</span>
              <span style={{ fontWeight: 700, color: '#93c5fd' }}>{selectedAlmaMater}</span>
              <button
                onClick={() => setSelectedAlmaMater('')}
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
                <span style={{ color: '#60a5fa', fontWeight: 700 }}>{almaMaterCoaches.length}</span> current coaches
              </div>
            )}
          </div>
          
          {/* Coaches Grid */}
          {!calculating && almaMaterCoaches.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {almaMaterCoaches.map((coach, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCoachClick(coach)}
                  style={{
                    background: 'rgba(96,165,250,0.05)',
                    border: '1px solid rgba(96,165,250,0.2)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    {coach.name}
                  </div>
                  <div style={{ color: '#60a5fa', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {coach.currentPosition} @ <TeamWithLogo team={coach.currentTeam} size={18} nameStyle={{ color: '#60a5fa' }} />
                  </div>
                  {(() => {
                    const ageInfo = getCoachAge(coach);
                    return ageInfo && (
                      <div style={{ color: '#8892b0', fontSize: '0.8rem' }}>
                        Age: {ageInfo.age}{ageInfo.isEstimate ? ' (est.)' : ''}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          )}
          
          {!calculating && almaMaterCoaches.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#8892b0'
            }}>
              No coaches found with this alma mater.
            </div>
          )}
        </div>
      )}

      {/* Searched Coach Display */}
      {searchedCoach && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 2rem'
        }}>
          {/* Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(134,239,172,0.1))',
              padding: '0.75rem 1.25rem',
              borderRadius: '100px',
              border: '1px solid rgba(74,222,128,0.4)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>👤</span>
              <span style={{ fontWeight: 700, color: '#86efac' }}>{searchedCoach.name}</span>
              <button
                onClick={() => setSearchedCoach(null)}
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
          </div>
          
          {/* Coach Card */}
          <div style={{
            background: 'rgba(74,222,128,0.05)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 700, 
                  color: '#fff',
                  marginBottom: '0.25rem'
                }}>
                  {searchedCoach.name}
                  {(() => {
                    const ageInfo = getCoachAge(searchedCoach);
                    return ageInfo && (
                      <span style={{ 
                        fontSize: '1rem', 
                        fontWeight: 400, 
                        color: '#8892b0',
                        marginLeft: '0.75rem'
                      }}>
                        (Age {ageInfo.age}{ageInfo.isEstimate ? ', est.' : ''})
                      </span>
                    );
                  })()}
                </h2>
                <div style={{ color: '#4ade80', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {searchedCoach.currentPosition} @ <TeamWithLogo team={searchedCoach.currentTeam} size={22} nameStyle={{ color: '#4ade80' }} />
                </div>
              </div>
              <button
                onClick={() => handleCoachClick(searchedCoach)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(74,222,128,0.2)',
                  border: '1px solid rgba(74,222,128,0.4)',
                  borderRadius: '8px',
                  color: '#4ade80',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(74,222,128,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(74,222,128,0.2)';
                }}
              >
                View Full Profile →
              </button>
            </div>
            
            {/* Bio Details */}
            {(() => {
              const salaryInfo = getSalaryInfo(searchedCoach, statsData);
              const ageInfo = getCoachAge(searchedCoach);
              const hasBioDetails = ageInfo || searchedCoach.birthplace || searchedCoach.alma_mater || salaryInfo;
              
              return hasBioDetails ? (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  marginBottom: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {searchedCoach.birthdate ? (
                    <div style={{ fontSize: '0.9rem' }}>
                      <span style={{ color: '#8892b0' }}>🎂 Born: </span>
                      <span style={{ color: '#ccd6f6' }}>{formatBirthdate(searchedCoach.birthdate)} (Age {calculateAge(searchedCoach.birthdate)})</span>
                    </div>
                  ) : (() => {
                    const ageInfo = getCoachAge(searchedCoach);
                    return ageInfo?.isEstimate && (
                      <div style={{ fontSize: '0.9rem' }}>
                        <span style={{ color: '#8892b0' }}>🎂 Age: </span>
                        <span style={{ color: '#ccd6f6' }}>~{ageInfo.age} (estimated)</span>
                      </div>
                    );
                  })()}
                  {searchedCoach.birthplace && (
                    <div style={{ fontSize: '0.9rem' }}>
                      <span style={{ color: '#8892b0' }}>📍 From: </span>
                      <span style={{ color: '#ccd6f6' }}>{searchedCoach.birthplace}</span>
                    </div>
                  )}
                  {searchedCoach.alma_mater && (
                    <div style={{ fontSize: '0.9rem' }}>
                      <span style={{ color: '#8892b0' }}>🎓 Played at: </span>
                      <span style={{ color: '#ccd6f6' }}>
                        {formatAlmaMater(searchedCoach.alma_mater)}
                      </span>
                    </div>
                  )}
                  {salaryInfo && (
                    <div style={{ fontSize: '0.9rem' }}>
                      <span style={{ color: '#8892b0' }}>💰 2024: </span>
                      <span style={{ color: '#4ade80' }}>
                        {salaryInfo.formatted}
                        {!salaryInfo.sameSchool && (
                          <span style={{ color: '#8892b0', marginLeft: '0.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            (<TeamLogo team={salaryInfo.school} size={14} />{salaryInfo.school})
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ) : null;
            })()}
            
            {/* Recent Career */}
            <div>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#8892b0',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Recent Career
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {searchedCoach.coaching_career?.slice(-5).reverse().map((job, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr',
                      gap: '1rem',
                      padding: '0.5rem 0.75rem',
                      background: job.position?.toLowerCase().startsWith('head coach') 
                        ? 'rgba(74,222,128,0.1)' 
                        : 'rgba(255,255,255,0.03)',
                      borderRadius: '6px',
                      borderLeft: job.position?.toLowerCase().startsWith('head coach')
                        ? '3px solid #4ade80'
                        : '3px solid transparent'
                    }}
                  >
                    <div style={{ 
                      color: '#8892b0', 
                      fontSize: '0.8rem',
                      fontFamily: 'monospace'
                    }}>
                      {formatYearRange(job.years?.start, job.years?.end, job.raw_years) || '—'}
                    </div>
                    <div>
                      <span style={{ color: '#f7c59f', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><TeamLogo team={job.school} size={16} />{job.school}</span>
                      <span style={{ color: '#8892b0' }}> — {job.position}</span>
                    </div>
                  </div>
                ))}
              </div>
              {searchedCoach.coaching_career?.length > 5 && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  fontSize: '0.8rem', 
                  color: '#8892b0',
                  textAlign: 'center'
                }}>
                  + {searchedCoach.coaching_career.length - 5} more positions
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* By Stats View */}
      {searchMode === 'stats' && (
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto 2rem'
        }}>
          <ByStatsTable 
            coachesData={coachesData}
            statsData={statsData}
            onCoachClick={handleCoachClick}
          />
        </div>
      )}

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
            <span style={{ fontSize: '1.5rem' }}>{getTeamLogoUrl(selectedSchool) ? <TeamLogo team={selectedSchool} size={28} /> : '🏈'}</span>
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
          
          {/* Secondary School Filter - only show in All Connections view */}
          {!calculating && viewMode === 'overlaps' && connectedTeamsList.length > 0 && (
            <>
              <span style={{ color: '#8892b0', fontSize: '1.25rem' }}>→</span>
              {secondarySchool ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.1))',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '100px',
                  border: '1px solid rgba(96,165,250,0.4)'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{getTeamLogoUrl(secondarySchool) ? <TeamLogo team={secondarySchool} size={28} /> : '🎯'}</span>
                  <span style={{ fontWeight: 700, color: '#60a5fa' }}>{secondarySchool}</span>
                  <button
                    onClick={() => {
                      setSecondarySchool('');
                      setSecondarySearchTerm('');
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
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={secondarySearchTerm}
                    onChange={(e) => setSecondarySearchTerm(e.target.value)}
                    placeholder="Filter by connected school..."
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(96,165,250,0.3)',
                      borderRadius: '100px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      width: '220px',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(96,165,250,0.6)'}
                    onBlur={(e) => {
                      setTimeout(() => {
                        e.target.style.borderColor = 'rgba(96,165,250,0.3)';
                      }, 200);
                    }}
                  />
                  {secondarySearchTerm && filteredSecondarySchools.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#1a1a2e',
                      border: '1px solid rgba(96,165,250,0.3)',
                      borderRadius: '8px',
                      marginTop: '4px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 100
                    }}>
                      {filteredSecondarySchools.slice(0, 10).map(school => (
                        <div
                          key={school}
                          onClick={() => {
                            setSecondarySchool(school);
                            setSecondarySearchTerm('');
                          }}
                          style={{
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            fontSize: '0.85rem',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(96,165,250,0.1)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          <TeamWithLogo team={school} size={16} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          
          {!calculating && (
            <div style={{ color: '#8892b0', fontSize: '0.9rem' }}>
              <span style={{ color: '#ff6b35', fontWeight: 700 }}>{selectedStaffMember ? '1' : currentStaff.length}</span> current staff · 
              <span style={{ color: '#ff6b35', fontWeight: 700 }}> {secondarySchool || selectedStaffMember ? filteredUniqueOtherCoaches.size : uniqueOtherCoaches.size}</span> coaches connected ·
              <span style={{ color: '#ff6b35', fontWeight: 700 }}> {secondarySchool ? '1' : connectedTeams.size}</span> other programs
            </div>
          )}
        </div>
      )}

      {/* Staff Directory */}
      {selectedSchool && !calculating && currentStaff.length > 0 && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 2rem',
          padding: '1rem 1.5rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,107,53,0.15)',
          borderRadius: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.75rem'
          }}>
            <h3 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#8892b0',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              margin: 0
            }}>
              Current Staff
            </h3>
            {selectedStaffMember && (
              <button
                onClick={() => setSelectedStaffMember(null)}
                style={{
                  padding: '0.25rem 0.75rem',
                  background: 'rgba(255,107,53,0.2)',
                  border: '1px solid rgba(255,107,53,0.4)',
                  borderRadius: '100px',
                  color: '#ff6b35',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Show All Staff
              </button>
            )}
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {currentStaff.map((coach, idx) => {
              const isSelected = selectedStaffMember?.name === coach.name;
              const connectionCount = connections.filter(c => c.currentCoach.name === coach.name).length;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedStaffMember(isSelected ? null : coach)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    background: isSelected 
                      ? 'rgba(255,107,53,0.3)' 
                      : 'rgba(255,255,255,0.05)',
                    border: isSelected 
                      ? '1px solid rgba(255,107,53,0.6)' 
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: isSelected ? '#ff6b35' : '#ccd6f6',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255,107,53,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255,107,53,0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{coach.name}</span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: '#8892b0',
                    opacity: 0.8
                  }}>
                    {coach.currentPosition}
                  </span>
                  {connectionCount > 0 && (
                    <span style={{
                      background: isSelected ? 'rgba(255,107,53,0.5)' : 'rgba(255,107,53,0.2)',
                      color: isSelected ? '#fff' : '#ff6b35',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '100px',
                      fontSize: '0.65rem',
                      fontWeight: 700
                    }}>
                      {connectionCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
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
              {groupedConnections.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: '#8892b0'
                }}>
                  {secondarySchool 
                    ? `No connections found between ${selectedSchool} and ${secondarySchool}`
                    : `No external coaching connections found for ${selectedSchool} staff`}
                </div>
              ) : (
                groupedConnections.map((group, idx) => (
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
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><TeamLogo team={selectedSchool} size={14} />{selectedSchool} Staff</span>
                      </div>
                      <div 
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: '#fff',
                          marginBottom: '0.25rem',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleCoachClick(group.currentCoach)}
                        onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                        onMouseLeave={(e) => e.target.style.color = '#fff'}
                      >
                        {group.currentCoach.name}
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#f7c59f',
                        marginBottom: '0.5rem'
                      }}>
                        {group.currentCoach.currentPosition}
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}>
                        {group.overlaps.map((overlap, oIdx) => (
                          <div 
                            key={oIdx}
                            style={{
                              fontSize: '0.75rem',
                              color: '#8892b0',
                              padding: '0.25rem 0.5rem',
                              background: 'rgba(255,255,255,0.05)',
                              borderRadius: '4px',
                              display: 'inline-block'
                            }}
                          >
                            Was: {overlap.currentPosition} @ {overlap.connectionSchool}
                            <br />({formatYearRange(overlap.currentYears.start, overlap.currentYears.end, overlap.currentRawYears)})
                          </div>
                        ))}
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
                          {group.totalYears}
                        </div>
                        <div style={{
                          fontSize: '0.6rem',
                          color: '#0f0f23',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {group.totalYears === 1 ? 'year' : 'years'}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}>
                        {group.overlaps.map((overlap, oIdx) => (
                          <div key={oIdx}>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#f7c59f',
                              fontWeight: 600
                            }}>
                              {overlap.connectionSchool}
                            </div>
                            <div style={{
                              fontSize: '0.7rem',
                              color: '#8892b0'
                            }}>
                              {formatYearRange(overlap.overlapStart, overlap.overlapEnd)}
                            </div>
                          </div>
                        ))}
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
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>Now @ <TeamWithLogo team={group.otherCoach.currentTeam} size={16} nameStyle={{ color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem', fontWeight: 700 }} /></span>
                      </div>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: '0.25rem',
                        cursor: 'pointer'
                      }}
                        onClick={() => handleCoachClick(group.otherCoach)}
                        onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                        onMouseLeave={(e) => e.target.style.color = '#fff'}
                      >
                        {group.otherCoach.name}
                      </div>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#f7c59f',
                        marginBottom: '0.5rem'
                      }}>
                        {group.otherCoach.currentPosition}
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        alignItems: 'flex-end'
                      }}>
                        {group.overlaps.map((overlap, oIdx) => (
                          <div 
                            key={oIdx}
                            style={{
                              fontSize: '0.75rem',
                              color: '#8892b0',
                              padding: '0.25rem 0.5rem',
                              background: 'rgba(255,255,255,0.05)',
                              borderRadius: '4px',
                              display: 'inline-block'
                            }}
                          >
                            Was: {overlap.otherPosition} @ {overlap.connectionSchool}
                            <br />({formatYearRange(overlap.otherYears.start, overlap.otherYears.end, overlap.otherRawYears)})
                          </div>
                        ))}
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
                        <div 
                          style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', cursor: 'pointer' }}
                          onClick={() => handleCoachClick(group.coach)}
                          onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                          onMouseLeave={(e) => e.target.style.color = '#fff'}
                        >
                          {group.coach.name}
                        </div>
                        <div style={{ color: '#8892b0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          {group.coach.currentPosition} @ <TeamWithLogo team={group.coach.currentTeam} size={16} nameStyle={{ color: '#8892b0' }} />
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
                                <div 
                                  style={{ color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                                  onClick={() => handleCoachClick(otherCoachGroup.otherCoach)}
                                  onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                                  onMouseLeave={(e) => e.target.style.color = '#fff'}
                                >
                                  {otherCoachGroup.otherCoach.name}
                                </div>
                                <div style={{ color: '#60a5fa', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  {otherCoachGroup.otherCoach.currentPosition} @ <TeamWithLogo team={otherCoachGroup.otherCoach.currentTeam} size={16} nameStyle={{ color: '#60a5fa' }} />
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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><TeamLogo team={selectedSchool} size={22} /> Current {selectedSchool} Staff ({currentStaff.length})</span>
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
                    <div 
                      style={{
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: '0.25rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleCoachClick(coach)}
                      onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                      onMouseLeave={(e) => e.target.style.color = '#fff'}
                    >
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
      {/* Staff History View */}
      {searchMode === 'staffHistory' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 2rem', padding: '0 1rem' }}>
          <StaffHistory 
            coachesData={coachesData}
            onSelectCoach={(coach) => {
              if (coach) handleCoachClick(coach);
            }}
          />
        </div>
      )}

      {/* School History Mode */}
      {searchMode === 'schoolHistory' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto 2rem', padding: '0 1rem' }}>
          <SchoolRoster
            coachesData={coachesData}
            onSelectCoach={(coach) => handleCoachClick(coach)}
          />
        </div>
      )}

      {/* Empty State */}
      {!selectedSchool && !selectedAlmaMater && !searchedCoach && !calculating && searchMode !== 'stats' && searchMode !== 'staffHistory' && searchMode !== 'schoolHistory' && (
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
            Start Exploring
          </h2>
          <p style={{
            color: '#8892b0',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Use the search bar above to get started. Select a mode to switch between different ways to explore 
            the coaching database — from career overlaps and staff histories to stats and coaching trees.
          </p>
        </div>
      )}

      {/* Coach Modal */}
      {selectedCoach && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
            overflow: 'auto'
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              border: '1px solid rgba(255,107,53,0.3)',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              position: 'sticky',
              top: 0,
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              zIndex: 10
            }}>
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.25rem'
              }}>
                {selectedCoach.name}
                {(() => {
                  const ageInfo = getCoachAge(selectedCoach);
                  return ageInfo && (
                    <span style={{ 
                      fontSize: '1rem', 
                      fontWeight: 400, 
                      color: '#8892b0',
                      marginLeft: '0.75rem'
                    }}>
                      (Age {ageInfo.age}{ageInfo.isEstimate ? ', est.' : ''})
                    </span>
                  );
                })()}
              </h2>
              <div style={{ color: '#f7c59f', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {selectedCoach.currentPosition} @ <TeamWithLogo team={selectedCoach.currentTeam} size={22} nameStyle={{ color: '#f7c59f' }} />
              </div>
              
              {/* Bio Details */}
              {(() => {
                const salaryInfo = getSalaryInfo(selectedCoach, statsData);
                const ageInfo = getCoachAge(selectedCoach);
                const hasBioDetails = ageInfo || selectedCoach.birthplace || selectedCoach.alma_mater || salaryInfo;
                
                return hasBioDetails ? (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginTop: '0.5rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {selectedCoach.birthdate ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem'
                      }}>
                        <span style={{ color: '#8892b0' }}>🎂</span>
                        <span style={{ color: '#ccd6f6' }}>{formatBirthdate(selectedCoach.birthdate)} (Age {calculateAge(selectedCoach.birthdate)})</span>
                      </div>
                    ) : (() => {
                      const ageInfo = getCoachAge(selectedCoach);
                      return ageInfo?.isEstimate && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem'
                        }}>
                          <span style={{ color: '#8892b0' }}>🎂</span>
                          <span style={{ color: '#ccd6f6' }}>~{ageInfo.age} years old (estimated)</span>
                        </div>
                      );
                    })()}
                    {selectedCoach.birthplace && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem'
                      }}>
                        <span style={{ color: '#8892b0' }}>📍</span>
                        <span style={{ color: '#ccd6f6' }}>{selectedCoach.birthplace}</span>
                      </div>
                    )}
                    {selectedCoach.alma_mater && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem'
                      }}>
                        <span style={{ color: '#8892b0' }}>🎓</span>
                        <span style={{ color: '#ccd6f6' }}>
                          {formatAlmaMater(selectedCoach.alma_mater)}
                        </span>
                      </div>
                    )}
                    {salaryInfo && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem'
                      }}>
                        <span style={{ color: '#8892b0' }}>💰</span>
                        <span style={{ color: '#4ade80' }}>
                          2024: {salaryInfo.formatted}
                          {!salaryInfo.sameSchool && (
                            <span style={{ color: '#8892b0', marginLeft: '0.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              (<TeamLogo team={salaryInfo.school} size={14} />{salaryInfo.school})
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}
            </div>
            
            {/* Modal Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              padding: '0 2rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <button
                onClick={() => setModalTab('career')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: modalTab === 'career' ? '2px solid #ff6b35' : '2px solid transparent',
                  color: modalTab === 'career' ? '#ff6b35' : '#8892b0',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease'
                }}
              >
                📋 Career
              </button>
              <button
                onClick={() => setModalTab('tree')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: modalTab === 'tree' ? '2px solid #4ade80' : '2px solid transparent',
                  color: modalTab === 'tree' ? '#4ade80' : '#8892b0',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease'
                }}
              >
                🌳 Tree
              </button>
              {hasCoordinatorExperience(selectedCoach) && (
                <button
                  onClick={() => setModalTab('stats')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: modalTab === 'stats' ? '2px solid #60a5fa' : '2px solid transparent',
                    color: modalTab === 'stats' ? '#60a5fa' : '#8892b0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s ease'
                  }}
                >
                  📊 Stats
                </button>
              )}
            </div>
            
            {/* Modal Content */}
            <div style={{ padding: '2rem' }}>
              {/* Career Tab */}
              {modalTab === 'career' && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#ff6b35',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    📋 Coaching History
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    {selectedCoach.coaching_career?.map((job, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '100px 1fr',
                          gap: '1rem',
                          padding: '0.75rem 1rem',
                          background: job.position?.toLowerCase().startsWith('head coach') 
                            ? 'rgba(255,107,53,0.15)' 
                            : 'rgba(255,255,255,0.03)',
                          borderRadius: '8px',
                          borderLeft: job.position?.toLowerCase().startsWith('head coach')
                            ? '3px solid #ff6b35'
                            : '3px solid transparent'
                        }}
                      >
                        <div style={{
                          color: '#8892b0',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {formatYearRange(job.years?.start, job.years?.end, job.raw_years) || '—'}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <TeamLogo team={job.school} size={18} />
                            {job.school}
                          </div>
                          <div style={{ color: '#8892b0', fontSize: '0.85rem' }}>
                            {job.position}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tree Tab */}
              {modalTab === 'tree' && coachingTree && (
                <>
                  {/* Worked Under */}
                  {coachingTree.workedUnder.length > 0 && (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#4ade80',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        Active Head Coaches Worked Under ({coachingTree.workedUnder.length})
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '0.75rem'
                      }}>
                        {coachingTree.workedUnder.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: 'rgba(74,222,128,0.1)',
                              border: '1px solid rgba(74,222,128,0.2)',
                              borderRadius: '10px',
                              padding: '1rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => handleCoachClick(item.coach)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(74,222,128,0.5)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                              {item.coach.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#4ade80', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                              Now: {item.coach.currentPosition} @ <TeamWithLogo team={item.coach.currentTeam} size={16} nameStyle={{ color: '#4ade80' }} />
                            </div>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.25rem'
                            }}>
                              {item.stints.map((stint, stintIdx) => (
                                <div 
                                  key={stintIdx}
                                  style={{
                                    fontSize: '0.75rem',
                                    color: '#8892b0',
                                    padding: '0.25rem 0.5rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <span style={{ color: '#f7c59f', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><TeamLogo team={stint.school} size={14} />{stint.school}</span>
                                  {stint.years?.start != null && ` (${formatYearRange(stint.years.start, stint.years.end, stint.rawYears)})`}
                                  <br />
                                  <span style={{ opacity: 0.8 }}>My role: {stint.myPosition}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Mentored */}
                  {coachingTree.mentored.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#60a5fa',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        Active HC Tree ({coachingTree.mentored.length})
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '0.75rem'
                      }}>
                        {coachingTree.mentored.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: 'rgba(96,165,250,0.1)',
                              border: '1px solid rgba(96,165,250,0.2)',
                              borderRadius: '10px',
                              padding: '1rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => handleCoachClick(item.coach)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                              {item.coach.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#60a5fa', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                              Now: {item.coach.currentPosition} @ <TeamWithLogo team={item.coach.currentTeam} size={16} nameStyle={{ color: '#60a5fa' }} />
                            </div>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.25rem',
                              marginBottom: '0.5rem'
                            }}>
                              {item.stints.map((stint, stintIdx) => (
                                <div 
                                  key={stintIdx}
                                  style={{
                                    fontSize: '0.75rem',
                                    color: '#8892b0',
                                    padding: '0.25rem 0.5rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <span style={{ color: '#f7c59f', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><TeamLogo team={stint.school} size={14} />{stint.school}</span>
                                  {stint.years?.start != null && ` (${formatYearRange(stint.years.start, stint.years.end)})`}
                                  <br />
                                  <span style={{ opacity: 0.8 }}>Their role: {stint.position}</span>
                                </div>
                              ))}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#4ade80',
                              padding: '0.25rem 0.5rem',
                              background: 'rgba(74,222,128,0.1)',
                              borderRadius: '4px'
                            }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>→ Became HC at <TeamWithLogo team={item.becameHC.school} size={14} nameStyle={{ color: '#4ade80' }} />{item.becameHC.years?.start != null && ` (${formatYearRange(item.becameHC.years.start, item.becameHC.years.end, item.becameHC.rawYears)})`}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {coachingTree.workedUnder.length === 0 && coachingTree.mentored.length === 0 && (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#8892b0'
                    }}>
                      No coaching tree connections found in the current dataset.
                    </div>
                  )}
                </>
              )}
              
              {modalTab === 'tree' && !coachingTree && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#8892b0'
                }}>
                  Loading coaching tree...
                </div>
              )}
              
              {/* Stats Tab */}
              {modalTab === 'stats' && (
                <div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#60a5fa',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    📊 Performance Stats
                  </h3>
                  <p style={{ color: '#8892b0', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Team performance stats during HC/OC/DC tenures. Showing national rank and value.
                  </p>
                  
                  {(() => {
                    const statsYears = getCoachStatsYears(selectedCoach, statsData);
                    
                    if (statsYears.length === 0) {
                      return (
                        <div style={{
                          textAlign: 'center',
                          padding: '2rem',
                          color: '#8892b0'
                        }}>
                          No stats available for this coach's coordinator/HC roles (2011-2025).
                        </div>
                      );
                    }
                    
                    // Helper to format stat with rank
                    const formatStat = (statObj, decimals = 1, isPercent = false) => {
                      if (!statObj || statObj.value === undefined) return { rank: '—', value: '—' };
                      const val = isPercent 
                        ? (statObj.value * 100).toFixed(decimals) + '%'
                        : statObj.value.toFixed(decimals);
                      return { rank: `#${statObj.rank}`, value: val };
                    };
                    
                    // Get color based on rank
                    const getRankColor = (rank, total = 134) => {
                      if (rank === null || rank === undefined || rank === '—') return '#555';
                      // Handle both numeric ranks and string ranks with #
                      const r = typeof rank === 'number' ? rank : parseInt(String(rank).replace('#', ''));
                      if (isNaN(r)) return '#555';
                      const pct = r / total;
                      if (pct <= 0.25) return '#4ade80'; // Top 25% - green
                      if (pct <= 0.5) return '#a3e635';  // Top 50% - lime
                      if (pct <= 0.75) return '#fbbf24'; // Top 75% - amber
                      return '#f87171'; // Bottom 25% - red
                    };
                    
                    // Determine if showing offense, defense, or both
                    const showOffense = statsYears.some(s => s.advancedOffense || s.offensePPG);
                    const showDefense = statsYears.some(s => s.advancedDefense || s.defensePPG);
                    
                    // Define columns based on what data we have
                    const offenseColumns = [
                      { key: 'AdjEPAPlay', label: 'Adj EPA/Play', decimals: 2 },
                      { key: 'EPAPlay', label: 'EPA/Play', decimals: 2 },
                      { key: 'YardsPlay', label: 'Yds/Play', decimals: 2 },
                      { key: 'SRPct', label: 'SR%', decimals: 1, isPercent: true },
                      { key: 'EPADB', label: 'EPA/DB', decimals: 2 },
                      { key: 'YardsDB', label: 'Yds/DB', decimals: 2 },
                      { key: 'PassSRPct', label: 'Pass SR%', decimals: 1, isPercent: true },
                      { key: 'EPARush', label: 'EPA/Rush', decimals: 2 },
                      { key: 'YardsRush', label: 'Yds/Rush', decimals: 2 },
                      { key: 'RushSRPct', label: 'Rush SR%', decimals: 1, isPercent: true },
                      { key: 'HavocPct', label: 'Havoc%', decimals: 1, isPercent: true },
                    ];
                    
                    const defenseColumns = [
                      { key: 'AdjEPAPlay', label: 'Adj EPA/Play', decimals: 2 },
                      { key: 'EPAPlay', label: 'EPA/Play', decimals: 2 },
                      { key: 'YardsPlay', label: 'Yds/Play', decimals: 2 },
                      { key: 'SRPct', label: 'SR%', decimals: 1, isPercent: true },
                      { key: 'EPADB', label: 'EPA/DB', decimals: 2 },
                      { key: 'YardsDB', label: 'Yds/DB', decimals: 2 },
                      { key: 'PassSRPct', label: 'Pass SR%', decimals: 1, isPercent: true },
                      { key: 'EPARush', label: 'EPA/Rush', decimals: 2 },
                      { key: 'YardsRush', label: 'Yds/Rush', decimals: 2 },
                      { key: 'RushSRPct', label: 'Rush SR%', decimals: 1, isPercent: true },
                      { key: 'HavocPct', label: 'Havoc%', decimals: 1, isPercent: true },
                    ];
                    
                    const activeColumns = showOffense && !showDefense ? offenseColumns : 
                                         showDefense && !showOffense ? defenseColumns :
                                         offenseColumns; // For HC, show offensive by default
                    
                    // Define basic stats columns
                    const basicOffenseColumns = [
                      { key: 'ppg', label: 'PPG', decimals: 1 },
                      { key: 'ypg', label: 'YPG', decimals: 1 },
                      { key: 'rushYpg', label: 'Rush YPG', decimals: 1 },
                      { key: 'passYpg', label: 'Pass YPG', decimals: 1 },
                      { key: 'ypa', label: 'Yds/Att', decimals: 2 },
                      { key: 'sacked', label: 'Sacked/G', decimals: 2 },
                    ];
                    
                    const basicDefenseColumns = [
                      { key: 'ppg', label: 'PPG Allowed', decimals: 1 },
                      { key: 'ypg', label: 'YPG Allowed', decimals: 1 },
                      { key: 'rushYpg', label: 'Rush YPG', decimals: 1 },
                      { key: 'passYpg', label: 'Pass YPG', decimals: 1 },
                      { key: 'sacks', label: 'Sacks/G', decimals: 2 },
                      { key: 'takeaways', label: 'TO/G', decimals: 2 },
                    ];
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Basic Stats Table */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <h4 style={{ color: '#8892b0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                            {showOffense && !showDefense ? 'Offensive Stats (2011-2025)' :
                             showDefense && !showOffense ? 'Defensive Stats (2011-2025)' :
                             'Team Stats (2011-2025)'}
                          </h4>
                          
                          {/* Tabs for HC to switch between offense/defense */}
                          {showOffense && showDefense && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <button
                                onClick={() => setAdvancedStatsView('offense')}
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  background: advancedStatsView === 'offense' ? 'rgba(74,222,128,0.2)' : 'transparent',
                                  border: '1px solid #4ade80',
                                  borderRadius: '4px',
                                  color: '#4ade80',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Offense
                              </button>
                              <button
                                onClick={() => setAdvancedStatsView('defense')}
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  background: advancedStatsView === 'defense' ? 'rgba(96,165,250,0.2)' : 'transparent',
                                  border: '1px solid #60a5fa',
                                  borderRadius: '4px',
                                  color: '#60a5fa',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Defense
                              </button>
                            </div>
                          )}
                          
                          <div style={{ overflowX: 'auto', borderRadius: '8px' }}>
                            <table style={{ 
                              width: '100%', 
                              borderCollapse: 'collapse',
                              fontSize: '0.75rem',
                              minWidth: '700px'
                            }}>
                              <thead>
                                <tr style={{ background: 'rgba(96,165,250,0.15)' }}>
                                  <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', color: '#8892b0', fontWeight: 600, position: 'sticky', left: 0, background: '#1a1f35', zIndex: 1 }}>Year</th>
                                  <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', color: '#8892b0', fontWeight: 600, position: 'sticky', left: '50px', background: '#1a1f35', zIndex: 1 }}>School</th>
                                  {((showOffense && !showDefense) ? basicOffenseColumns :
                                    (showDefense && !showOffense) ? basicDefenseColumns :
                                    advancedStatsView === 'defense' ? basicDefenseColumns : basicOffenseColumns
                                  ).map(col => (
                                    <th key={col.key} style={{ padding: '0.6rem 0.5rem', textAlign: 'center', color: '#8892b0', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                      {col.label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {statsYears
                                  .filter(s => {
                                    if (showOffense && !showDefense) return s.offense;
                                    if (showDefense && !showOffense) return s.defense;
                                    return advancedStatsView === 'defense' ? s.defense : s.offense;
                                  })
                                  .map((stat, idx) => {
                                    const basicStats = (showOffense && !showDefense) ? stat.offense :
                                                      (showDefense && !showOffense) ? stat.defense :
                                                      advancedStatsView === 'defense' ? stat.defense : stat.offense;
                                    const columns = (showOffense && !showDefense) ? basicOffenseColumns :
                                                   (showDefense && !showOffense) ? basicDefenseColumns :
                                                   advancedStatsView === 'defense' ? basicDefenseColumns : basicOffenseColumns;
                                    
                                    if (!basicStats) return null;
                                    
                                    return (
                                      <tr 
                                        key={idx}
                                        style={{ 
                                          background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                          borderLeft: `2px solid ${stat.positionType === 'hc' ? '#ff6b35' : stat.positionType === 'oc' ? '#4ade80' : '#60a5fa'}`
                                        }}
                                      >
                                        <td style={{ padding: '0.5rem', color: '#fff', fontWeight: 600, fontFamily: 'monospace', position: 'sticky', left: 0, background: idx % 2 === 0 ? '#1e2340' : '#1a1f35', zIndex: 1 }}>
                                          {stat.year}
                                        </td>
                                        <td style={{ padding: '0.5rem', color: '#ccd6f6', position: 'sticky', left: '50px', background: idx % 2 === 0 ? '#1e2340' : '#1a1f35', zIndex: 1, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          {stat.team}
                                        </td>
                                        {columns.map(col => {
                                          const statData = basicStats[col.key];
                                          if (!statData) return <td key={col.key} style={{ padding: '0.5rem', textAlign: 'center', color: '#555' }}>—</td>;
                                          
                                          return (
                                            <td key={col.key} style={{ padding: '0.5rem', textAlign: 'center', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                                              <span style={{ color: getRankColor(statData.rank) }}>#{statData.rank}</span>
                                              <span style={{ color: '#8892b0', fontSize: '0.7rem' }}> ({statData.value.toFixed(col.decimals)})</span>
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        {/* Advanced Stats Table */}
                        {statsYears.some(s => s.advancedOffense || s.advancedDefense) && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <h4 style={{ color: '#8892b0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                              {showOffense && !showDefense ? 'Advanced Offensive Stats (2014+)' :
                               showDefense && !showOffense ? 'Advanced Defensive Stats (2014+)' :
                               advancedStatsView === 'defense' ? 'Advanced Defensive Stats (2014+)' : 'Advanced Offensive Stats (2014+)'}
                            </h4>
                            
                            <div style={{ overflowX: 'auto', borderRadius: '8px' }}>
                              <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                fontSize: '0.75rem',
                                minWidth: '900px'
                              }}>
                                <thead>
                                  <tr style={{ background: 'rgba(96,165,250,0.15)' }}>
                                    <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', color: '#8892b0', fontWeight: 600, position: 'sticky', left: 0, background: '#1a1f35', zIndex: 1 }}>Year</th>
                                    <th style={{ padding: '0.6rem 0.5rem', textAlign: 'left', color: '#8892b0', fontWeight: 600, position: 'sticky', left: '50px', background: '#1a1f35', zIndex: 1 }}>School</th>
                                    {activeColumns.map(col => (
                                      <th key={col.key} style={{ padding: '0.6rem 0.5rem', textAlign: 'center', color: '#8892b0', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                        {col.label}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {statsYears
                                    .filter(s => {
                                      // Filter based on selected view and available data
                                      if (showOffense && !showDefense) {
                                        // OC only - show rows with offensive data
                                        return s.advancedOffense;
                                      } else if (showDefense && !showOffense) {
                                        // DC only - show rows with defensive data
                                        return s.advancedDefense;
                                      } else {
                                        // HC (has both) - filter based on toggle
                                        if (advancedStatsView === 'defense') {
                                          return s.advancedDefense;
                                        } else {
                                          return s.advancedOffense;
                                        }
                                      }
                                    })
                                    .map((stat, idx) => {
                                    // Get the appropriate stats based on view
                                    const advStats = (showOffense && !showDefense) ? stat.advancedOffense :
                                                    (showDefense && !showOffense) ? stat.advancedDefense :
                                                    (advancedStatsView === 'defense') ? stat.advancedDefense : stat.advancedOffense;
                                    
                                    if (!advStats) return null;
                                    
                                    return (
                                      <tr 
                                        key={idx}
                                        style={{ 
                                          background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                          borderLeft: `2px solid ${stat.positionType === 'hc' ? '#ff6b35' : stat.positionType === 'oc' ? '#4ade80' : '#60a5fa'}`
                                        }}
                                      >
                                        <td style={{ padding: '0.5rem', color: '#fff', fontWeight: 600, fontFamily: 'monospace', position: 'sticky', left: 0, background: idx % 2 === 0 ? '#1e2340' : '#1a1f35', zIndex: 1 }}>
                                          {stat.year}
                                        </td>
                                        <td style={{ padding: '0.5rem', color: '#ccd6f6', position: 'sticky', left: '50px', background: idx % 2 === 0 ? '#1e2340' : '#1a1f35', zIndex: 1, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          {stat.team}
                                        </td>
                                        {activeColumns.map(col => {
                                          const statData = advStats[col.key];
                                          if (!statData) return <td key={col.key} style={{ padding: '0.5rem', textAlign: 'center', color: '#555' }}>—</td>;
                                          
                                          const { rank, value } = formatStat(statData, col.decimals, col.isPercent);
                                          return (
                                            <td key={col.key} style={{ padding: '0.5rem', textAlign: 'center', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                                              <span style={{ color: getRankColor(rank) }}>{rank}</span>
                                              <span style={{ color: '#8892b0', fontSize: '0.7rem' }}> ({value})</span>
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
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
