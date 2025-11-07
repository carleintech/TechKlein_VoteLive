/**
 * API Route: Department/Region Breakdown
 * Shows votes by Haiti departments
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Haiti's 10 departments
const HAITI_DEPARTMENTS = [
  'Artibonite',
  'Centre',
  'Grand\'Anse',
  'Nippes',
  'Nord',
  'Nord-Est',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Est',
];

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all votes from Haiti with region data
    const { data: haitiVotes } = await supabase
      .from('votes')
      .select(`
        id,
        region,
        country,
        candidate_id,
        candidates (
          id,
          name,
          slug,
          photo_url
        )
      `)
      .eq('country', 'Haiti');

    if (!haitiVotes || haitiVotes.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          departments: [],
          totalVotes: 0,
          message: 'Pa gen vòt Ayiti ankò',
        },
      });
    }

    // Group votes by department
    const departmentMap: Record<string, any> = {};
    let unspecifiedCount = 0;

    haitiVotes.forEach((vote: any) => {
      const region = vote.region || 'Non Espesifye';
      const candidateId = vote.candidate_id;
      const candidateName = vote.candidates?.name || 'Unknown';
      const candidatePhoto = vote.candidates?.photo_url || '';

      // Initialize department if not exists
      if (!departmentMap[region]) {
        departmentMap[region] = {
          department: region,
          totalVotes: 0,
          candidates: {},
          topCandidate: null,
          topCandidateVotes: 0,
        };
      }

      // Increment total votes
      departmentMap[region].totalVotes++;

      // Track candidate votes
      if (!departmentMap[region].candidates[candidateId]) {
        departmentMap[region].candidates[candidateId] = {
          id: candidateId,
          name: candidateName,
          photo_url: candidatePhoto,
          votes: 0,
        };
      }
      departmentMap[region].candidates[candidateId].votes++;

      // Update top candidate
      if (
        departmentMap[region].candidates[candidateId].votes >
        departmentMap[region].topCandidateVotes
      ) {
        departmentMap[region].topCandidate = candidateName;
        departmentMap[region].topCandidatePhoto = candidatePhoto;
        departmentMap[region].topCandidateVotes =
          departmentMap[region].candidates[candidateId].votes;
      }

      // Track unspecified
      if (region === 'Non Espesifye') {
        unspecifiedCount++;
      }
    });

    // Format departments array
    const departments = Object.values(departmentMap).map((dept: any) => ({
      department: dept.department,
      totalVotes: dept.totalVotes,
      percentage: (dept.totalVotes / haitiVotes.length) * 100,
      topCandidate: dept.topCandidate,
      topCandidatePhoto: dept.topCandidatePhoto,
      topCandidateVotes: dept.topCandidateVotes,
      candidates: Object.values(dept.candidates).sort(
        (a: any, b: any) => b.votes - a.votes
      ),
    }));

    // Sort by total votes
    departments.sort((a, b) => b.totalVotes - a.totalVotes);

    return NextResponse.json({
      success: true,
      data: {
        departments,
        totalVotes: haitiVotes.length,
        departmentCount: departments.length,
        unspecifiedCount,
        coverage: {
          specified: ((haitiVotes.length - unspecifiedCount) / haitiVotes.length) * 100,
          unspecified: (unspecifiedCount / haitiVotes.length) * 100,
        },
      },
    });
  } catch (error) {
    console.error('Department stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch department statistics' },
      { status: 500 }
    );
  }
}
