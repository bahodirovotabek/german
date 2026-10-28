import React, { useState } from 'react';
import { 
  Volume2, 
  Star, 
  Copy, 
  Check, 
  Layers, 
  BookOpen, 
  Sparkles, 
  Gauge,
  Share2,
  Tag
} from 'lucide-react';
import { DictionaryEntry, Language } from '../types';
import { speakWord, playTone } from '../utils/speech';
import { AppSettings } from '../utils/storage';

interface WordDetailProps {
  word: DictionaryEntry | null;
  isFavorited: boolean;
  onToggleFavorite: (wordId: string) => void;
  onPracticeWord: (word: DictionaryEntry) => void;
  settings: AppSettings;
  customLists?: string[];
}

export const WordDetail: React.FC<WordDetailProps> = ({
  word,
  isFavorited,
  onToggleFavorite,
  onPracticeWord,
  settings,
}) => {
  const [speakingLang, setSpeakingLang] = useState<Language | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(settings.voiceSpeed || 0.95);
  const [copied, setCopied] = useState<boolean>(false);

  const isDark = settings.darkMode;

  if (!word) {
    return (
      <div className={`h-full flex flex-col items-center justify-center p-8 text-center transition-colors ${
        isDark ? 'bg-[#0F0F0F] text-[#737373]' : 'bg-[#FAFAFA] text-[#888]'
      }`}>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition border ${
          isDark ? 'bg-[#181818] border-[#2A2A2A] text-[#D4AF37]' : 'bg-white border-[#E5E5DE] text-[#8C701E] shadow-xs'
        }`}>
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className={`text-base font-serif font-bold mb-1 ${isDark ? 'text-[#E5E5E5]' : 'text-[#1F1F1F]'}`}>
          Select a word to view details
        </h3>
        <p className="text-xs max-w-sm">
          Browse through 10,000+ words or use the search bar to explore English, Uzbek, and German translations with voice pronunciation.
        </p>
      </div>
    );
  }

  const handleSpeak = (text: string, lang: Language) => {
    if (settings.soundEffects) playTone('click');
    setSpeakingLang(lang);
    speakWord(text, lang, {
      rate: speechRate,
      onEnd: () => setSpeakingLang(null),
      onError: () => setSpeakingLang(null),
    });
  };

  const handleCopy = () => {
    const text = `${word.en} | ${word.uz} | ${word.deGender ? word.deGender + ' ' : ''}${word.de}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (settings.soundEffects) playTone('click');
    setTimeout(() => setCopied(false), 2000);
  };

  // Gender color scheme for German
  const getGenderBadge = (gender: string | null) => {
    if (!gender) return null;
    if (gender === 'der') {
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-serif font-bold border ${
          isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          der (Masculine)
        </span>
      );
    }
    if (gender === 'die') {
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-serif font-bold border ${
          isDark ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          die (Feminine)
        </span>
      );
    }
    if (gender === 'das') {
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-serif font-bold border ${
          isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          das (Neuter)
        </span>
      );
    }
    if (gender === 'plural') {
      return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-serif font-bold border ${
          isDark ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200'
        }`}>
          Plural
        </span>
      );
    }
    return null;
  };

  const getCefrBadge = (level: string) => {
    if (isDark) {
      const colors: Record<string, string> = {
        A1: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30',
        A2: 'bg-[#D4AF37]/20 text-[#F3E5AB] border-[#D4AF37]/40',
        B1: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        B2: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
        C1: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        C2: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
      };
      return colors[level] || colors.A1;
    } else {
      const colors: Record<string, string> = {
        A1: 'bg-amber-50 text-amber-800 border-amber-200',
        A2: 'bg-amber-100 text-amber-900 border-amber-300',
        B1: 'bg-orange-50 text-orange-800 border-orange-200',
        B2: 'bg-orange-100 text-orange-900 border-orange-300',
        C1: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        C2: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      };
      return colors[level] || colors.A1;
    }
  };

  return (
    <div id="word-detail-container" className={`h-full overflow-y-auto p-5 sm:p-6 space-y-6 transition-colors ${
      isDark ? 'bg-[#0A0A0A] text-[#E5E5E5]' : 'bg-[#F9F9F7] text-[#1F1F1F]'
    }`}>
      {/* Top Header Card */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-[#141414] border-[#262626] shadow-xl'
          : 'bg-white border-[#E8E8E2] shadow-xs'
      }`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${getCefrBadge(word.cefr)}`}>
                CEFR {word.cefr}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-serif font-medium border ${
                isDark ? 'bg-[#1E1E1E] text-[#D4AF37] border-[#333]' : 'bg-[#F4F4F0] text-[#8C701E] border-[#E0E0D8]'
              }`}>
                {word.pos}
              </span>
              {getGenderBadge(word.deGender)}
              {word.category && (
                <span className="text-xs text-[#737373] font-serif italic">
                  • {word.category}
                </span>
              )}
            </div>

            <h1 className={`text-2xl sm:text-3xl font-serif font-bold tracking-wide ${
              isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'
            }`}>
              {word.en}
            </h1>
            {word.ipaEn && (
              <p className={`text-xs font-mono ${isDark ? 'text-[#A3A3A3]' : 'text-[#6B7280]'}`}>
                {word.ipaEn}
              </p>
            )}
          </div>

          {/* Action buttons: Favorite, Copy, Speed */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="btn-voice-speed"
              onClick={() => {
                const nextRate = speechRate === 0.95 ? 0.75 : speechRate === 0.75 ? 1.15 : 0.95;
                setSpeechRate(nextRate);
              }}
              className={`px-2 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1 border transition ${
                isDark
                  ? 'border-[#2A2A2A] text-[#A3A3A3] hover:text-[#D4AF37] hover:bg-[#1E1E1E]'
                  : 'border-[#E0E0D8] text-[#555] hover:text-[#8C701E] hover:bg-[#F2F2EC]'
              }`}
              title="Voice Speed (0.75x / 1.0x / 1.2x)"
            >
              <Gauge className={`w-3.5 h-3.5 ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`} />
              <span>{speechRate}x</span>
            </button>

            <button
              id="btn-copy-word"
              onClick={handleCopy}
              className={`p-2 rounded-lg border transition ${
                isDark
                  ? 'border-[#2A2A2A] text-[#A3A3A3] hover:text-[#D4AF37] hover:bg-[#1E1E1E]'
                  : 'border-[#E0E0D8] text-[#555] hover:text-[#8C701E] hover:bg-[#F2F2EC]'
              }`}
              title="Copy Word"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              id="btn-toggle-favorite-detail"
              onClick={() => {
                if (settings.soundEffects) playTone('click');
                onToggleFavorite(word.id);
              }}
              className={`p-2 rounded-lg border transition ${
                isFavorited
                  ? isDark
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]'
                    : 'bg-[#FFF9E6] border-[#D4AF37]/60 text-[#8C701E]'
                  : isDark
                    ? 'border-[#2A2A2A] text-[#737373] hover:text-[#D4AF37] hover:bg-[#1E1E1E]'
                    : 'border-[#E0E0D8] text-[#888] hover:text-[#8C701E] hover:bg-[#F2F2EC]'
              }`}
              title={isFavorited ? 'Remove from Favorites' : 'Save to Favorites'}
            >
              <Star className={`w-4 h-4 ${isFavorited ? (isDark ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-[#8C701E] text-[#8C701E]') : ''}`} />
            </button>
          </div>
        </div>

        {/* Trilingual Translations Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t ${
          isDark ? 'border-[#222]' : 'border-[#E8E8E2]'
        }`}>
          {/* 1. English */}
          <div className={`p-4 rounded-xl border space-y-2 transition-colors ${
            isDark ? 'bg-[#0F0F0F] border-[#222]' : 'bg-[#FAFAF8] border-[#E8E8E2]'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#D4AF37]' : 'bg-[#8C701E]'}`} /> English (EN)
              </span>
              <button
                id="btn-speak-en"
                onClick={() => handleSpeak(word.en, 'en')}
                className={`p-1.5 rounded-lg transition ${
                  speakingLang === 'en'
                    ? 'bg-[#D4AF37] text-black animate-pulse'
                    : isDark
                      ? 'text-[#737373] hover:text-[#D4AF37] hover:bg-[#1C1C1C]'
                      : 'text-[#888] hover:text-[#8C701E] hover:bg-[#EAEAE2]'
                }`}
                title="Pronounce English (US/UK)"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className={`text-base font-serif font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
              {word.en}
            </div>
            {word.ipaEn && (
              <div className={`text-xs font-mono ${isDark ? 'text-[#888]' : 'text-[#6B7280]'}`}>
                {word.ipaEn}
              </div>
            )}
            {word.pluralEn && (
              <div className={`text-xs ${isDark ? 'text-[#888]' : 'text-[#6B7280]'}`}>
                Plural: <span className={`font-semibold ${isDark ? 'text-[#CCC]' : 'text-[#111827]'}`}>{word.pluralEn}</span>
              </div>
            )}
          </div>

          {/* 2. Uzbek */}
          <div className={`p-4 rounded-xl border space-y-2 transition-colors ${
            isDark ? 'bg-[#0F0F0F] border-[#222]' : 'bg-[#FAFAF8] border-[#E8E8E2]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-serif font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> O‘zbekcha (UZ)
              </span>
              <button
                id="btn-speak-uz"
                onClick={() => handleSpeak(word.uz, 'uz')}
                className={`p-1.5 rounded-lg transition ${
                  speakingLang === 'uz'
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : isDark
                      ? 'text-[#737373] hover:text-emerald-400 hover:bg-[#1C1C1C]'
                      : 'text-[#888] hover:text-emerald-600 hover:bg-[#EAEAE2]'
                }`}
                title="Pronounce Uzbek"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className={`text-base font-serif font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
              {word.uz}
            </div>
            {word.pluralUz && (
              <div className={`text-xs ${isDark ? 'text-[#888]' : 'text-[#6B7280]'}`}>
                Ko‘plik: <span className={`font-semibold ${isDark ? 'text-[#CCC]' : 'text-[#111827]'}`}>{word.pluralUz}</span>
              </div>
            )}
          </div>

          {/* 3. German */}
          <div className={`p-4 rounded-xl border space-y-2 transition-colors ${
            isDark ? 'bg-[#0F0F0F] border-[#222]' : 'bg-[#FAFAF8] border-[#E8E8E2]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-serif font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Deutsch (DE)
              </span>
              <button
                id="btn-speak-de"
                onClick={() => {
                  const speechText = word.deGender && word.deGender !== 'plural'
                    ? `${word.deGender} ${word.de}`
                    : word.de;
                  handleSpeak(speechText, 'de');
                }}
                className={`p-1.5 rounded-lg transition ${
                  speakingLang === 'de'
                    ? 'bg-amber-500 text-white animate-pulse'
                    : isDark
                      ? 'text-[#737373] hover:text-amber-400 hover:bg-[#1C1C1C]'
                      : 'text-[#888] hover:text-amber-600 hover:bg-[#EAEAE2]'
                }`}
                title="Pronounce German (Native de-DE)"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className={`text-base font-serif font-bold flex items-center gap-1.5 ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
              {word.deGender && (
                <span className={`text-xs font-semibold ${
                  word.deGender === 'der' ? 'text-blue-500' :
                  word.deGender === 'die' ? 'text-rose-500' :
                  word.deGender === 'das' ? 'text-emerald-500' : 'text-purple-500'
                }`}>
                  {word.deGender}
                </span>
              )}
              <span>{word.de}</span>
            </div>
            {word.ipaDe && (
              <div className={`text-xs font-mono ${isDark ? 'text-[#888]' : 'text-[#6B7280]'}`}>
                {word.ipaDe}
              </div>
            )}
            {word.pluralDe && (
              <div className={`text-xs ${isDark ? 'text-[#888]' : 'text-[#6B7280]'}`}>
                Plural: <span className={`font-semibold ${isDark ? 'text-[#CCC]' : 'text-[#111827]'}`}>{word.pluralDe}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Example Sentences in all 3 Languages */}
      <div className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
        isDark
          ? 'bg-[#141414] border-[#262626]'
          : 'bg-white border-[#E8E8E2] shadow-xs'
      } space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 ${
            isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'
          }`}>
            <BookOpen className="w-4 h-4" />
            Contextual Example Sentences
          </h3>
          <span className="text-[11px] text-[#737373] font-serif italic">Audio pronunciation available</span>
        </div>

        <div className="space-y-3">
          {/* EN Example */}
          <div className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
            isDark ? 'bg-[#0F0F0F] border-[#222]' : 'bg-[#FAFAF8] border-[#E8E8E2]'
          }`}>
            <div className="space-y-1">
              <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`}>EN</span>
              <p className={`text-xs sm:text-sm font-serif ${isDark ? 'text-[#D4D4D4]' : 'text-[#374151]'}`}>
                {word.exampleEn || `The word "${word.en}" is frequently used in spoken and written communication.`}
              </p>
            </div>
            <button
              onClick={() => handleSpeak(word.exampleEn || word.en, 'en')}
              className={`p-1.5 rounded transition shrink-0 ${
                isDark ? 'text-[#737373] hover:text-[#D4AF37] hover:bg-[#1E1E1E]' : 'text-[#888] hover:text-[#8C701E] hover:bg-[#EAEAE2]'
              }`}
              title="Listen to English sentence"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* UZ Example */}
          <div className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
            isDark ? 'bg-[#0F0F0F] border-[#222]' : 'bg-[#FAFAF8] border-[#E8E8E2]'
          }`}>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-500">UZ</span>
              <p className={`text-xs sm:text-sm font-serif ${isDark ? 'text-[#D4D4D4]' : 'text-[#374151]'}`}>
                {word.exampleUz || `"${word.uz}" so‘zi og‘zaki va yozma muloqotda ko‘p ishlatiladi.`}
              </p>
            </div>
            <button
              onClick={() => handleSpeak(word.exampleUz || word.uz, 'uz')}
              className={`p-1.5 rounded transition shrink-0 ${
                isDark ? 'text-[#737373] hover:text-emerald-400 hover:bg-[#1E1E1E]' : 'text-[#888] hover:text-emerald-600 hover:bg-[#EAEAE2]'
              }`}
              title="Listen to Uzbek sentence"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* DE Example */}
          <div className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors ${
            isDark ? 'bg-[#0F0F0F] border-[#222]' : 'bg-[#FAFAF8] border-[#E8E8E2]'
          }`}>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-500">DE</span>
              <p className={`text-xs sm:text-sm font-serif ${isDark ? 'text-[#D4D4D4]' : 'text-[#374151]'}`}>
                {word.exampleDe || `Das Wort „${word.de}“ wird häufig in der schriftlichen und mündlichen Kommunikation verwendet.`}
              </p>
            </div>
            <button
              onClick={() => handleSpeak(word.exampleDe || word.de, 'de')}
              className={`p-1.5 rounded transition shrink-0 ${
                isDark ? 'text-[#737373] hover:text-amber-400 hover:bg-[#1E1E1E]' : 'text-[#888] hover:text-amber-600 hover:bg-[#EAEAE2]'
              }`}
              title="Listen to German sentence"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grammar notes and Synonyms */}
      {(word.notes || (word.synonymsEn && word.synonymsEn.length > 0)) && (
        <div className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
          isDark
            ? 'bg-[#141414] border-[#262626]'
            : 'bg-white border-[#E8E8E2] shadow-xs'
        } space-y-3`}>
          <h3 className={`text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 ${
            isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'
          }`}>
            <Sparkles className="w-4 h-4" />
            Grammar Notes & Linguistic Context
          </h3>

          {word.notes && (
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              isDark
                ? 'bg-[#D4AF37]/10 border-[#D4AF37]/25 text-[#F3E5AB]'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
            }`}>
              {word.notes}
            </div>
          )}

          {word.synonymsEn && word.synonymsEn.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className={`font-serif ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>English Synonyms:</span>
              {word.synonymsEn.map((syn, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-0.5 rounded-md border font-medium ${
                    isDark
                      ? 'bg-[#1E1E1E] border-[#333] text-[#D4AF37]'
                      : 'bg-[#F2F2EC] border-[#DDD] text-[#8C701E]'
                  }`}
                >
                  {syn}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Retention Booster Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          id="btn-practice-flashcard-action"
          onClick={() => onPracticeWord(word)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif font-bold text-xs shadow-md transition ${
            isDark
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E5C158] hover:to-[#C5A059] text-black'
              : 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black'
          }`}
        >
          <Layers className="w-4 h-4 text-black" />
          <span>Practice in Flashcards</span>
        </button>

        <div className="text-[11px] text-[#737373]">
          ID: <span className={`font-mono ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`}>{word.id}</span>
        </div>
      </div>
    </div>
  );
};
