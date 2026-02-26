// src/hooks/useCoachingData.js
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

/**
 * Fetches all coaching data from Supabase and transforms it to match
 * the original JSON format expected by CoachingHotboard.jsx
 */
export function useCoachingData() {
  const [coachesData, setCoachesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    try {
      setLoading(true)
      setError(null)

      // Fetch all data in parallel
      const [
        { data: coaches, error: coachesError },
        { data: stints, error: stintsError },
        { data: almaMaters, error: almaError },
        { data: schools, error: schoolsError }
      ] = await Promise.all([
        supabase
          .from('coaches')
          .select('*')
          .eq('is_primary', true),
        supabase
          .from('coaching_stints')
          .select('*')
          .order('start_year', { ascending: false }),
        supabase
          .from('coach_alma_maters')
          .select('*'),
        supabase
          .from('schools')
          .select('id, canonical_name')
      ])

      if (coachesError) throw coachesError
      if (stintsError) throw stintsError
      if (almaError) throw almaError
      if (schoolsError) throw schoolsError

      // Create school lookup map
      const schoolMap = {}
      schools.forEach(s => {
        schoolMap[s.id] = s.canonical_name
      })

      // Group stints by coach
      const stintsByCoach = {}
      stints.forEach(stint => {
        if (!stintsByCoach[stint.coach_id]) {
          stintsByCoach[stint.coach_id] = []
        }
        stintsByCoach[stint.coach_id].push({
          school: schoolMap[stint.school_id] || 'Unknown',
          position: stint.position,
          years: {
            start: stint.start_year,
            end: stint.end_year
          },
          raw_years: stint.raw_years
        })
      })

      // Group alma maters by coach
      const almaByCoach = {}
      almaMaters.forEach(am => {
        if (!almaByCoach[am.coach_id]) {
          almaByCoach[am.coach_id] = []
        }
        almaByCoach[am.coach_id].push({
          school: schoolMap[am.school_id] || 'Unknown',
          year: am.graduation_year,
          degree: am.degree
        })
      })

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
      }))

      setCoachesData(transformedCoaches)
    } catch (err) {
      console.error('Error fetching coaching data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { coachesData, loading, error, refetch: fetchAllData }
}

/**
 * Fetches a single coach with full details
 */
export async function fetchCoachById(coachId) {
  const [
    { data: coach, error: coachError },
    { data: stints, error: stintsError },
    { data: almaMaters, error: almaError }
  ] = await Promise.all([
    supabase
      .from('coaches')
      .select(`
        *,
        current_team:schools!current_team_id(canonical_name)
      `)
      .eq('id', coachId)
      .single(),
    supabase
      .from('coaching_stints')
      .select(`
        *,
        school:schools(canonical_name)
      `)
      .eq('coach_id', coachId)
      .order('start_year', { ascending: false }),
    supabase
      .from('coach_alma_maters')
      .select(`
        *,
        school:schools(canonical_name)
      `)
      .eq('coach_id', coachId)
  ])

  if (coachError) throw coachError
  if (stintsError) throw stintsError
  if (almaError) throw almaError

  return {
    ...coach,
    currentTeam: coach.current_team?.canonical_name,
    currentPosition: coach.current_position,
    coaching_career: stints.map(s => ({
      school: s.school?.canonical_name,
      position: s.position,
      years: { start: s.start_year, end: s.end_year },
      raw_years: s.raw_years
    })),
    alma_mater: almaMaters.map(am => ({
      school: am.school?.canonical_name,
      year: am.graduation_year,
      degree: am.degree
    }))
  }
}

/**
 * Search coaches by name
 */
export async function searchCoaches(searchTerm) {
  const { data, error } = await supabase
    .from('coaches')
    .select(`
      id,
      name,
      current_position,
      current_team:schools!current_team_id(canonical_name)
    `)
    .eq('is_primary', true)
    .ilike('name', `%${searchTerm}%`)
    .limit(20)

  if (error) throw error

  return data.map(c => ({
    id: c.id,
    name: c.name,
    currentPosition: c.current_position,
    currentTeam: c.current_team?.canonical_name
  }))
}

/**
 * Get coaches by school (current or historical)
 */
export async function getCoachesBySchool(schoolName) {
  // First find the school
  const { data: schools, error: schoolError } = await supabase
    .from('schools')
    .select('id')
    .ilike('canonical_name', schoolName)
    .limit(1)

  if (schoolError) throw schoolError
  if (!schools.length) return []

  const schoolId = schools[0].id

  // Get all coaches who worked there
  const { data: stints, error: stintsError } = await supabase
    .from('coaching_stints')
    .select(`
      coach_id,
      position,
      start_year,
      end_year,
      is_current,
      coach:coaches(id, name, current_position, birthdate)
    `)
    .eq('school_id', schoolId)
    .order('start_year', { ascending: false })

  if (stintsError) throw stintsError

  return stints
}

/**
 * Get all schools for dropdown
 */
export async function getAllSchools() {
  const { data, error } = await supabase
    .from('schools')
    .select('id, canonical_name, division, conference')
    .order('canonical_name')

  if (error) throw error
  return data
}
