/**
 * Press Release Page
 * Media-ready press release for VoteLive platform launch
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, FileText, Globe, Shield, BarChart3, 
  Users, Smartphone, TrendingUp, Radio, Share2,
  Database, Lock, Zap, MessageSquare, Eye, Download
} from 'lucide-react';

export default function PressReleasePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-700 hover:text-[#006CFF] transition-colors font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              Retounen
            </Link>
            
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#006CFF]" />
              <h1 className="text-xl font-bold text-gray-900">
                Press Release
              </h1>
            </div>
            
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          {/* Press Header */}
          <div className="border-b-2 border-gray-200 pb-6 mb-8">
            <div className="text-sm text-gray-500 uppercase font-semibold mb-4">
              📰 FOR IMMEDIATE RELEASE
            </div>
            <div className="text-sm text-gray-600">
              <strong>Contact:</strong><br />
              TechKlein Media Relations<br />
              press@techklein.com<br />
              +509 xxxx xxxx
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            TechKlein Launches VoteLive: Revolutionary Digital Polling Platform for Haiti's 2025-2026 Presidential Election
          </h1>

          <h2 className="text-2xl font-semibold text-blue-600 mb-8">
            Platform Enables Haitians Worldwide to Participate in Transparent, Real-Time Election Opinion Poll
          </h2>

          {/* Dateline */}
          <p className="text-gray-600 font-semibold mb-6">
            <strong>Port-au-Prince, Haiti – November 2025</strong> – TechKlein, a leading technology innovation company, today announced the launch of <strong>VoteLive – Sondaj Ayiti Global</strong>, a groundbreaking digital polling platform that allows Haitians around the world to participate in a transparent, secure, and real-time opinion poll for the upcoming 2025-2026 presidential election.
          </p>

          {/* Main Content */}
          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Empowering Global Haitian Voice
              </h3>
              <p className="text-gray-700">
                VoteLive represents a major technological advancement in democratic participation, offering every Haitian—whether in Port-au-Prince, Miami, Montreal, or Paris—the ability to express their electoral preference through a secure, user-friendly mobile and web platform.
              </p>
              <div className="my-6 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
                <p className="text-gray-800 italic">
                  "For the first time, the Haitian diaspora can participate meaningfully in the democratic process alongside citizens at home. VoteLive isn't just a polling platform—it's a tool for unity, transparency, and civic engagement in a critical moment for Haiti's future."
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  – Founder, TechKlein
                </p>
              </div>
            </section>

            {/* Key Features Grid */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Key Features
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 not-prose">
                <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-8 w-8 text-red-600" />
                    <h4 className="text-xl font-bold text-gray-900">Security First</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Phone number verification (OTP)</li>
                    <li>✓ One vote per person enforcement</li>
                    <li>✓ Advanced fraud detection</li>
                    <li>✓ Encrypted data protection</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="h-8 w-8 text-blue-600" />
                    <h4 className="text-xl font-bold text-gray-900">Global Reach</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ 4 languages (Creole, French, English, Spanish)</li>
                    <li>✓ Accessible from 190+ countries</li>
                    <li>✓ Mobile-optimized for all devices</li>
                    <li>✓ Works on low-bandwidth connections</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                    <h4 className="text-xl font-bold text-gray-900">Real-Time Transparency</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Live vote counting</li>
                    <li>✓ Geographic breakdown by country</li>
                    <li>✓ Interactive dashboards and maps</li>
                    <li>✓ Media-friendly embeds</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                    <h4 className="text-xl font-bold text-gray-900">47 Official Candidates</h4>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Complete candidate profiles</li>
                    <li>✓ Party affiliations</li>
                    <li>✓ High-quality photos</li>
                    <li>✓ Biographical information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Technology Infrastructure */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Technology Infrastructure
              </h3>
              <p className="text-gray-700 mb-4">
                VoteLive is built on enterprise-grade infrastructure:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <Database className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Supabase</strong> for real-time database</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Vercel Edge Network</strong> for global performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Resend</strong> for email verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>Advanced encryption</strong> for data security</span>
                </li>
                <li className="flex items-start gap-2">
                  <Smartphone className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span><strong>PWA technology</strong> for offline capability</span>
                </li>
              </ul>
              <p className="text-gray-600 mt-4 italic">
                The platform can handle millions of concurrent votes while maintaining sub-500ms response times.
              </p>
            </section>

            {/* Addressing Critical Need */}
            <section className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Addressing Critical Need
              </h3>
              <p className="text-gray-700 mb-4">
                Haiti's 2025-2026 election comes at a pivotal moment. With nearly a decade since the last national elections and a significant diaspora population, VoteLive provides:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Transparency</h4>
                  <p className="text-gray-600 text-sm">In a climate of institutional uncertainty</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Engagement</h4>
                  <p className="text-gray-600 text-sm">For millions of Haitians abroad</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Data</h4>
                  <p className="text-gray-600 text-sm">For journalists, researchers, and analysts</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-2">Voice</h4>
                  <p className="text-gray-600 text-sm">For all Haitians regardless of location</p>
                </div>
              </div>
            </section>

            {/* Media Partnership */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Radio className="h-8 w-8" />
                Media Partnership Opportunities
              </h3>
              <p className="mb-4">
                TechKlein is offering media organizations:
              </p>
              <ul className="space-y-2">
                <li>✓ Free embed widgets for real-time results</li>
                <li>✓ TV-ready overlay graphics</li>
                <li>✓ API access for custom integrations</li>
                <li>✓ Dedicated media dashboard</li>
                <li>✓ Export capabilities for analysis</li>
                <li>✓ Custom press kit with graphics</li>
              </ul>
              <p className="mt-4 font-semibold">
                Contact: <a href="mailto:press@techklein.com" className="underline">press@techklein.com</a> for partnership details
              </p>
            </section>

            {/* Available Now */}
            <section className="text-center py-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Available Now
              </h3>
              <p className="text-xl text-gray-700 mb-6">
                VoteLive is live at{' '}
                <a href="https://www.haitivote.org" className="text-blue-600 hover:underline font-bold">
                  https://www.haitivote.org
                </a>
              </p>
              <p className="text-gray-600">
                The platform is free to use and requires only a phone number for verification. No account creation or personal information beyond basic demographics is required.
              </p>
            </section>

            {/* FAQ Section */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Q: Is this an official election?</h4>
                  <p className="text-gray-700">A: No, VoteLive is an opinion poll/survey. It does not replace official elections conducted by Haiti's electoral authorities.</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Q: Who can vote?</h4>
                  <p className="text-gray-700">A: Any Haitian with a valid phone number, regardless of location.</p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Q: How is fraud prevented?</h4>
                  <p className="text-gray-700">A: Multiple measures including phone verification, IP tracking, duplicate detection, and advanced fraud scoring algorithms.</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Q: Is my vote anonymous?</h4>
                  <p className="text-gray-700">A: Yes, candidate choice is not linked to personal information.</p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-bold text-gray-900 mb-2">Q: How much does it cost?</h4>
                  <p className="text-gray-700">A: VoteLive is 100% free for all users.</p>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                About TechKlein
              </h3>
              <p className="text-gray-700">
                TechKlein is a technology company dedicated to building digital solutions for civic engagement, transparency, and democratic participation. Specializing in secure, scalable platforms for public participation, TechKlein leverages cutting-edge technology to empower communities and strengthen democratic processes.
              </p>
              <p className="text-gray-600 mt-4">
                For more information, visit: <a href="https://techklein.com" className="text-blue-600 hover:underline">https://techklein.com</a>
              </p>
            </section>

            {/* Social Media */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Share2 className="h-7 w-7 text-blue-600" />
                Social Media
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Follow for updates:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>Twitter: @TechKleinHT</li>
                    <li>Facebook: @TechKleinHaiti</li>
                    <li>Instagram: @techkleinhaiti</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Hashtags:</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">#HaitiVote</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">#VoteLive2026</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">#SondajAyiti</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Media Kit Available:</h4>
                <a href="https://www.haitivote.org/press" className="text-blue-600 hover:underline">
                  https://www.haitivote.org/press
                </a>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Live Platform:</h4>
                <a href="https://www.haitivote.org" className="text-blue-600 hover:underline">
                  https://www.haitivote.org
                </a>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Demo Access:</h4>
                <a href="mailto:press@techklein.com" className="text-blue-600 hover:underline">
                  press@techklein.com
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2025 TechKlein. All rights reserved. | For media inquiries: press@techklein.com
          </p>
          <p className="text-gray-500 text-sm mt-2">
            <em>Ce communiqué est disponible en français. This press release is available in English. Este comunicado de prensa está disponible en español.</em>
          </p>
        </div>
      </footer>
    </div>
  );
}
