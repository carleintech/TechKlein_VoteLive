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
    const { data: stats, error: statsError } = await supabase
      .from('vote_aggregates')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();

    if (statsError) {
      console.log('Stats error for candidate', candidateId, ':', statsError);
    }

    // If no stats in vote_aggregates, try getting directly from votes table
    let candidateVotes = (stats as any)?.total_votes || 0;
    
    if (!stats || candidateVotes === 0) {
      const { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('candidate_id', candidateId);
      
      candidateVotes = count || 0;
      console.log('Direct count for candidate', candidateId, ':', candidateVotes);
    }

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
    
    let totalVotes = allCandidates?.reduce((sum: number, c: any) => sum + (c.total_votes || 0), 0) || 0;
    
    // If vote_aggregates is empty, count from votes table
    if (totalVotes === 0) {
      const { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true });
      
      totalVotes = count || 1;
      console.log('Total votes from direct count:', totalVotes);
    }
    
    const percentage = totalVotes > 0 ? (candidateVotes / totalVotes) * 100 : 0;

    // Format top countries
    const topCountries = (byCountry || []).map((c: any) => ({
      country: c.country_name || c.country || 'Unknown',
      votes: c.total_votes || 0,
      percentage: candidateVotes > 0 ? ((c.total_votes || 0) / candidateVotes) * 100 : 0,
    }));

    console.log('Compare API Response for candidate', candidateId, ':', {
      candidateVotes,
      totalVotes,
      percentage,
      countryCount: byCountry?.length || 0,
    });

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
