/**
 * About Page - HaitiVote Mission & Vision
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Globe, 
  Shield, 
  Users, 
  Target, 
  Eye, 
  CheckCircle2,
  Heart,
  Megaphone,
  BarChart3
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Navigation */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/haitivote-logo.svg" alt="HaitiVote" className="h-10" />
            </Link>
            <div className="flex gap-3">
              <Link href="/vote">
                <Button className="bg-[#006CFF] hover:bg-[#0052CC] text-white">
                  Vote Kounye a
                </Button>
              </Link>
              <Link href="/live">
                <Button variant="outline" className="border-[#7F00FF] text-[#7F00FF] hover:bg-[#7F00FF] hover:text-white">
                  Rezilta Live
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#006CFF] to-[#7F00FF] text-white py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <div className="text-6xl mb-4">🇭🇹</div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Sou HaitiVote
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-blue-100">
              "Yon Pèp. Yon Vwa. Yon Sondaj."
            </p>
            <p className="text-lg md:text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed">
              Yon platfòm dijital mondyal ki kreye pou ini vwa Ayisyen nan lemonn antye.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* What is HaitiVote */}
        <section className="mb-20">
          <Card className="p-8 md:p-12 shadow-xl border-t-4 border-t-[#006CFF]">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl leading-relaxed text-gray-700">
                HaitiVote se yon platfòm dijital mondyal ki kreye pou ini vwa Ayisyen nan lemonn antye. Kèlkeswa yon Ayisyen ap viv nan Pòtoprens, Okap, Miami, Boston, Montreal, Santiago, Pari, oswa Repiblik Dominikèn, <strong className="text-[#006CFF]">HaitiVote bay chak sitwayen yon fason senp, sekirize pou yo patisipe nan yon sondaj nasyonal</strong> epi wè rezilta an tan reyèl.
              </p>
              <p className="text-xl leading-relaxed text-gray-700 mt-6">
                Nan kè li, HaitiVote egziste pou <strong className="text-[#7F00FF]">restore konfyans, ogmante patisipasyon sivik, epi bay nasyon an yon vizyon klè sou opinyon kolektif li</strong>. Bati ak teknoloji modèn, kouch verifikasyon solid, ak yon angajman pou transparans, HaitiVote konstwi pou li ka <strong>endepandan, nèt, epi lib de enfliyan politik</strong>.
              </p>
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-[#006CFF]">
                <p className="text-xl font-semibold text-gray-800 mb-2">Sa a pa yon eleksyon.</p>
                <p className="text-xl text-gray-700">Se yon <strong className="text-[#7F00FF]">anplifikatè vwa pou pèp Ayisyen an</strong>.</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Our Story */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#006CFF] to-[#7F00FF] text-white mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Istwa Nou</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#006CFF] to-[#7F00FF] mx-auto rounded-full"></div>
          </div>
          
          <Card className="p-8 md:p-12 shadow-xl">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700">
                Pandan deseni lane, vwa Ayisyen yo—espesyalman sa yo ki nan dyaspora a—te divize atravè distans, dezenfòmasyon, ak bri politik. HaitiVote te fèt nan yon lide senp:
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border-2 border-[#006CFF]/20">
                <h3 className="text-2xl font-bold text-[#006CFF] mb-4">
                  E si chak Ayisyen, nenpòt kote, te kapab pale ansanm nan yon sèl kote?
                </h3>
                <div className="space-y-3 text-lg text-gray-700">
                  <p>E si yon etidyan nan Hinche, yon manman nan Gonayiv, yon travayè nan Santiago, ak yon biznisman nan Fort Lauderdale te ka tout vote nan menm sondaj la, an sekirite epi imedyatman?</p>
                  <p>E si jounalis yo te gen done reyèl, an tan reyèl, transparent pou enfòme popilasyon an?</p>
                  <p>E si Ayiti, pou premye fwa, te gen yon <strong className="text-[#7F00FF]">konvèsasyon nasyonal mondyal</strong>—vizib pou tout moun?</p>
                </div>
              </div>

              <p className="text-xl font-semibold text-center text-[#006CFF] pt-4">
                HaitiVote se repons a kesyon sa yo.
              </p>
            </div>
          </Card>
        </section>

        {/* Mission & Vision - Side by Side */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="p-8 shadow-xl border-t-4 border-t-[#006CFF] hover:shadow-2xl transition-shadow">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#006CFF] text-white mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Misyon Nou</h2>
              </div>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Ini Ayisyen nan lemonn antye atravè yon platfòm dijital transparent, sekirize, ak aksesib ki mezire santiman nasyonal epi ranfòse patisipasyon sivik.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#006CFF] flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Transparans</strong>
                    <p className="text-gray-600">Tout done vizib, an tan reyèl, pa ka chanje</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#006CFF] flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Enklizyon</strong>
                    <p className="text-gray-600">Ayisyen nan tout kwen mond la ka patisipe</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#006CFF] flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Sekirite</strong>
                    <p className="text-gray-600">Verifikasyon idantite anpeche doub ak asire jistis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#006CFF] flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-gray-900">Nètralite</strong>
                    <p className="text-gray-600">HaitiVote pa sipòte okenn pati, okenn kandida, okenn gwoup</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Vision */}
            <Card className="p-8 shadow-xl border-t-4 border-t-[#7F00FF] hover:shadow-2xl transition-shadow">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#7F00FF] text-white mb-4">
                  <Eye className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Vizyon Nou</h2>
              </div>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Vin platfòm sivik dijital ki pi gen konfyans pou Ayisyen tout kote. Yon platfòm ki elve opinyon piblik nan nivo li merite.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#7F00FF] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700">Patisipasyon dijital aksesib pou tout moun</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#7F00FF] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700">Vwa dyaspora a finalman konte</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#7F00FF] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700">Konfyans nan pwosesis sivik yo grandi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#7F00FF] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700">Desizyon gide pa done, pa spekilasyon</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-[#7F00FF] flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700">Pèp la santi li konekte ak nasyon li, kèlkeswa kote li ye</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* How HaitiVote Works */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#006CFF] to-[#7F00FF] text-white mb-4">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kijan HaitiVote Fonksyone</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#006CFF] to-[#7F00FF] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: '1', title: 'Antre enfòmasyon ou', desc: 'Non, dat nesans, peyi ak vil rezidans', icon: '📝' },
              { step: '2', title: 'Verifye nimewo telefòn ou', desc: 'Ou resevwa yon mesaj tèks (OTP)', icon: '📱' },
              { step: '3', title: 'Chwazi kandida ou prefere', desc: 'Chak kandida gen foto, non, ak kat klè', icon: '✅' },
              { step: '4', title: 'Soumèt vot ou', desc: 'Vot ou anrejistre, kripte, epi konte imedyatman', icon: '🗳️' },
              { step: '5', title: 'Wè rezilta live', desc: 'Dashboard la aktyalize an tan reyèl', icon: '📊' },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#006CFF] to-[#7F00FF] text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center space-y-2">
            <p className="text-xl font-semibold text-gray-800">Pa gen doub. Pa gen bot. Pa gen manipilasyon.</p>
            <p className="text-2xl font-bold text-[#006CFF]">Yon Ayisyen = Yon Vwa.</p>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#006CFF] to-[#7F00FF] text-white mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kilès HaitiVote Sèvi</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#006CFF] to-[#7F00FF] mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏠', title: 'Ayisyen nan Ayiti', desc: 'Soti nan zòn riral rive nan gwo vil yo', color: 'from-blue-500 to-blue-600' },
              { icon: '✈️', title: 'Dyaspora Ayisyen', desc: 'Nan Amerik, Ewòp, ak Karayib', color: 'from-purple-500 to-purple-600' },
              { icon: '📺', title: 'Medya & Jounalis', desc: 'Televizyon, radyo, YouTuber, ak jounal online', color: 'from-indigo-500 to-indigo-600' },
              { icon: '🎓', title: 'Òganizasyon & Inivèsite', desc: 'Gwoup sivik, chèchè, ak obsèvatè entènasyonal', color: 'from-cyan-500 to-cyan-600' },
              { icon: '👶', title: 'Jenerasyon Demen', desc: 'Jèn Ayisyen k ap aprann enpòtans patisipasyon sivik', color: 'from-teal-500 to-teal-600' },
              { icon: '🌍', title: 'Tout Moun', desc: 'Nenpòt moun ki vle wè vwa pèp Ayisyen an', color: 'from-green-500 to-green-600' },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-[#006CFF]">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Why HaitiVote Matters */}
        <section className="mb-20">
          <Card className="p-8 md:p-12 shadow-xl bg-gradient-to-br from-[#006CFF] to-[#7F00FF] text-white">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <Megaphone className="h-8 w-8" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Poukisa HaitiVote Enpòtan</h2>
              <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
            </div>

            <div className="max-w-3xl mx-auto space-y-4 text-lg text-center">
              <p className="text-xl font-semibold">HaitiVote se plis pase yon sondaj.</p>
              <div className="space-y-3 pt-4">
                <p>✅ Yon pon ant Ayisyen nan Ayiti ak Ayisyen aletranje</p>
                <p>✅ Yon zouti pou transparans</p>
                <p>✅ Yon fason pou diminye dezenfòmasyon</p>
                <p>✅ Yon sous ki gen konfyans pou jounalis yo</p>
                <p>✅ Yon solisyon modèn pou yon jenerasyon dijital</p>
              </div>
              <div className="pt-6">
                <p className="text-2xl font-bold">Pi enpòtan, se yon rapèl ke <span className="underline">Ayiti toujou gen yon vwa pwisan</span> — vwa pèp li a.</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Final Message */}
        <section className="mb-12">
          <Card className="p-8 md:p-16 shadow-2xl border-t-4 border-t-[#7F00FF] bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="text-5xl mb-4">❤️</div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Yon Mesaj Pou Chak Ayisyen</h2>
              
              <div className="space-y-4 text-xl text-gray-700 leading-relaxed">
                <p>Kèlkeswa kote w ap viv…</p>
                <p>Kèlkeswa orijin ou…</p>
                <p>Kèlkeswa sitiyasyon ou…</p>
              </div>

              <div className="py-8">
                <p className="text-3xl font-bold text-[#006CFF] mb-4">Vwa ou toujou enpòtan.</p>
                <p className="text-xl text-gray-700">HaitiVote kreye pou bay li yon kote pou li tande — ak diyite, transparans, ak inite.</p>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-3xl font-bold bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">
                  Yon Pèp. Yon Vwa. Yon Sondaj.
                </p>
                <p className="text-xl text-[#7F00FF] font-semibold">Sa se lavni patisipasyon Ayisyen.</p>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/vote">
                  <Button size="lg" className="bg-[#006CFF] hover:bg-[#0052CC] text-white text-lg px-8 py-6">
                    Vote Kounye a 🗳️
                  </Button>
                </Link>
                <Link href="/live">
                  <Button size="lg" variant="outline" className="border-2 border-[#7F00FF] text-[#7F00FF] hover:bg-[#7F00FF] hover:text-white text-lg px-8 py-6">
                    Wè Rezilta Live 📊
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 HaitiVote. Tout dwa rezève.</p>
          <p className="text-sm text-gray-500 mt-2">Yon Pèp. Yon Vwa. Yon Sondaj.</p>
        </div>
      </footer>
    </div>
  );
}
