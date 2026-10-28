import React, { useState, useEffect, useMemo } from 'react';
import { 
  RotateCw, 
  Volume2, 
  Star, 
  Layers, 
  Sparkles, 
  ArrowRightLeft, 
  Trophy, 
  RefreshCw,
  Clock,
  ThumbsUp,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DictionaryEntry, Language, CefrLevel } from '../types';
import { speakWord, playTone } from '../utils/speech';
import { updateSrsItem, AppSettings, getSrsData } from '../utils/storage';

interface FlashcardsViewProps {
  allWords: DictionaryEntry[];
  favorites: string[];
  onToggleFavorite: (wordId: string) => void;
  settings: AppSettings;
  initialWord?: DictionaryEntry | null;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  allWords,
  favorites,
  onToggleFavorite,
  settings,
  initialWord,
}) => {
  const [sourceMode, setSourceMode] = useState<'favorites' | 'all' | 'level'>('all');
  const [selectedCefr, setSelectedCefr] = useState<CefrLevel>('A1');
  const [questionLang, setQuestionLang] = useState<Language>('en');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);

  const isDark = settings.darkMode;

  // Filter study cards
  const deckWords = useMemo(() => {
    if (initialWord) {
      const rest = allWords.filter(w => w.id !== initialWord.id).slice(0, 19);
      return [initialWord, ...rest];
    }
    if (sourceMode === 'favorites') {
      const favs = allWords.filter(w => favorites.includes(w.id));
      return favs.length > 0 ? favs : allWords.slice(0, 20);
    }
    if (sourceMode === 'level') {
      return allWords.filter(w => w.cefr === selectedCefr).slice(0, 30);
    }
    return allWords.slice(0, 25);
  }, [allWords, favorites, sourceMode, selectedCefr, initialWord]);

  const currentCard = deckWords[currentIndex] || null;
  const isCurrentFav = currentCard ? favorites.includes(currentCard.id) : false;

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (sessionFinished || !currentCard) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        if (e.key === '2') handleRate('hard');
        if (e.key === '3') handleRate('good');
        if (e.key === '4') handleRate('easy');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFlipped, sessionFinished, currentCard]);

  const handleFlip = () => {
    if (settings.soundEffects) playTone('flip');
    setIsFlipped(!isFlipped);

    // Auto pronounce on reveal if setting enabled
    if (!isFlipped && settings.autoPronounce && currentCard) {
      speakWord(currentCard.de, 'de', { rate: settings.voiceSpeed });
    }
  };

  const handleSpeak = (e: React.MouseEvent, text: string, lang: Language) => {
    e.stopPropagation();
    if (settings.soundEffects) playTone('click');
    speakWord(text, lang, { rate: settings.voiceSpeed });
  };

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    if (settings.soundEffects) {
      if (rating === 'good' || rating === 'easy') playTone('success');
      else playTone('click');
    }

    updateSrsItem(currentCard.id, rating);
    setCompletedCount(prev => prev + 1);

    if (currentIndex + 1 >= deckWords.length) {
      setSessionFinished(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } else {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setCompletedCount(0);
    setIsFlipped(false);
    setSessionFinished(false);
  };

  return (
    <div id="flashcards-view-main" className={`h-full flex flex-col p-4 sm:p-6 overflow-y-auto max-w-4xl mx-auto w-full transition-colors ${
      isDark ? 'bg-[#0A0A0A] text-[#E5E5E5]' : 'bg-[#FAFAFA] text-[#1F1F1F]'
    }`}>
      {/* Top Deck Controls */}
      <div className={`p-4 rounded-2xl border mb-6 transition-colors flex flex-wrap items-center justify-between gap-3 ${
        isDark
          ? 'bg-[#141414] border-[#262626]'
          : 'bg-white border-[#E8E8E2] shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-serif font-bold text-[#888] uppercase text-[10px]">Study Deck:</span>
          <div className={`flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-[#1C1C1C] border-[#2E2E2E]' : 'bg-[#F2F2EC] border-[#DDD]'
          }`}>
            <button
              onClick={() => { setSourceMode('all'); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                sourceMode === 'all'
                  ? isDark ? 'bg-[#D4AF37] text-black font-bold' : 'bg-white text-black font-bold shadow-2xs'
                  : 'text-[#888]'
              }`}
            >
              Essential Words
            </button>
            <button
              onClick={() => { setSourceMode('favorites'); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                sourceMode === 'favorites'
                  ? isDark ? 'bg-[#D4AF37] text-black font-bold' : 'bg-white text-black font-bold shadow-2xs'
                  : 'text-[#888]'
              }`}
            >
              Favorites ({favorites.length})
            </button>
            <button
              onClick={() => { setSourceMode('level'); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                sourceMode === 'level'
                  ? isDark ? 'bg-[#D4AF37] text-black font-bold' : 'bg-white text-black font-bold shadow-2xs'
                  : 'text-[#888]'
              }`}
            >
              By CEFR Level
            </button>
          </div>

          {sourceMode === 'level' && (
            <select
              value={selectedCefr}
              onChange={(e) => setSelectedCefr(e.target.value as CefrLevel)}
              className={`p-1.5 rounded-lg border text-xs ${
                isDark ? 'bg-[#1C1C1C] border-[#2E2E2E] text-[#E5E5E5]' : 'bg-white border-[#DDD] text-[#222]'
              }`}
            >
              <option value="A1">A1 Beginner</option>
              <option value="A2">A2 Elementary</option>
              <option value="B1">B1 Intermediate</option>
              <option value="B2">B2 Upper-Int.</option>
              <option value="C1">C1 Advanced</option>
            </select>
          )}
        </div>

        {/* Progress meter */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="text-[#888]">
            Card <span className={isDark ? 'text-[#D4AF37] font-bold' : 'text-[#8C701E] font-bold'}>{Math.min(currentIndex + 1, deckWords.length)}</span> of {deckWords.length}
          </div>
          <div className="w-24 h-2 bg-[#222] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isDark ? 'bg-[#D4AF37]' : 'bg-[#8C701E]'
              }`}
              style={{ width: `${((currentIndex + 1) / Math.max(1, deckWords.length)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Flashcard Body */}
      {!sessionFinished && currentCard ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[360px] space-y-6">
          {/* 3D Flip Card Container */}
          <div
            id="active-srs-flashcard"
            onClick={handleFlip}
            className={`w-full max-w-xl min-h-[300px] p-6 sm:p-8 rounded-3xl border cursor-pointer transition-all duration-300 transform select-none relative flex flex-col justify-between ${
              isDark
                ? 'bg-[#141414] border-[#2A2A2A] hover:border-[#D4AF37]/50 shadow-2xl'
                : 'bg-white border-[#E5E5DE] hover:border-[#D4AF37] shadow-lg'
            }`}
          >
            {/* Top Bar on Card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase ${
                  isDark ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {currentCard.cefr}
                </span>
                <span className={`text-xs font-serif ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
                  {currentCard.pos} • {currentCard.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(currentCard.id);
                  }}
                  className={`p-1.5 rounded-lg transition ${
                    isCurrentFav 
                      ? isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'
                      : 'text-[#737373] hover:text-[#D4AF37]'
                  }`}
                  title="Favorite Word"
                >
                  <Star className={`w-4 h-4 ${isCurrentFav ? (isDark ? 'fill-[#D4AF37]' : 'fill-[#8C701E]') : ''}`} />
                </button>

                <div className={`text-[11px] font-serif italic ${isDark ? 'text-[#737373]' : 'text-[#999]'}`}>
                  {isFlipped ? 'Answer Revealed' : 'Click / Space to Flip'}
                </div>
              </div>
            </div>

            {/* Center Content: Question (Front) vs Answers (Back) */}
            <div className="text-center py-6 space-y-3">
              {!isFlipped ? (
                /* FRONT: English Prompt */
                <div className="space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#888]">
                    Prompt (English)
                  </div>
                  <h2 className={`text-3xl sm:text-4xl font-serif font-bold tracking-wide ${
                    isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'
                  }`}>
                    {currentCard.en}
                  </h2>
                  {currentCard.ipaEn && (
                    <p className={`text-xs font-mono ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
                      {currentCard.ipaEn}
                    </p>
                  )}
                  <button
                    onClick={(e) => handleSpeak(e, currentCard.en, 'en')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition mt-2 ${
                      isDark ? 'bg-[#1E1E1E] text-[#D4AF37] hover:bg-[#282828]' : 'bg-[#F2F2EC] text-[#8C701E] hover:bg-[#E8E8DE]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Pronounce</span>
                  </button>
                </div>
              ) : (
                /* BACK: Uzbek & German Translations with examples */
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  {/* Uzbek */}
                  <div className={`p-3 rounded-2xl border ${
                    isDark ? 'bg-[#0E0E0E] border-[#222]' : 'bg-[#F9F9F7] border-[#E8E8E2]'
                  }`}>
                    <div className="text-[10px] font-serif font-bold text-emerald-500 uppercase tracking-wider mb-1">
                      O‘zbekcha (UZ)
                    </div>
                    <div className={`text-xl sm:text-2xl font-serif font-bold ${
                      isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'
                    }`}>
                      {currentCard.uz}
                    </div>
                  </div>

                  {/* German */}
                  <div className={`p-3 rounded-2xl border ${
                    isDark ? 'bg-[#0E0E0E] border-[#222]' : 'bg-[#F9F9F7] border-[#E8E8E2]'
                  }`}>
                    <div className="text-[10px] font-serif font-bold text-amber-500 uppercase tracking-wider mb-1">
                      Deutsch (DE)
                    </div>
                    <div className={`text-xl sm:text-2xl font-serif font-bold flex items-center justify-center gap-2 ${
                      isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'
                    }`}>
                      {currentCard.deGender && (
                        <span className={`text-sm font-sans ${
                          currentCard.deGender === 'der' ? 'text-blue-500 font-bold' :
                          currentCard.deGender === 'die' ? 'text-rose-500 font-bold' :
                          currentCard.deGender === 'das' ? 'text-emerald-500 font-bold' : 'text-purple-500 font-bold'
                        }`}>
                          {currentCard.deGender}
                        </span>
                      )}
                      <span>{currentCard.de}</span>
                    </div>
                    {currentCard.pluralDe && (
                      <div className="text-xs text-[#888] mt-1 font-mono">
                        Plural: {currentCard.pluralDe}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className={`flex items-center justify-between text-xs pt-3 border-t ${
              isDark ? 'border-[#222]' : 'border-[#E8E8E2]'
            }`}>
              <div className="flex items-center gap-1.5 text-[#888]">
                <RotateCw className="w-3.5 h-3.5" />
                <span className="font-serif">Click to flip card</span>
              </div>

              {isFlipped && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleSpeak(e, currentCard.de, 'de')}
                    className="p-1 rounded text-amber-500 hover:bg-amber-500/10 transition"
                    title="Speak German"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleSpeak(e, currentCard.uz, 'uz')}
                    className="p-1 rounded text-emerald-500 hover:bg-emerald-500/10 transition"
                    title="Speak Uzbek"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SRS Grading Buttons (Shown when flipped) */}
          {isFlipped ? (
            <div className="w-full max-w-xl grid grid-cols-4 gap-2 sm:gap-3 animate-in fade-in duration-200">
              <button
                id="btn-srs-again"
                onClick={() => handleRate('again')}
                className={`p-3 rounded-xl border font-serif text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  isDark
                    ? 'bg-[#1C1414] border-rose-900/50 text-rose-300 hover:bg-rose-900/40'
                    : 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                }`}
              >
                <span className="font-bold">Again</span>
                <span className="text-[10px] opacity-70">Key: 1 (&lt;10m)</span>
              </button>

              <button
                id="btn-srs-hard"
                onClick={() => handleRate('hard')}
                className={`p-3 rounded-xl border font-serif text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  isDark
                    ? 'bg-[#1C1A14] border-amber-900/50 text-amber-300 hover:bg-amber-900/40'
                    : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <span className="font-bold">Hard</span>
                <span className="text-[10px] opacity-70">Key: 2 (1d)</span>
              </button>

              <button
                id="btn-srs-good"
                onClick={() => handleRate('good')}
                className={`p-3 rounded-xl border font-serif text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  isDark
                    ? 'bg-[#141A14] border-emerald-900/50 text-emerald-300 hover:bg-emerald-900/40'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <span className="font-bold">Good</span>
                <span className="text-[10px] opacity-70">Key: 3 (3d)</span>
              </button>

              <button
                id="btn-srs-easy"
                onClick={() => handleRate('easy')}
                className={`p-3 rounded-xl border font-serif text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  isDark
                    ? 'bg-[#14181F] border-blue-900/50 text-blue-300 hover:bg-blue-900/40'
                    : 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                }`}
              >
                <span className="font-bold">Easy</span>
                <span className="text-[10px] opacity-70">Key: 4 (7d)</span>
              </button>
            </div>
          ) : (
            <div className="text-center text-xs text-[#888] font-serif">
              Press <kbd className={`px-2 py-0.5 rounded font-mono ${isDark ? 'bg-[#222] text-[#D4AF37]' : 'bg-[#EAEAEA] text-[#333]'}`}>Space</kbd> or click the card to reveal answer
            </div>
          )}
        </div>
      ) : (
        /* Session Completed View */
        <div className={`p-8 rounded-3xl border text-center space-y-4 max-w-lg mx-auto w-full my-auto transition-colors ${
          isDark
            ? 'bg-[#141414] border-[#262626]'
            : 'bg-white border-[#E8E8E2] shadow-md'
        }`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border ${
            isDark ? 'bg-[#1E1E1E] border-[#333] text-[#D4AF37]' : 'bg-amber-50 border-amber-200 text-[#8C701E]'
          }`}>
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className={`text-2xl font-serif font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
            Study Session Complete!
          </h2>
          <p className="text-xs text-[#888] max-w-sm mx-auto">
            You reviewed {completedCount} flashcards with Spaced Repetition algorithms. Your memory intervals have been updated.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={restartSession}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif font-bold text-xs shadow-md transition ${
                isDark
                  ? 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black'
                  : 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Review Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
