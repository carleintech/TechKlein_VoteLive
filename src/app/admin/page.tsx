/**
 * Admin Dashboard
 * Comprehensive overview for administrators
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Vote,
  Globe,
  TrendingUp,
  Download,
  Shield,
  BarChart3,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      
      if (response.status === 401 || response.status === 403) {
        // Not authenticated, redirect to login
        router.push('/admin/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Stats fetch error:', error);
      // On error, also try redirecting to login
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleExport = () => {
    window.open('/api/admin/export', '_blank');
  };

  const handleRefreshViews = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/admin/refresh-views', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh views');
      }

      await fetchStats();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-lg font-semibold text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="border-b-2 border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="cursor-pointer hover:opacity-80 transition-opacity">
                <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-blue-100 mt-2 text-lg font-medium">
                  HaitiVote Management Console
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleRefreshViews}
                disabled={refreshing}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="font-semibold">Refresh Stats</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleLogout}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span className="font-semibold">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Votes</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">{formatNumber(stats.summary.totalVotes)}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <Vote className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Unique Voters</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">{formatNumber(stats.summary.totalVoters)}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Countries</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">{stats.summary.uniqueCountries}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <Globe className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Media Sources</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">{stats.summary.mediaSources}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 p-1.5 h-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold px-6 py-3">
              <BarChart3 className="h-5 w-5 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="fraud" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold px-6 py-3">
              <Shield className="h-5 w-5 mr-2" />
              Fraud Detection
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-semibold px-6 py-3">
              <Download className="h-5 w-5 mr-2" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Votes per Hour */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Votes Per Hour (Last 24h)</CardTitle>
                <CardDescription className="text-base font-medium">
                  Hourly voting activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {Object.entries(stats.votesPerHour || {}).map(([hour, count]) => (
                    <div key={hour} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-mono">{hour}</span>
                      <span className="font-semibold">{formatNumber(count as number)} votes</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Votes */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Recent Votes</CardTitle>
                <CardDescription className="text-base font-medium">
                  Last 10 verified votes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {stats.recentVotes.slice(0, 10).map((vote: any) => (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between p-3 rounded-lg border-2 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                    >
                      <div className="flex-1 truncate">
                        <span className="font-bold text-gray-900">
                          {vote.candidates?.name || 'Unknown'}
                        </span>
                        <span className="text-gray-400 mx-2">·</span>
                        <span className="text-gray-600 font-medium">
                          {vote.country || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        {new Date(vote.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fraud Detection Tab */}
          <TabsContent value="fraud" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Fraud Detection</CardTitle>
                <CardDescription className="text-base font-medium">
                  Monitor suspicious activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <p className="text-base text-gray-700 font-medium">
                  Access the fraud detection dashboard to review flagged votes and suspicious patterns.
                </p>
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => router.push('/admin/fraud')}
                  className="shadow-lg"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  View Fraud Dashboard
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Export Data</CardTitle>
                <CardDescription className="text-base font-medium">
                  Download vote data in CSV format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleExport}
                  className="shadow-lg h-14 text-lg"
                >
                  <Download className="h-6 w-6 mr-3" />
                  Download All Votes (CSV)
                </Button>

                <p className="text-base text-gray-700 font-medium">
                  The export includes: Vote ID, Timestamp, Candidate, Country, Region, IP Address, Status
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
