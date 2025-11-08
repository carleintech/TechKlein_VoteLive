/**
 * How to Vote Page - Complete voting guide
 * Kijan pou Vote - Gid konplè pou vote
 */

import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Phone, User, Calendar, MapPin, MessageSquare, Trophy, AlertCircle, Clock, Share2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kijan pou Vote | HaitiVote',
  description: 'Gid konplè etap pa etap pou vote nan platfòm HaitiVote',
  openGraph: {
    title: 'Kijan pou Vote | HaitiVote',
    description: 'Aprann kijan pou vote fasil epi rapid',
  },
};

export default function HowToVotePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-700 hover:text-[#006CFF] transition-colors font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              Retounen
            </Link>
            
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-[#006CFF]" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#006CFF] to-[#7F00FF] bg-clip-text text-transparent">
                Kijan pou Vote
              </h1>
            </div>
            
            <Link 
              href="/vote" 
              className="px-4 py-2 bg-gradient-to-r from-[#006CFF] to-[#7F00FF] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Vote Kounye a
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-5xl font-bold">
            Aprann Kijan pou Vote 🇭🇹
          </h2>
          <p className="text-2xl text-blue-100">
            Gid senp etap pa etap pou vote nan HaitiVote
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Clock className="h-5 w-5" />
              <span>2 minit sèlman</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <CheckCircle className="h-5 w-5" />
              <span>100% gratis</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Trophy className="h-5 w-5" />
              <span>Rezilta imedya</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Chwazi Kandida W</h3>
                  <p className="text-blue-100 text-lg mt-1">Premye etap: Deside pou ki kandida w ap vote</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Ale sou</p>
                    <a href="https://www.haitivote.org" className="text-blue-600 hover:text-blue-700 font-semibold text-xl">
                      https://www.haitivote.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Gade 47 kandida ofisyèl yo</p>
                    <p className="text-gray-600">Tout kandida afiche ak foto yo sou paj prensipal la</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Itilize ba rechèch la</p>
                    <p className="text-gray-600">Si w ap chèche yon non espesifik, tape l nan ba rechèch</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Klike sou foto kandida a</p>
                    <p className="text-gray-600">Kat la ap vin ble - sa vle di li seleksyone</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-blue-900 text-lg">💡 Konsèy:</p>
                    <p className="text-blue-800">Klike sou "Bio" pou wè plis enfòmasyon sou kandida a anvan w vote</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-purple-600">2</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Ranpli Enfòmasyon W</h3>
                  <p className="text-purple-100 text-lg mt-1">Dezyèm etap: Bay enfòmasyon debaz ou</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <p className="text-lg text-gray-700">Apre w chwazi kandida, w ap wè yon fòm. Ranpli:</p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <User className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Non Konplè</p>
                    <p className="text-gray-600">Jan yo rele w (prenon ak non fanmi)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Dat Nesans</p>
                    <p className="text-gray-600">Mwa/Jou/Ane (Egzanp: 01/15/1990)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Peyi & Vil/Rejyon</p>
                    <p className="text-gray-600">Kote w ap viv kounye a (peyi ak vil oswa eta)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <Phone className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Adrès Email</p>
                    <p className="text-gray-600">Ak kòd peyi (Egzanp: +509 1234 5678)</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-green-900 text-lg">📝 Enpòtan:</p>
                    <p className="text-green-800">Enfòmasyon sa yo prive epi yo itilize sèlman pou anpeche moun vote 2 fwa. Nou pa pataje yo ak pèsonn.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-green-600">3</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Verifikasyon Email</h3>
                  <p className="text-green-100 text-lg mt-1">Twazyèm etap: Konfime adrès email ou</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MessageSquare className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Resevwa Email</p>
                    <p className="text-gray-600">Yon kòd 6 chif ap voyé ba w nan adrès email ou te bay la</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <User className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Antre Kòd</p>
                    <p className="text-gray-600">Tape kòd 6 chif la nan bwat ki parèt</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Kòd pa rive?</p>
                    <p className="text-gray-600">Klike "Revoye kòd" pou resevwa yon nouvo kòd</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-yellow-900 text-lg">⏰ Tan Limit:</p>
                    <p className="text-yellow-800">Kòd la bon pou 5 minit sèlman. Si l pase, mande yon nouvo kòd.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-yellow-600">4</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Siksè! 🎉</h3>
                  <p className="text-yellow-100 text-lg mt-1">Katriyèm etap: Vòt ou konte!</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <p className="text-lg text-gray-700 font-semibold">Felisitasyon! Vòt ou konte. W ap wè:</p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                  <p className="text-lg text-gray-900">Mesaj konfirmasyon</p>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <Trophy className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  <p className="text-lg text-gray-900">Kat vòt patajab ou</p>
                </div>

                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <Share2 className="h-8 w-8 text-purple-600 flex-shrink-0" />
                  <p className="text-lg text-gray-900">Lyen pou gade rezilta an tan reyèl</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-center text-white">
            <h3 className="text-4xl font-bold mb-4">
              Pare pou Vote? 🗳️
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Vwa w enpòtan! Pran 2 minit pou patisipe nan sondaj la kounye a.
            </p>
            <Link 
              href="/vote" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-xl hover:bg-blue-50 transition-colors shadow-xl"
            >
              <CheckCircle className="h-6 w-6" />
              Kòmanse Vote Kounye a
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Kesyon Souvan Poze</h3>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Èske vote a gratis?</h4>
                <p className="text-gray-700">Wi, 100% gratis! Ou pa bezwen peye anyen pou vote.</p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Èske m ka vote plizyè fwa?</h4>
                <p className="text-gray-700">Non, chak email ka vote 1 sèl fwa pou garanti jestikal.</p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Èske enfòmasyon mwen an sekirite?</h4>
                <p className="text-gray-700">Wi, tout enfòmasyon yo kripte epi prive. Nou pa pataje yo ak pèsonn.</p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Mwen pa resevwa kòd verifikasyon an?</h4>
                <p className="text-gray-700">
                  <strong>Verifye dosye spam/junk ou</strong>. Kòd la ka rive la. Verifye tou ke adrès email ou kòrèk.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  <strong>Check your spam/junk folder</strong>. The code might be there. Also verify that your email address is correct.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Ki peyi ki ka vote?</h4>
                <p className="text-gray-700">Nenpòt moun, nenpòt kote nan mond lan ka vote - Ayiti, Etazini, Kanada, Lafrans, etc.</p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Kilè rezilta yo disponib?</h4>
                <p className="text-gray-700">Rezilta yo afiche an tan reyèl, imedyatman apre w fin vote.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-center md:text-left">
              © 2025 HaitiVote by <span className="font-semibold text-[#006CFF]">TechKlein</span>. Tout dwa rezève.
            </p>
            <div className="flex gap-6">
              <Link href="/about" className="text-gray-600 hover:text-[#006CFF] transition-colors">
                Konsènan
              </Link>
              <Link href="/press" className="text-gray-600 hover:text-[#006CFF] transition-colors">
                Press
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-[#006CFF] transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
