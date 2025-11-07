/**
 * Press & Media Kit Page
 * Resources for journalists and media outlets
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { MediaStats } from '@/components/MediaStats';
import {
  Download,
  Code,
  ExternalLink,
  Tv,
  BarChart3,
  ArrowLeft,
  Copy,
  Check,
  Share2,
} from 'lucide-react';

export default function PressPage() {
  const [copiedEmbed, setCopiedEmbed] = React.useState(false);

  // Always use production URL for press kit materials
  const siteUrl = 'https://www.haitivote.org';
  const embedCode = `<iframe src="${siteUrl}/embed" width="100%" height="700" frameborder="0" allowtransparency="true"></iframe>`;

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } catch (err) {
      console.error('Copy error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center">
                <img src="/haitivote-logo.svg" alt="HaitiVote" className="h-10" />
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#006CFF] transition-colors">
                  Sou Nou
                </Link>
                <Link href="/live" className="text-sm font-medium text-gray-700 hover:text-[#006CFF] transition-colors">
                  Rezilta Live
                </Link>
              </div>
            </div>
            <Link href="/vote">
              <Button className="bg-gradient-to-r from-[#006CFF] to-[#7F00FF] hover:opacity-90 text-white">
                Vote Kounye a
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#006CFF] to-[#7F00FF] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-semibold">Kit Medya</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              Resous pou Jounalis
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Tout zouti ou bezwen pou entegre HaitiVote nan platfòm ou
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="embed" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white border-2 border-gray-200 p-1 rounded-xl shadow-lg">
            <TabsTrigger value="embed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#006CFF] data-[state=active]:to-[#7F00FF] data-[state=active]:text-white rounded-lg">
              <Code className="h-4 w-4 mr-2" />
              Embed
            </TabsTrigger>
            <TabsTrigger value="overlay" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#006CFF] data-[state=active]:to-[#7F00FF] data-[state=active]:text-white rounded-lg">
              <Tv className="h-4 w-4 mr-2" />
              TV Overlay
            </TabsTrigger>
            <TabsTrigger value="qr" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#006CFF] data-[state=active]:to-[#7F00FF] data-[state=active]:text-white rounded-lg">
              <Share2 className="h-4 w-4 mr-2" />
              Kòd QR
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#006CFF] data-[state=active]:to-[#7F00FF] data-[state=active]:text-white rounded-lg">
              <BarChart3 className="h-4 w-4 mr-2" />
              Estatistik
            </TabsTrigger>
          </TabsList>

          {/* Embed Widget Tab */}
          <TabsContent value="embed" className="space-y-6">
            <Card className="border-2 border-gray-100 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-gray-100">
                <CardTitle className="text-2xl">Widget Embed pou Sit Wèb</CardTitle>
                <CardDescription className="text-base">
                  Entegre rezilta an tan reyèl nan atik ou yo
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Live Preview */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-900">Preview</h3>
                  <div className="border-4 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src="/embed"
                      width="100%"
                      height="700"
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator />

                {/* Embed Code */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Kòd HTML</h3>
                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-gray-900 overflow-x-auto text-sm text-green-400 border-2 border-gray-700">
                      <code>{embedCode}</code>
                    </pre>
                    <Button
                      size="sm"
                      className="absolute top-3 right-3 bg-white text-gray-900 hover:bg-gray-100"
                      onClick={handleCopyEmbed}
                    >
                      {copiedEmbed ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-600" />
                          Kopye!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Kopye
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Instructions */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Enstriksyon</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Kopye kòd HTML ki anlè a</li>
                    <li>Kole l nan atik ou oswa nan HTML paj ou a</li>
                    <li>Widget ap afiche rezilta an tan reyèl otomatikman</li>
                    <li>Ou ka ajiste <code className="bg-muted px-1 rounded">width</code> ak <code className="bg-muted px-1 rounded">height</code></li>
                  </ol>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 space-y-2">
                    <h4 className="font-bold text-base flex items-center gap-2 text-gray-900">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                      Mizajou Otomatik
                    </h4>
                    <p className="text-sm text-gray-700">
                      Rezilta mizajou an tan reyèl san bezwen refresh
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 space-y-2">
                    <h4 className="font-bold text-base flex items-center gap-2 text-gray-900">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">✓</div>
                      Responsif
                    </h4>
                    <p className="text-sm text-gray-700">
                      Travay sou tout aparèy (desktop, tablet, mobil)
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 space-y-2">
                    <h4 className="font-bold text-base flex items-center gap-2 text-gray-900">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">✓</div>
                      Rapid
                    </h4>
                    <p className="text-sm text-gray-700">
                      Optimize pou vitès maksimòm
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 space-y-2">
                    <h4 className="font-bold text-base flex items-center gap-2 text-gray-900">
                      <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs">✓</div>
                      Gratis
                    </h4>
                    <p className="text-sm text-gray-700">
                      100% gratis pou tout medya
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TV Overlay Tab */}
          <TabsContent value="overlay" className="space-y-6">
            <Card className="border-2 border-gray-100 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-gray-100">
                <CardTitle className="text-2xl">Overlay pou TV & Live Streaming</CardTitle>
                <CardDescription className="text-base">
                  Transparan pou OBS, vMix, Streamlabs
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Layout Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link href="/overlay?layout=full" target="_blank">
                    <Card className="cursor-pointer hover:border-[#006CFF] transition-all hover:shadow-xl hover:-translate-y-1 border-2">
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center shadow-inner">
                          <div className="text-5xl">📊</div>
                        </div>
                        <h4 className="font-bold text-lg text-gray-900">Full Screen</h4>
                        <p className="text-sm text-gray-600">
                          Pou ekran konplè
                        </p>
                        <Badge className="bg-[#006CFF] text-white">1920x1080</Badge>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/overlay?layout=sidebar" target="_blank">
                    <Card className="cursor-pointer hover:border-[#7F00FF] transition-all hover:shadow-xl hover:-translate-y-1 border-2">
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-end pr-6 shadow-inner">
                          <div className="w-28 h-full bg-purple-300 rounded-lg opacity-50" />
                        </div>
                        <h4 className="font-bold text-lg text-gray-900">Sidebar</h4>
                        <p className="text-sm text-gray-600">
                          Bò dwat ekran
                        </p>
                        <Badge className="bg-[#7F00FF] text-white">Responsive</Badge>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/overlay?layout=lower-third" target="_blank">
                    <Card className="cursor-pointer hover:border-green-500 transition-all hover:shadow-xl hover:-translate-y-1 border-2">
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="w-full h-40 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-end pb-3 shadow-inner">
                          <div className="w-full h-10 bg-green-400 rounded-lg opacity-50" />
                        </div>
                        <h4 className="font-bold text-lg text-gray-900">Lower Third</h4>
                        <p className="text-sm text-gray-600">
                          Anba ekran
                        </p>
                        <Badge className="bg-green-600 text-white">1920x200</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                </div>

                <Separator />

                {/* OBS Instructions */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Kijan pou itilize nan OBS</h3>
                  
                  <ol className="list-decimal list-inside space-y-3 text-sm">
                    <li className="space-y-2">
                      <span className="font-medium">Ouvri OBS Studio</span>
                      <p className="pl-6 text-muted-foreground">
                        Chwazi senyen yo ou vle ajoute overlay a
                      </p>
                    </li>

                    <li className="space-y-2">
                      <span className="font-medium">Ajoute Browser Source</span>
                      <p className="pl-6 text-muted-foreground">
                        Sources → + → Browser
                      </p>
                    </li>

                    <li className="space-y-2">
                      <span className="font-medium">Konfigire URL</span>
                      <div className="pl-6 space-y-2">
                        <p className="text-muted-foreground">Kole youn nan URL sa yo:</p>
                        <div className="space-y-1">
                          <code className="block p-2 bg-muted rounded text-xs">
                            {siteUrl}/overlay?layout=full
                          </code>
                          <code className="block p-2 bg-muted rounded text-xs">
                            {siteUrl}/overlay?layout=sidebar
                          </code>
                          <code className="block p-2 bg-muted rounded text-xs">
                            {siteUrl}/overlay?layout=lower-third
                          </code>
                        </div>
                      </div>
                    </li>

                    <li className="space-y-2">
                      <span className="font-medium">Ajiste paramèt</span>
                      <div className="pl-6 space-y-1 text-muted-foreground">
                        <p>• Width: 1920</p>
                        <p>• Height: 1080</p>
                        <p>• ✓ Shutdown source when not visible</p>
                        <p>• ✓ Refresh browser when scene becomes active</p>
                      </div>
                    </li>

                    <li className="space-y-2">
                      <span className="font-medium">Fini!</span>
                      <p className="pl-6 text-muted-foreground">
                        Overlay ap mizajou otomatikman
                      </p>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="space-y-6">
            <QRCodeGenerator baseUrl={siteUrl} />

            <Card>
              <CardHeader>
                <CardTitle>Egzanp Itilizasyon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <h4 className="font-semibold text-sm">📺 Televizyon</h4>
                    <p className="text-xs text-muted-foreground">
                      Afiche kòd QR pandan emisyon pou moun vote
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <h4 className="font-semibold text-sm">📻 Radyo</h4>
                    <p className="text-xs text-muted-foreground">
                      Pataje lyen sou paj Facebook oswa Instagram ou
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <h4 className="font-semibold text-sm">🎥 YouTube</h4>
                    <p className="text-xs text-muted-foreground">
                      Mete kòd QR nan kwen videyo ou
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <h4 className="font-semibold text-sm">📱 WhatsApp</h4>
                    <p className="text-xs text-muted-foreground">
                      Voye nan group WhatsApp ak kominote yo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-6">
            <MediaStats />

            <Card>
              <CardHeader>
                <CardTitle>Lyen Itil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/live">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Rezilta an Tan Reyèl
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    asChild
                  >
                    <a href="/api/admin/export" target="_blank">
                      <span className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Telechaje CSV
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
