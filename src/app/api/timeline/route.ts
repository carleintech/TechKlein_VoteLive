/**
 * API Route: Timeline Data
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    const searchParams = request.nextUrl.searchParams;
    const candidateSlug = searchParams.get('candidate');

    // Generate timeline events based on vote patterns
    const events: any[] = [];

    // Get first vote (launch)
    const { data: firstVoteData, error: firstVoteError } = await (supabase as any)
      .from('votes')
      .select('created_at, candidates(name, photo_url)')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (firstVoteData && !firstVoteError) {
      const firstVote: any = firstVoteData;
      events.push({
        date: firstVote.created_at,
        type: 'launch',
        title: 'Lanse TechKlein VoteLive',
        description: 'Premye vòt soumèt nan platfòm lan',
        icon: '🚀',
      });
    }

    // Get total vote count to determine which milestones to check
    const { count: totalVotes } = await (supabase as any)
      .from('votes')
      .select('*', { count: 'exact', head: true });

    // Get milestones (1000, 10000, 50000, 100000 votes)
    const milestones = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 250000];
    
    for (const milestone of milestones) {
      if ((totalVotes || 0) >= milestone) {
        // Get the vote at this milestone position
        const { data: milestoneVotes } = await (supabase as any)
          .from('votes')
          .select('created_at, candidates(name, photo_url)')
          .order('created_at', { ascending: true })
          .range(milestone - 1, milestone - 1);

        if (milestoneVotes && milestoneVotes.length > 0) {
          const milestoneVote: any = milestoneVotes[0];
          events.push({
            date: milestoneVote.created_at,
            type: 'milestone',
            title: `${formatNumber(milestone)} Vòt!`,
            description: `Platfòm lan rive ${formatNumber(milestone)} vòt total`,
            votes: milestone,
            icon: '🎉',
          });
        }
      }
    }

    // Get daily stats
    const dailyStats: any[] = [];
    const daysToShow = 30;

    for (let i = 0; i < daysToShow; i++) {
      const date = subDays(new Date(), i);
      const dateStart = new Date(date.setHours(0, 0, 0, 0));
      const dateEnd = new Date(date.setHours(23, 59, 59, 999));

      const { count: dayVotes } = await (supabase as any)
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dateStart.toISOString())
        .lte('created_at', dateEnd.toISOString());

      const { count: totalUntilDay } = await (supabase as any)
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .lte('created_at', dateEnd.toISOString());

      // Get top candidate for that day
      const { data: dayVotes2 } = await (supabase as any)
        .from('votes')
        .select('candidate_id, candidates(name)')
        .gte('created_at', dateStart.toISOString())
        .lte('created_at', dateEnd.toISOString());

      let topCandidate = 'N/A';
      if (dayVotes2 && dayVotes2.length > 0) {
        // Count votes per candidate
        const candidateVotes: Record<number, { name: string; count: number }> = {};
        dayVotes2.forEach((vote: any) => {
          const id = vote.candidate_id;
          const name = vote.candidates?.name || 'Unknown';
          if (!candidateVotes[id]) {
            candidateVotes[id] = { name, count: 0 };
          }
          candidateVotes[id].count++;
        });

        // Find top candidate
        const top = Object.values(candidateVotes).sort((a, b) => b.count - a.count)[0];
        if (top) {
          topCandidate = top.name;
        }
      }

      if (dayVotes && dayVotes > 0) {
        dailyStats.push({
          date: dateStart.toISOString(),
          totalVotes: totalUntilDay || 0,
          newVotes: dayVotes || 0,
          topCandidate,
          topCandidateVotes: dayVotes || 0,
        });
      }
    }

    return NextResponse.json({
      events: events.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
      dailyStats: dailyStats.reverse(),
    });

  } catch (error) {
    console.error('Timeline error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    );
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}
