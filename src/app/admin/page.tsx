/**
 * Admin Dashboard
 * Comprehensive overview for administrators
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                TechKlein VoteLive Management
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshViews}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Stats
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                  <p className="text-3xl font-bold">{formatNumber(stats.summary.totalVotes)}</p>
                </div>
                <Vote className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unique Voters</p>
                  <p className="text-3xl font-bold">{formatNumber(stats.summary.totalVoters)}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Countries</p>
                  <p className="text-3xl font-bold">{stats.summary.uniqueCountries}</p>
                </div>
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Media Sources</p>
                  <p className="text-3xl font-bold">{stats.summary.mediaSources}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="fraud">
              <Shield className="h-4 w-4 mr-2" />
              Fraud Detection
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Votes per Hour */}
            <Card>
              <CardHeader>
                <CardTitle>Votes Per Hour (Last 24h)</CardTitle>
                <CardDescription>
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
            <Card>
              <CardHeader>
                <CardTitle>Recent Votes</CardTitle>
                <CardDescription>
                  Last 10 verified votes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.recentVotes.slice(0, 10).map((vote: any) => (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 text-sm"
                    >
                      <div className="flex-1 truncate">
                        <span className="font-semibold">
                          {vote.candidates?.name || 'Unknown'}
                        </span>
                        <span className="text-muted-foreground mx-2">·</span>
                        <span className="text-muted-foreground">
                          {vote.country || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
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
            <Card>
              <CardHeader>
                <CardTitle>Fraud Detection</CardTitle>
                <CardDescription>
                  Monitor suspicious activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Access the fraud detection dashboard to review flagged votes and suspicious patterns.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/fraud')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  View Fraud Dashboard
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Download vote data in CSV format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleExport}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download All Votes (CSV)
                </Button>

                <p className="text-sm text-muted-foreground">
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
