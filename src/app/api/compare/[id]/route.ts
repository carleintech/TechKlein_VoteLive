/**
 * API Route: Compare Candidate Data
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidateId = parseInt(id);
    const supabase = await createClient();

    // Get candidate info
    const { data: candidate } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    // Get stats
    const { data: stats } = await supabase
      .from('vote_aggregates')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();

    // Get by country
    const { data: byCountry } = await supabase
      .from('vote_by_country')
      .select('*')
      .eq('candidate_slug', (candidate as any)?.slug)
      .order('total_votes', { ascending: false });

    // Get total votes across all candidates
    const { data: allCandidates } = await supabase
      .from('vote_aggregates')
      .select('total_votes');
    
    const totalVotes = allCandidates?.reduce((sum: number, c: any) => sum + (c.total_votes || 0), 0) || 1;
    const candidateVotes = (stats as any)?.total_votes || 0;
    const percentage = (candidateVotes / totalVotes) * 100;

    // Format top countries
    const topCountries = (byCountry || []).map((c: any) => ({
      country: c.country_name || c.country || 'Unknown',
      votes: c.total_votes || 0,
      percentage: ((c.total_votes || 0) / candidateVotes) * 100,
    }));

    return NextResponse.json({
      id: candidateId,
      name: (candidate as any)?.name || '',
      slug: (candidate as any)?.slug || '',
      photo_url: (candidate as any)?.photo_url || '',
      total_votes: candidateVotes,
      percentage: percentage,
      country_count: byCountry?.length || 0,
      top_countries: topCountries,
    });

  } catch (error) {
    console.error('Compare data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compare data' },
      { status: 500 }
    );
  }
}
