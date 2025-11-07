/**
 * API Route: Map Data
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

// Country coordinates
const COUNTRY_COORDS: Record<string, { lat: number; lng: number; code: string }> = {
  'Haiti': { lat: 18.9712, lng: -72.2852, code: 'HT' },
  'United States': { lat: 37.0902, lng: -95.7129, code: 'US' },
  'Canada': { lat: 56.1304, lng: -106.3468, code: 'CA' },
  'France': { lat: 46.2276, lng: 2.2137, code: 'FR' },
  'Dominican Republic': { lat: 18.7357, lng: -70.1627, code: 'DO' },
  'Brazil': { lat: -14.2350, lng: -51.9253, code: 'BR' },
  'Chile': { lat: -35.6751, lng: -71.5430, code: 'CL' },
  'Mexico': { lat: 23.6345, lng: -102.5528, code: 'MX' },
  'Bahamas': { lat: 25.0343, lng: -77.3963, code: 'BS' },
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const candidateSlug = searchParams.get('candidate');

    const supabase = getAdminClient();

    // Get votes by country with fallback strategy
    let countryData: any[] = [];
    
    // Try vote_by_country view first
    const { data: viewData, error: viewError } = await supabase
      .from('vote_by_country')
      .select('*');

    if (viewData && viewData.length > 0) {
      countryData = viewData;
    } else {
      console.log('Falling back to votes table for map data');
      
      // Fallback: Query votes table directly
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select(`
          country,
          candidate_id,
          candidates (
            id,
            name,
            slug
          )
        `);

      if (votes) {
        // Group by country and candidate
        const grouped: Record<string, Record<number, any>> = {};
        
        votes.forEach((vote: any) => {
          const country = vote.country || 'Unknown';
          const candidateId = vote.candidate_id;
          const candidateName = vote.candidates?.name || 'Unknown';
          const candidateSlug = vote.candidates?.slug || '';

          if (!grouped[country]) {
            grouped[country] = {};
          }

          if (!grouped[country][candidateId]) {
            grouped[country][candidateId] = {
              country,
              candidate_id: candidateId,
              candidate_name: candidateName,
              candidate_slug: candidateSlug,
              total_votes: 0,
            };
          }

          grouped[country][candidateId].total_votes += 1;
        });

        // Flatten to array
        countryData = Object.values(grouped).flatMap((candidates) => 
          Object.values(candidates)
        );
      }
    }

    // Filter by candidate if specified
    if (candidateSlug && countryData.length > 0) {
      countryData = countryData.filter(
        (item: any) => item.candidate_slug === candidateSlug
      );
    }

    if (!countryData || countryData.length === 0) {
      return NextResponse.json({ 
        countries: [], 
        global: {
          totalVotes: 0,
          totalCountries: 0,
          topCountry: 'N/A'
        }
      });
    }

    // Aggregate by country
    const countryMap: Record<string, any> = {};
    let totalVotes = 0;

    countryData.forEach((vote: any) => {
      const country = vote.country || 'Unknown';
      
      if (!countryMap[country]) {
        countryMap[country] = {
          country,
          totalVotes: 0,
          topCandidate: vote.candidate_name,
          topVotes: vote.total_votes || 0,
        };
      }

      const voteCount = vote.total_votes || 0;
      countryMap[country].totalVotes += voteCount;
      totalVotes += voteCount;

      if (voteCount > countryMap[country].topVotes) {
        countryMap[country].topCandidate = vote.candidate_name;
        countryMap[country].topVotes = voteCount;
      }
    });

    // Format for map
    const countries = Object.values(countryMap).map((country: any) => {
      const coords = COUNTRY_COORDS[country.country] || { lat: 0, lng: 0, code: 'XX' };
      
      return {
        ...coords,
        country: country.country,
        totalVotes: country.totalVotes,
        topCandidate: country.topCandidate,
        percentage: totalVotes > 0 ? (country.totalVotes / totalVotes) * 100 : 0,
      };
    });

    const topCountry = countries.sort((a, b) => b.totalVotes - a.totalVotes)[0];

    return NextResponse.json({
      countries,
      global: {
        totalVotes,
        totalCountries: countries.length,
        topCountry: topCountry?.country || 'N/A',
      },
    });

  } catch (error) {
    console.error('Map data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch map data' },
      { status: 500 }
    );
  }
}
