import React, { useState } from 'react';
import { TableProperties, BookOpen, Layers, Sparkles, Check, Globe } from 'lucide-react';
import { AppSettings } from '../utils/storage';

interface GrammarTablesViewProps {
  settings: AppSettings;
}

export const GrammarTablesView: React.FC<GrammarTablesViewProps> = ({ settings }) => {
  const [activeTab, setActiveTab] = useState<'de_articles' | 'de_endings' | 'uz_cases' | 'en_verbs'>('de_articles');

  const isDark = settings.darkMode;

  return (
    <div id="grammar-tables-view-main" className={`h-full flex flex-col p-4 sm:p-6 overflow-y-auto max-w-5xl mx-auto w-full transition-colors ${
      isDark ? 'bg-[#0A0A0A] text-[#E5E5E5]' : 'bg-[#FAFAFA] text-[#1F1F1F]'
    }`}>
      {/* Top Header */}
      <div className={`p-5 rounded-2xl border mb-6 transition-colors ${
        isDark
          ? 'bg-[#141414] border-[#262626]'
          : 'bg-white border-[#E8E8E2] shadow-xs'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2.5 rounded-xl border ${
            isDark ? 'bg-[#1C1C1C] border-[#2E2E2E] text-[#D4AF37]' : 'bg-amber-50 border-amber-200 text-[#8C701E]'
          }`}>
            <TableProperties className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-xl font-serif font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
              Grammar & Declension Reference
            </h2>
            <p className="text-xs text-[#888] font-serif">
              Essential grammatical tables for German articles, Uzbek kelishiklar, and English structures.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className={`flex flex-wrap items-center gap-2 pt-3 border-t text-xs font-serif ${
          isDark ? 'border-[#222]' : 'border-[#E8E8E2]'
        }`}>
          <button
            onClick={() => setActiveTab('de_articles')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'de_articles'
                ? isDark ? 'bg-[#D4AF37] text-black font-bold shadow-xs' : 'bg-[#D4AF37] text-black font-bold shadow-xs'
                : isDark ? 'bg-[#1C1C1C] border border-[#2E2E2E] text-[#A3A3A3] hover:text-[#E5E5E5]' : 'bg-[#F2F2EC] border border-[#DDD] text-[#555] hover:text-[#111]'
            }`}
          >
            German Articles (der/die/das)
          </button>

          <button
            onClick={() => setActiveTab('de_endings')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'de_endings'
                ? isDark ? 'bg-[#D4AF37] text-black font-bold shadow-xs' : 'bg-[#D4AF37] text-black font-bold shadow-xs'
                : isDark ? 'bg-[#1C1C1C] border border-[#2E2E2E] text-[#A3A3A3] hover:text-[#E5E5E5]' : 'bg-[#F2F2EC] border border-[#DDD] text-[#555] hover:text-[#111]'
            }`}
          >
            German Gender Rules
          </button>

          <button
            onClick={() => setActiveTab('uz_cases')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'uz_cases'
                ? isDark ? 'bg-[#D4AF37] text-black font-bold shadow-xs' : 'bg-[#D4AF37] text-black font-bold shadow-xs'
                : isDark ? 'bg-[#1C1C1C] border border-[#2E2E2E] text-[#A3A3A3] hover:text-[#E5E5E5]' : 'bg-[#F2F2EC] border border-[#DDD] text-[#555] hover:text-[#111]'
            }`}
          >
            Uzbek Cases (Kelishiklar)
          </button>

          <button
            onClick={() => setActiveTab('en_verbs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'en_verbs'
                ? isDark ? 'bg-[#D4AF37] text-black font-bold shadow-xs' : 'bg-[#D4AF37] text-black font-bold shadow-xs'
                : isDark ? 'bg-[#1C1C1C] border border-[#2E2E2E] text-[#A3A3A3] hover:text-[#E5E5E5]' : 'bg-[#F2F2EC] border border-[#DDD] text-[#555] hover:text-[#111]'
            }`}
          >
            English Verb Tenses
          </button>
        </div>
      </div>

      {/* Tab 1: German Articles Declension Table */}
      {activeTab === 'de_articles' && (
        <div className={`p-6 rounded-2xl border transition-colors space-y-4 ${
          isDark ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E8E8E2] shadow-xs'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-serif font-bold uppercase tracking-wider ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`}>
              German Definite & Indefinite Articles Declension
            </h3>
            <span className="text-xs text-[#888] font-mono">Kasus (Cases)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-[#2E2E2E] text-[#D4AF37]' : 'border-[#DDD] text-[#8C701E]'}`}>
                  <th className="py-2.5 px-3">Case</th>
                  <th className="py-2.5 px-3 text-blue-500 font-bold">Masculine (m)</th>
                  <th className="py-2.5 px-3 text-rose-500 font-bold">Feminine (f)</th>
                  <th className="py-2.5 px-3 text-emerald-500 font-bold">Neuter (n)</th>
                  <th className="py-2.5 px-3 text-purple-500 font-bold">Plural (pl)</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#222]' : 'divide-[#EEE]'}`}>
                <tr>
                  <td className="py-3 px-3 font-mono font-bold">Nominativ (Wer/Was)</td>
                  <td className="py-3 px-3"><span className="text-blue-500 font-bold">der</span> / ein</td>
                  <td className="py-3 px-3"><span className="text-rose-500 font-bold">die</span> / eine</td>
                  <td className="py-3 px-3"><span className="text-emerald-500 font-bold">das</span> / ein</td>
                  <td className="py-3 px-3"><span className="text-purple-500 font-bold">die</span> / -</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono font-bold">Akkusativ (Wen/Was)</td>
                  <td className="py-3 px-3"><span className="text-blue-500 font-bold">den</span> / einen</td>
                  <td className="py-3 px-3"><span className="text-rose-500 font-bold">die</span> / eine</td>
                  <td className="py-3 px-3"><span className="text-emerald-500 font-bold">das</span> / ein</td>
                  <td className="py-3 px-3"><span className="text-purple-500 font-bold">die</span> / -</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono font-bold">Dativ (Wem)</td>
                  <td className="py-3 px-3"><span className="text-blue-500 font-bold">dem</span> / einem</td>
                  <td className="py-3 px-3"><span className="text-rose-500 font-bold">der</span> / einer</td>
                  <td className="py-3 px-3"><span className="text-emerald-500 font-bold">dem</span> / einem</td>
                  <td className="py-3 px-3"><span className="text-purple-500 font-bold">den (+n)</span> / -</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono font-bold">Genitiv (Wessen)</td>
                  <td className="py-3 px-3"><span className="text-blue-500 font-bold">des (+s)</span> / eines</td>
                  <td className="py-3 px-3"><span className="text-rose-500 font-bold">der</span> / einer</td>
                  <td className="py-3 px-3"><span className="text-emerald-500 font-bold">des (+s)</span> / eines</td>
                  <td className="py-3 px-3"><span className="text-purple-500 font-bold">der</span> / -</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: German Gender Suffixes */}
      {activeTab === 'de_endings' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#141414] border-blue-900/30' : 'bg-blue-50/50 border-blue-200'
          }`}>
            <h4 className="font-serif font-bold text-sm text-blue-500 mb-2">der (Masculine) Endings</h4>
            <ul className="text-xs space-y-1.5 font-serif text-[#888]">
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-er:</strong> der Computer, der Lehrer</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-ling:</strong> der Lehrling, der Frühling</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-or:</strong> der Motor, der Doktor</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-ismus:</strong> der Optimismus</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-ist:</strong> der Tourist, der Polizist</li>
            </ul>
          </div>

          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#141414] border-rose-900/30' : 'bg-rose-50/50 border-rose-200'
          }`}>
            <h4 className="font-serif font-bold text-sm text-rose-500 mb-2">die (Feminine) Endings</h4>
            <ul className="text-xs space-y-1.5 font-serif text-[#888]">
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-ung:</strong> die Zeitung, die Prüfung</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-heit / -keit:</strong> die Freiheit, die Möglichkeit</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-schaft:</strong> die Freundschaft, die Wissenschaft</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-tion:</strong> die Nation, die Information</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-tät:</strong> die Universität, die Realität</li>
            </ul>
          </div>

          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#141414] border-emerald-900/30' : 'bg-emerald-50/50 border-emerald-200'
          }`}>
            <h4 className="font-serif font-bold text-sm text-emerald-500 mb-2">das (Neuter) Endings</h4>
            <ul className="text-xs space-y-1.5 font-serif text-[#888]">
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-chen / -lein:</strong> das Mädchen, das Fräulein</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-um:</strong> das Museum, das Zentrum</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-ment:</strong> das Dokument, das Instrument</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>-tum:</strong> das Eigentum, das Datum</li>
              <li><strong className={isDark ? 'text-white' : 'text-black'}>Ge- :</strong> das Gebäude, das Gespräch</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Uzbek Kelishiklar */}
      {activeTab === 'uz_cases' && (
        <div className={`p-6 rounded-2xl border transition-colors space-y-4 ${
          isDark ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E8E8E2] shadow-xs'
        }`}>
          <h3 className={`text-sm font-serif font-bold uppercase tracking-wider ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`}>
            O‘zbek Tili Kelishiklari (Uzbek Grammatical Cases)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-[#2E2E2E] text-[#D4AF37]' : 'border-[#DDD] text-[#8C701E]'}`}>
                  <th className="py-2.5 px-3">Kelishik nomi</th>
                  <th className="py-2.5 px-3">Savollari</th>
                  <th className="py-2.5 px-3">Qo‘shimchasi</th>
                  <th className="py-2.5 px-3">Misol</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#222]' : 'divide-[#EEE]'}`}>
                <tr>
                  <td className="py-3 px-3 font-bold">1. Bosh kelishik</td>
                  <td className="py-3 px-3">Kim? Nima? Qayer?</td>
                  <td className="py-3 px-3 font-mono">- (belgisiz)</td>
                  <td className="py-3 px-3">kitob, talaba</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">2. Qaratqich kelishigi</td>
                  <td className="py-3 px-3">Kimning? Nimaning?</td>
                  <td className="py-3 px-3 font-mono text-emerald-500 font-bold">-ning</td>
                  <td className="py-3 px-3">talabaning kitobi</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">3. Tushum kelishigi</td>
                  <td className="py-3 px-3">Kimni? Nimani?</td>
                  <td className="py-3 px-3 font-mono text-emerald-500 font-bold">-ni</td>
                  <td className="py-3 px-3">kitobni o‘qidim</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">4. Jo‘nalish kelishigi</td>
                  <td className="py-3 px-3">Kimga? Nimaga? Qayerga?</td>
                  <td className="py-3 px-3 font-mono text-emerald-500 font-bold">-ga / -ka / -qa</td>
                  <td className="py-3 px-3">maktabga, universitetga</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">5. O‘rin-payt kelishigi</td>
                  <td className="py-3 px-3">Kimda? Nimada? Qayerda?</td>
                  <td className="py-3 px-3 font-mono text-emerald-500 font-bold">-da</td>
                  <td className="py-3 px-3">Toshkentda, kutubxonada</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">6. Chiqish kelishigi</td>
                  <td className="py-3 px-3">Kimdan? Nimadan? Qayerdan?</td>
                  <td className="py-3 px-3 font-mono text-emerald-500 font-bold">-dan</td>
                  <td className="py-3 px-3">uydan, shahardan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: English Verb Tenses */}
      {activeTab === 'en_verbs' && (
        <div className={`p-6 rounded-2xl border transition-colors space-y-4 ${
          isDark ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E8E8E2] shadow-xs'
        }`}>
          <h3 className={`text-sm font-serif font-bold uppercase tracking-wider ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`}>
            English Tense Matrix & Aspect Forms
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-[#2E2E2E] text-[#D4AF37]' : 'border-[#DDD] text-[#8C701E]'}`}>
                  <th className="py-2.5 px-3">Tense</th>
                  <th className="py-2.5 px-3">Simple</th>
                  <th className="py-2.5 px-3">Continuous</th>
                  <th className="py-2.5 px-3">Perfect</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-[#222]' : 'divide-[#EEE]'}`}>
                <tr>
                  <td className="py-3 px-3 font-bold">Present</td>
                  <td className="py-3 px-3">I learn (o‘rganaman)</td>
                  <td className="py-3 px-3">I am learning (o‘rganyapman)</td>
                  <td className="py-3 px-3">I have learned (o‘rganganman)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">Past</td>
                  <td className="py-3 px-3">I learned (o‘rgandim)</td>
                  <td className="py-3 px-3">I was learning (o‘rganayotgandim)</td>
                  <td className="py-3 px-3">I had learned (o‘rgangan edim)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">Future</td>
                  <td className="py-3 px-3">I will learn (o‘rganaman)</td>
                  <td className="py-3 px-3">I will be learning (o‘rganayotgan bo‘laman)</td>
                  <td className="py-3 px-3">I will have learned (o‘rganib bo‘laman)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
