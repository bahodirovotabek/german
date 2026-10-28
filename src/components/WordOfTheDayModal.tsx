import React from 'react';
import { Sparkles, X, Volume2, Star, BookOpen, Layers } from 'lucide-react';
import { DictionaryEntry } from '../types';
import { speakWord, playTone } from '../utils/speech';
import { AppSettings } from '../utils/storage';

interface WordOfTheDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: DictionaryEntry;
  isFavorited: boolean;
  onToggleFavorite: (wordId: string) => void;
  onPracticeWord: (word: DictionaryEntry) => void;
  settings: AppSettings;
}

export const WordOfTheDayModal: React.FC<WordOfTheDayModalProps> = ({
  isOpen,
  onClose,
  word,
  isFavorited,
  onToggleFavorite,
  onPracticeWord,
  settings,
}) => {
  if (!isOpen) return null;

  const isDark = settings.darkMode;

  const handleSpeak = (text: string, lang: 'en' | 'uz' | 'de') => {
    if (settings.soundEffects) playTone('click');
    speakWord(text, lang, { rate: settings.voiceSpeed });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
        isDark
          ? 'bg-[#141414] border-[#262626] text-[#E5E5E5]'
          : 'bg-white border-[#E5E5DE] text-[#1F1F1F]'
      }`}>
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark
            ? 'border-[#222] bg-gradient-to-r from-[#D4AF37]/15 via-transparent to-transparent'
            : 'border-[#E8E8E2] bg-[#FAF8F5]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border shadow-xs ${
              isDark ? 'bg-[#1C1C1C] border-[#2E2E2E] text-[#D4AF37]' : 'bg-amber-50 border-amber-200 text-[#8C701E]'
            }`}>
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className={`font-serif font-bold text-sm ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
                Word of the Day
              </h3>
              <p className="text-[11px] text-[#888] font-serif">Daily Vocabulary Expansion</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isDark ? 'text-[#737373] hover:text-[#E5E5E5] hover:bg-[#1C1C1C]' : 'text-[#888] hover:text-[#111] hover:bg-[#F2F2EC]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Word Content */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                isDark ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30' : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {word.cefr}
              </span>
              <span className="text-xs text-[#888] font-serif">{word.category}</span>
            </div>

            <h2 className={`text-3xl font-serif font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
              {word.en}
            </h2>
            {word.ipaEn && <p className={`text-xs font-mono ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>{word.ipaEn}</p>}
          </div>

          {/* Translations Box */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-2xl border space-y-1.5 font-serif ${
              isDark ? 'bg-[#0F0F0F] border-[#242424]' : 'bg-[#F9F9F7] border-[#E8E8E2]'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-500 uppercase">
                <span>O‘zbekcha</span>
                <button onClick={() => handleSpeak(word.uz, 'uz')} className="text-[#888] hover:text-emerald-500">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className={`font-bold text-sm ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>{word.uz}</div>
            </div>

            <div className={`p-3.5 rounded-2xl border space-y-1.5 font-serif ${
              isDark ? 'bg-[#0F0F0F] border-[#242424]' : 'bg-[#F9F9F7] border-[#E8E8E2]'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-500 uppercase">
                <span>Deutsch</span>
                <button onClick={() => handleSpeak(word.de, 'de')} className="text-[#888] hover:text-amber-500">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className={`font-bold text-sm ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
                {word.deGender ? `${word.deGender} ` : ''}{word.de}
              </div>
            </div>
          </div>

          {/* Example Sentence */}
          {word.exampleEn && (
            <div className={`p-3.5 rounded-2xl border text-xs space-y-1 font-serif ${
              isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-[#F4F4F0] border-[#E0E0D8]'
            }`}>
              <span className={`font-bold ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`}>Context Example:</span>
              <p className={isDark ? 'text-[#CCC]' : 'text-[#333]'}>{word.exampleEn}</p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between gap-2 ${
          isDark ? 'border-[#222] bg-[#0E0E0E]' : 'border-[#E8E8E2] bg-[#FAFAF8]'
        }`}>
          <button
            onClick={() => onToggleFavorite(word.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-serif font-semibold border transition ${
              isFavorited
                ? isDark
                  ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]'
                  : 'bg-amber-50 border-amber-300 text-[#8C701E]'
                : isDark
                  ? 'border-[#2E2E2E] text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-[#D4AF37]'
                  : 'border-[#DDD] text-[#666] hover:bg-[#F0F0EA]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorited ? (isDark ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-[#8C701E] text-[#8C701E]') : ''}`} />
            <span>{isFavorited ? 'Saved to Favorites' : 'Save Word'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onPracticeWord(word);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-black text-xs font-serif font-bold shadow-xs transition ${
              isDark
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E5C158] hover:to-[#C5A059]'
                : 'bg-[#D4AF37] hover:bg-[#C29E2E]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Practice Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
