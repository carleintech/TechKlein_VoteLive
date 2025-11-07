/**
 * GET /api/candidates/[id]
 * Returns a single candidate by ID or slug
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/types/database';

type Candidate = Database['public']['Tables']['candidates']['Row'];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: identifier } = await params;

    // Try to find by ID first (UUID format)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    let query = supabase
      .from('candidates')
      .select('*')
      .eq('is_active', true);

    if (isUuid) {
      query = query.eq('id', identifier);
    } else {
      query = query.eq('slug', identifier);
    }

    const { data: candidate, error } = await query.maybeSingle<Candidate>();

    if (error || !candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    // Get vote count for this candidate
    const { data: voteStats } = await supabase
      .from('vote_aggregations')
      .select('total_votes')
      .eq('candidate_id', candidate.id)
      .maybeSingle();

    // Transform data for response
    const response = {
      id: candidate.id,
      fullName: candidate.name,
      partyAffiliation: candidate.party,
      photoUrl: candidate.photo_url,
      slug: candidate.slug,
      totalVotes: voteStats?.total_votes || 0,
      createdAt: candidate.created_at,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/candidates/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
