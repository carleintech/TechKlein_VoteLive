/**
 * Live Dashboard Page
 * Real-time voting statistics and results
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useVoteStats } from '@/hooks/use-vote-stats';
import { LiveChart } from '@/components/LiveChart';
import { LiveTicker } from '@/components/LiveTicker';
import { StatsCard } from '@/components/StatsCard';
import { CountryBreakdown } from '@/components/CountryBreakdown';
import { TopCandidates } from '@/components/TopCandidates';
import { LiveIndicator } from '@/components/LiveIndicator';
import { RefreshButton } from '@/components/RefreshButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Globe, Clock, Home, Vote } from 'lucide-react';

export default function LivePage() {
  const {
    aggregates,
    byCountry,
    totalVotes,
    timestamp,
    loading,
    error,
    refetch,
    isLive,
  } = useVoteStats(true);

  // Transform aggregates to candidate rankings
  const candidateRankings = React.useMemo(() => {
    return aggregates.map((agg) => ({
      id: agg.candidate_id,
      name: agg.candidate_name,
      photo_url: agg.photo_url,
      party: null,
      votes: agg.total_votes,
      percentage: agg.percentage,
    }));
  }, [aggregates]);

  // Transform by country data
  const countryBreakdown = React.useMemo(() => {
    const countryMap = new Map<string, { country: string; flag: string; totalVotes: number; candidates: any[] }>();
    
    byCountry.forEach((item) => {
      if (!countryMap.has(item.country)) {
        countryMap.set(item.country, {
          country: item.country,
          flag: '🌍',
          totalVotes: 0,
          candidates: [],
        });
      }
      
      const countryData = countryMap.get(item.country)!;
      countryData.totalVotes += item.total_votes;
      
      const candidateInAggregate = aggregates.find(a => a.candidate_name === item.candidate_name);
      countryData.candidates.push({
        id: candidateInAggregate?.candidate_id || 0,
        name: item.candidate_name,
        votes: item.total_votes,
        percentage: countryData.totalVotes > 0 ? (item.total_votes / countryData.totalVotes) * 100 : 0,
      });
    });

    return Array.from(countryMap.values());
  }, [byCountry, aggregates]);

  // Mock recent votes from aggregates (last 10)
  const recentVotes = React.useMemo(() => {
    return aggregates.slice(0, 10).map((agg) => ({
      id: `${agg.candidate_id}-${Date.now()}`,
      candidateName: agg.candidate_name,
      country: null,
      timestamp: timestamp,
    }));
  }, [aggregates, timestamp]);

  const stats = React.useMemo(() => ({
    totalVotes,
    activeCandidates: aggregates.length,
    countriesParticipating: new Set(byCountry.map(c => c.country)).size,
  }), [totalVotes, aggregates.length, byCountry]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Erè nan chajman done yo: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center">
            <img src="/haitivote-logo.svg" alt="HaitiVote" className="h-10" />
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/about">
              <Button variant="ghost" className="gap-2 text-gray-700 hover:text-[#006CFF]">
                <Home size={16} />
                <span className="hidden sm:inline">Sou Nou</span>
              </Button>
            </Link>
            <Link href="/vote">
              <Button className="gap-2 bg-gradient-to-r from-[#006CFF] to-[#7F00FF] hover:opacity-90 text-white">
                <Vote size={16} />
                Vote
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#006CFF] to-[#7F00FF] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <BarChart3 className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-semibold">Rezilta an Tan Reyèl</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Sondaj Ayiti Global 2025
              </h1>
              <p className="text-lg text-blue-100">
                Dashboard Live – Transparans Total
              </p>
            </div>
            <div className="flex items-center gap-4">
              <LiveIndicator isLive={isLive} />
              <RefreshButton onRefresh={refetch} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      {recentVotes.length > 0 && <LiveTicker items={recentVotes} />}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-[#006CFF]/50 transition-all p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006CFF] to-blue-600 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Vòt</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalVotes.toLocaleString() || '0'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-[#7F00FF]/50 transition-all p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7F00FF] to-purple-600 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Kandida Aktif</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.activeCandidates || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-green-500/50 transition-all p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Peyi</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.countriesParticipating || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-cyan-500/50 transition-all p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Dènye Mizajou</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {timestamp
                        ? new Date(timestamp).toLocaleTimeString('fr-HT', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '--:--'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Top 3 Podium */}
        {!loading && candidateRankings.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 2nd Place */}
            <div className="md:order-1 order-2">
              <div className="h-full flex flex-col justify-end">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-slate-400 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="text-6xl mb-3">🥈</div>
                  <p className="font-bold text-xl text-gray-900 mb-2">{candidateRankings[1].name}</p>
                  <p className="text-4xl font-bold text-slate-600 mt-3">
                    {candidateRankings[1].percentage.toFixed(1)}%
                  </p>
                  <p className="text-base text-gray-600 mt-2 font-medium">
                    {candidateRankings[1].votes.toLocaleString()} vòt
                  </p>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="md:order-2 order-1">
              <div className="h-full flex flex-col justify-end">
                <div className="bg-gradient-to-br from-yellow-100 to-amber-200 border-4 border-yellow-500 rounded-2xl p-8 text-center shadow-2xl transform md:scale-110 hover:scale-115 transition-all">
                  <div className="text-7xl mb-3 animate-bounce">🏆</div>
                  <p className="font-bold text-2xl text-gray-900 mb-2">{candidateRankings[0].name}</p>
                  <p className="text-5xl font-bold text-yellow-600 mt-3">
                    {candidateRankings[0].percentage.toFixed(1)}%
                  </p>
                  <p className="text-lg text-gray-700 mt-2 font-semibold">
                    {candidateRankings[0].votes.toLocaleString()} vòt
                  </p>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="md:order-3 order-3">
              <div className="h-full flex flex-col justify-end">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-amber-600 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="text-6xl mb-3">🥉</div>
                  <p className="font-bold text-xl text-gray-900 mb-2">{candidateRankings[2].name}</p>
                  <p className="text-4xl font-bold text-amber-700 mt-3">
                    {candidateRankings[2].percentage.toFixed(1)}%
                  </p>
                  <p className="text-base text-gray-600 mt-2 font-medium">
                    {candidateRankings[2].votes.toLocaleString()} vòt
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        {loading ? (
          <Skeleton className="h-[500px] rounded-xl" />
        ) : candidateRankings.length > 0 ? (
          <div className="bg-white rounded-xl shadow-xl border-2 border-gray-100 p-6">
            <LiveChart
              data={candidateRankings.map((c: any) => ({
                id: c.id,
                name: c.name,
                votes: c.votes,
                percentage: c.percentage,
              }))}
            />
          </div>
        ) : (
          <Alert className="border-2 border-[#006CFF]/30 bg-gradient-to-br from-blue-50 to-purple-50">
            <AlertDescription className="text-gray-700 text-center py-4 text-lg">
              Pa gen done pou afiche ankò
            </AlertDescription>
          </Alert>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Candidates */}
          {loading ? (
            <Skeleton className="h-96 rounded-xl" />
          ) : candidateRankings.length > 0 ? (
            <div className="bg-white rounded-xl shadow-xl border-2 border-gray-100 p-6">
              <TopCandidates candidates={candidateRankings} />
            </div>
          ) : null}

          {/* Country Breakdown */}
          {loading ? (
            <Skeleton className="h-96 rounded-xl" />
          ) : countryBreakdown.length > 0 ? (
            <div className="bg-white rounded-xl shadow-xl border-2 border-gray-100 p-6">
              <CountryBreakdown data={countryBreakdown} />
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white rounded-2xl mt-12 p-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="text-3xl">🇭🇹</div>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">HaitiVote</h3>
            </div>
            <p className="text-gray-400 italic">"Yon Pèp. Yon Vwa. Yon Sondaj."</p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} HaitiVote. Tout dwa rezève.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
