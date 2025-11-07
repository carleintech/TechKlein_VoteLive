/**
 * Candidate Stats Page - Detailed Statistics
 * Server component with vote breakdown by country and region
 */

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/server';
import { formatNumber } from '@/lib/utils';
import {
  ArrowLeft,
  Users,
  Globe,
  MapPin,
  Trophy,
  Share2,
  BarChart3,
  TrendingUp,
  Award,
} from 'lucide-react';

interface CandidateData {
  id: number;
  name: string;
  slug: string;
  photo_url: string;
  party: string | null;
  motto: string | null;
}

interface VoteStats {
  total_votes: number;
  percentage: number;
  rank: number;
}

interface CountryVotes {
  country: string;
  total_votes: number;
  percentage: number;
  regions: Array<{
    region: string;
    votes: number;
  }>;
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: candidate } = await (supabase as any)
    .from('candidates')
    .select('name, photo_url')
    .eq('slug', slug)
    .single();

  if (!candidate) {
    return {
      title: 'Kandida Pa Jwenn',
    };
  }

  return {
    title: `${(candidate as any).name} - Estatistik | HaitiVote`,
    description: `Wè estatistik detaye pou ${(candidate as any).name} nan sondaj HaitiVote 2025-2026.`,
    openGraph: {
      title: `${(candidate as any).name} - Estatistik`,
      description: `Estatistik detaye pou ${(candidate as any).name}`,
      images: (candidate as any).photo_url ? [(candidate as any).photo_url] : [],
    },
  };
}

async function getCandidateData(slug: string) {
  const supabase = await createClient();

  // Get candidate info
  const { data: candidate, error: candidateError } = await (supabase as any)
    .from('candidates')
    .select('*')
    .eq('slug', slug)
    .single();

  if (candidateError || !candidate) {
    return null;
  }

  // Get vote statistics from vote_aggregates view
  const { data: aggregates } = await (supabase as any)
    .from('vote_aggregates')
    .select('*')
    .order('total_votes', { ascending: false });

  const candidateAggregate = aggregates?.find(
    (a: any) => a.candidate_id === candidate.id
  );

  const voteStats: VoteStats = {
    total_votes: candidateAggregate?.total_votes || 0,
    percentage: candidateAggregate?.percentage || 0,
    rank: aggregates?.findIndex((a: any) => a.candidate_id === candidate.id) + 1 || 0,
  };

  // Get votes by country
  const { data: countryVotes } = await (supabase as any)
    .from('votes')
    .select('country, region')
    .eq('candidate_id', candidate.id)
    .eq('status', 'verified');

  // Process country and region data
  const countryMap = new Map<string, { total: number; regions: Map<string, number> }>();

  countryVotes?.forEach((vote: any) => {
    const country = vote.country || 'Unknown';
    const region = vote.region || 'Unknown';

    if (!countryMap.has(country)) {
      countryMap.set(country, { total: 0, regions: new Map() });
    }

    const countryData = countryMap.get(country)!;
    countryData.total += 1;

    const regionCount = countryData.regions.get(region) || 0;
    countryData.regions.set(region, regionCount + 1);
  });

  const countryStats: CountryVotes[] = Array.from(countryMap.entries())
    .map(([country, data]) => ({
      country,
      total_votes: data.total,
      percentage: voteStats.total_votes > 0 
        ? (data.total / voteStats.total_votes) * 100 
        : 0,
      regions: Array.from(data.regions.entries())
        .map(([region, votes]) => ({ region, votes }))
        .sort((a, b) => b.votes - a.votes),
    }))
    .sort((a, b) => b.total_votes - a.total_votes);

  return {
    candidate: candidate as CandidateData,
    voteStats,
    countryStats,
  };
}

export default async function CandidateStatsPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCandidateData(slug);

  if (!data) {
    notFound();
  }

  const { candidate, voteStats, countryStats } = data;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🥇', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600', label: 'LIDÈ' };
    if (rank === 2) return { icon: '🥈', color: 'bg-gradient-to-r from-gray-400 to-gray-600', label: '2YÈM' };
    if (rank === 3) return { icon: '🥉', color: 'bg-gradient-to-r from-orange-500 to-orange-700', label: '3YÈM' };
    return { icon: `#${rank}`, color: 'bg-gradient-to-r from-blue-500 to-purple-600', label: `RANK #${rank}` };
  };

  const rankBadge = getRankBadge(voteStats.rank);
  const topRegion = countryStats[0]?.regions[0];
  const shareUrl = `https://haitievote.com/candidate/${slug}/stats`;
  const shareText = `Wè estatistik pou ${candidate.name} sou HaitiVote! ${formatNumber(voteStats.total_votes)} vòt (${voteStats.percentage.toFixed(1)}%)`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="text-2xl">🇭🇹</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">
                HaitiVote
              </span>
            </Link>
            <Link href="/leaderboard">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Klasman
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Candidate Header */}
        <Card className="mb-8 border-2 border-[#006CFF]/30 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#006CFF]/10 to-[#7F00FF]/10 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Photo */}
              <div className="relative">
                {candidate.photo_url ? (
                  <Image
                    src={candidate.photo_url}
                    alt={candidate.name}
                    width={200}
                    height={200}
                    className="w-48 h-48 rounded-2xl object-cover border-4 border-white shadow-2xl"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-[#006CFF] to-[#7F00FF] flex items-center justify-center border-4 border-white">
                    <span className="text-6xl font-bold text-white">
                      {candidate.name.charAt(0)}
                    </span>
                  </div>
                )}
                <Badge className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 ${rankBadge.color} text-white text-lg px-4 py-2`}>
                  {rankBadge.icon} {rankBadge.label}
                </Badge>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    {candidate.name}
                  </h1>
                  {candidate.party && (
                    <p className="text-xl text-gray-600 font-medium">{candidate.party}</p>
                  )}
                  {candidate.motto && (
                    <p className="text-lg text-gray-500 italic mt-2">"{candidate.motto}"</p>
                  )}
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-[#006CFF]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-5 w-5 text-[#006CFF]" />
                      <span className="text-sm text-gray-600 font-medium">Total Vòt</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatNumber(voteStats.total_votes)}
                    </p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-purple-300">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <span className="text-sm text-gray-600 font-medium">Pousantaj</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">
                      {voteStats.percentage.toFixed(2)}%
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-green-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm text-gray-600 font-medium">Pozisyon</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      #{voteStats.rank}
                    </p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-blue-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-gray-600 font-medium">Peyi</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {countryStats.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Share Buttons */}
        <Card className="mb-8 border-2 border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Pataje Estatistik Yo:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2 bg-green-50 hover:bg-green-100 border-green-300">
                    <span className="text-xl">📱</span>
                    WhatsApp
                  </Button>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2 bg-blue-50 hover:bg-blue-100 border-blue-300">
                    <span className="text-xl">👍</span>
                    Facebook
                  </Button>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2 bg-sky-50 hover:bg-sky-100 border-sky-300">
                    <span className="text-xl">🐦</span>
                    Twitter
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Region Highlight */}
        {topRegion && (
          <Card className="mb-8 border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Rejyon Ki Gen Plis Sipò</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {topRegion.region}, {countryStats[0].country}
                  </p>
                  <p className="text-lg text-green-700 font-semibold">
                    {formatNumber(topRegion.votes)} vòt
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vote Breakdown by Country */}
        <Card className="border-2 border-gray-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#006CFF]/5 to-[#7F00FF]/5">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-[#006CFF]" />
              Distribisyon Vòt pa Peyi ak Rejyon
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {countryStats.length > 0 ? (
              <Tabs defaultValue={countryStats[0].country} className="w-full">
                <TabsList className="w-full flex-wrap h-auto gap-2 bg-transparent p-2">
                  {countryStats.slice(0, 10).map((country) => (
                    <TabsTrigger
                      key={country.country}
                      value={country.country}
                      className="flex-1 min-w-[120px]"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{country.country}</span>
                        <Badge variant="secondary" className="ml-1">
                          {formatNumber(country.total_votes)}
                        </Badge>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {countryStats.slice(0, 10).map((country) => (
                  <TabsContent key={country.country} value={country.country} className="mt-6 space-y-6">
                    {/* Country Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total Vòt</p>
                          <p className="text-3xl font-bold text-[#006CFF]">
                            {formatNumber(country.total_votes)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Pousantaj</p>
                          <p className="text-3xl font-bold text-purple-600">
                            {country.percentage.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Rejyon</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {country.regions.length}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Progress value={country.percentage} className="h-3" />
                      </div>
                    </div>

                    {/* Regions List */}
                    <div>
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-[#006CFF]" />
                        Vòt pa Rejyon
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {country.regions.map((region, index) => {
                          const regionPercentage = (region.votes / country.total_votes) * 100;
                          return (
                            <div
                              key={region.region}
                              className="p-4 rounded-lg bg-white border-2 border-gray-200 hover:border-[#006CFF] transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {index < 3 && (
                                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                    </Badge>
                                  )}
                                  <span className="font-semibold text-gray-900">
                                    {region.region}
                                  </span>
                                </div>
                                <span className="text-lg font-bold text-gray-900">
                                  {formatNumber(region.votes)}
                                </span>
                              </div>
                              <Progress value={regionPercentage} className="h-2 mb-2" />
                              <p className="text-sm text-gray-600 text-right">
                                {regionPercentage.toFixed(1)}% nan {country.country}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <Globe className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">Pa gen done vòt ankò</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 text-center space-y-4">
          <p className="text-xl font-semibold text-gray-700">
            Ede {candidate.name} monte nan klasman an!
          </p>
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-[#006CFF] to-[#7F00FF] hover:opacity-90 text-white shadow-xl">
              <TrendingUp className="h-5 w-5 mr-2" />
              Vote Kounye a
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
