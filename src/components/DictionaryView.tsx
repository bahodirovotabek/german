import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Volume2, 
  Star, 
  ChevronRight, 
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';
import { DictionaryEntry, Language, CefrLevel, PosType } from '../types';
import { ALL_CATEGORIES, ALL_CEFR, ALL_POS, searchDictionary } from '../data/dictionaryData';
import { WordDetail } from './WordDetail';
import { speakWord, playTone } from '../utils/speech';
import { AppSettings, addSearchHistory, getSearchHistory } from '../utils/storage';

interface DictionaryViewProps {
  allWords: DictionaryEntry[];
  selectedWord: DictionaryEntry | null;
  onSelectWord: (word: DictionaryEntry) => void;
  favorites: string[];
  onToggleFavorite: (wordId: string) => void;
  onPracticeWord: (word: DictionaryEntry) => void;
  settings: AppSettings;
  customLists: string[];
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  allWords,
  selectedWord,
  onSelectWord,
  favorites,
  onToggleFavorite,
  onPracticeWord,
  settings,
  customLists
}) => {
  const [query, setQuery] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<'all' | Language>('all');
  const [selectedCefr, setSelectedCefr] = useState<'all' | CefrLevel>('all');
  const [selectedPos, setSelectedPos] = useState<'all' | PosType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'der' | 'die' | 'das'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const historyList = useMemo(() => getSearchHistory(), [query]);

  const isDark = settings.darkMode;

  // Execute high speed search filter
  const filteredWords = useMemo(() => {
    let results = searchDictionary(
      query,
      sourceLang,
      selectedCefr,
      selectedPos,
      selectedCategory,
      selectedGender,
      300
    );

    if (favoritesOnly) {
      results = results.filter(w => favorites.includes(w.id));
    }

    return results;
  }, [query, sourceLang, selectedCefr, selectedPos, selectedCategory, selectedGender, favoritesOnly, favorites]);

  // Set default selected word if none selected
  useEffect(() => {
    if (!selectedWord && filteredWords.length > 0) {
      onSelectWord(filteredWords[0]);
    }
  }, [filteredWords, selectedWord, onSelectWord]);

  // Save history on search submit
  const handleSearchCommit = (q: string) => {
    if (q.trim().length >= 2) {
      addSearchHistory(q);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredWords.length === 0) return;
    const currentIndex = selectedWord ? filteredWords.findIndex(w => w.id === selectedWord.id) : 0;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(filteredWords.length - 1, currentIndex + 1);
      onSelectWord(filteredWords[nextIndex]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(0, currentIndex - 1);
      onSelectWord(filteredWords[prevIndex]);
    }
  };

  const handleQuickSpeak = (e: React.MouseEvent, word: DictionaryEntry) => {
    e.stopPropagation();
    if (settings.soundEffects) playTone('click');
    setSpeakingId(word.id);
    speakWord(word.en, 'en', {
      rate: settings.voiceSpeed,
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  };

  return (
    <div id="dictionary-view-main" className={`h-full flex flex-col overflow-hidden transition-colors ${
      isDark ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'
    }`} onKeyDown={handleKeyDown}>
      {/* Top Search & Filter Bar */}
      <div className={`p-4 border-b transition-colors ${
        isDark
          ? 'bg-[#121212] border-[#222]'
          : 'bg-white border-[#E8E8E2] shadow-2xs'
      } shrink-0 space-y-3`}>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'
            }`} />
            <input
              ref={searchInputRef}
              id="main-dictionary-search-input"
              type="text"
              placeholder="Search 10,000+ words in English, Uzbek (salom...), or German (hallo)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchCommit(query);
              }}
              className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm transition outline-hidden border ${
                isDark
                  ? 'bg-[#1A1A1A] border-[#2E2E2E] focus:border-[#D4AF37] text-[#F5F5F5] placeholder-[#737373]'
                  : 'bg-[#F9F9F7] border-[#E0E0D8] focus:border-[#8C701E] focus:bg-white text-[#1A1A1A] placeholder-[#888]'
              }`}
            />
            {query && (
              <button
                id="btn-clear-query"
                onClick={() => setQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-[#737373] hover:text-[#E5E5E5]' : 'text-[#999] hover:text-[#111]'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Language Direction Toggle */}
          <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
            <div className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-[#F0F0EA] border-[#E0E0D8]'
            }`}>
              <button
                id="lang-filter-all"
                onClick={() => setSourceLang('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  sourceLang === 'all'
                    ? isDark ? 'bg-[#D4AF37] text-black shadow-xs' : 'bg-white text-[#111] shadow-xs'
                    : isDark ? 'text-[#A3A3A3] hover:text-[#E5E5E5]' : 'text-[#666] hover:text-[#111]'
                }`}
              >
                All
              </button>
              <button
                id="lang-filter-en"
                onClick={() => setSourceLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  sourceLang === 'en'
                    ? isDark ? 'bg-[#D4AF37] text-black shadow-xs' : 'bg-blue-600 text-white shadow-xs'
                    : isDark ? 'text-[#A3A3A3] hover:text-[#E5E5E5]' : 'text-[#666] hover:text-[#111]'
                }`}
              >
                EN
              </button>
              <button
                id="lang-filter-uz"
                onClick={() => setSourceLang('uz')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  sourceLang === 'uz'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isDark ? 'text-[#A3A3A3] hover:text-[#E5E5E5]' : 'text-[#666] hover:text-[#111]'
                }`}
              >
                UZ
              </button>
              <button
                id="lang-filter-de"
                onClick={() => setSourceLang('de')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  sourceLang === 'de'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : isDark ? 'text-[#A3A3A3] hover:text-[#E5E5E5]' : 'text-[#666] hover:text-[#111]'
                }`}
              >
                DE
              </button>
            </div>

            {/* Filter Toggle Button */}
            <button
              id="btn-toggle-filter-panel"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition ${
                showFilters || selectedCefr !== 'all' || selectedPos !== 'all' || selectedCategory !== 'all' || selectedGender !== 'all' || favoritesOnly
                  ? isDark
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#D4AF37]'
                    : 'bg-[#FFF9E6] border-[#D4AF37]/50 text-[#8C701E]'
                  : isDark
                    ? 'bg-[#1A1A1A] border-[#2E2E2E] text-[#A3A3A3] hover:bg-[#222]'
                    : 'bg-white border-[#E0E0D8] text-[#4A4A4A] hover:bg-[#F2F2EC]'
              }`}
            >
              <SlidersHorizontal className={`w-3.5 h-3.5 ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`} />
              <span className="hidden sm:inline font-serif">Filters</span>
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filter Panel */}
        {showFilters && (
          <div className={`p-3.5 rounded-xl border grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs animate-in fade-in duration-200 ${
            isDark
              ? 'bg-[#181818] border-[#2A2A2A]'
              : 'bg-[#F6F6F2] border-[#E2E2DA]'
          }`}>
            {/* CEFR Level */}
            <div>
              <label className="block text-[10px] font-bold text-[#888] uppercase mb-1 font-serif">CEFR Level</label>
              <select
                id="filter-select-cefr"
                value={selectedCefr}
                onChange={(e) => setSelectedCefr(e.target.value as 'all' | CefrLevel)}
                className={`w-full p-1.5 rounded-lg border text-xs ${
                  isDark ? 'bg-[#222] border-[#333] text-[#E5E5E5]' : 'bg-white border-[#DCDCD4] text-[#222]'
                }`}
              >
                <option value="all">All Levels</option>
                {ALL_CEFR.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>

            {/* Part of Speech */}
            <div>
              <label className="block text-[10px] font-bold text-[#888] uppercase mb-1 font-serif">Part of Speech</label>
              <select
                id="filter-select-pos"
                value={selectedPos}
                onChange={(e) => setSelectedPos(e.target.value as 'all' | PosType)}
                className={`w-full p-1.5 rounded-lg border text-xs ${
                  isDark ? 'bg-[#222] border-[#333] text-[#E5E5E5]' : 'bg-white border-[#DCDCD4] text-[#222]'
                }`}
              >
                <option value="all">All Types</option>
                {ALL_POS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
              </select>
            </div>

            {/* German Gender */}
            <div>
              <label className="block text-[10px] font-bold text-[#888] uppercase mb-1 font-serif">German Gender</label>
              <select
                id="filter-select-gender"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value as 'all' | 'der' | 'die' | 'das')}
                className={`w-full p-1.5 rounded-lg border text-xs ${
                  isDark ? 'bg-[#222] border-[#333] text-[#E5E5E5]' : 'bg-white border-[#DCDCD4] text-[#222]'
                }`}
              >
                <option value="all">All (der/die/das)</option>
                <option value="der">der (Masculine)</option>
                <option value="die">die (Feminine)</option>
                <option value="das">das (Neuter)</option>
              </select>
            </div>

            {/* Category / Topic */}
            <div>
              <label className="block text-[10px] font-bold text-[#888] uppercase mb-1 font-serif">Topic / Domain</label>
              <select
                id="filter-select-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full p-1.5 rounded-lg border text-xs ${
                  isDark ? 'bg-[#222] border-[#333] text-[#E5E5E5]' : 'bg-white border-[#DCDCD4] text-[#222]'
                }`}
              >
                <option value="all">All Topics</option>
                {ALL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Favorites Toggle */}
            <div className="flex flex-col justify-end">
              <button
                id="filter-toggle-favorites"
                onClick={() => setFavoritesOnly(!favoritesOnly)}
                className={`w-full p-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  favoritesOnly
                    ? isDark ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold' : 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold'
                    : isDark
                      ? 'bg-[#222] border-[#333] text-[#A3A3A3]'
                      : 'bg-white border-[#DCDCD4] text-[#4A4A4A]'
                }`}
              >
                <Star className={`w-3 h-3 ${favoritesOnly ? 'fill-black' : isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`} />
                <span>Favorites Only</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick history search chips */}
        {!query && historyList.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar pt-0.5">
            <span className="text-[#888] shrink-0 font-serif italic">Recent:</span>
            {historyList.slice(0, 6).map((term, i) => (
              <button
                key={i}
                onClick={() => setQuery(term)}
                className={`px-2.5 py-0.5 rounded-md border shrink-0 transition ${
                  isDark
                    ? 'bg-[#1C1C1C] hover:bg-[#252525] border-[#2E2E2E] hover:border-[#D4AF37]/40 text-[#A3A3A3] hover:text-[#E5E5E5]'
                    : 'bg-[#F0F0EA] hover:bg-[#E5E5DE] border-[#DDD] text-[#444] hover:text-[#111]'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area: Split View Desktop Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left List Pane */}
        <div
          ref={listContainerRef}
          id="dictionary-words-list"
          className={`w-full md:w-80 lg:w-96 border-r overflow-y-auto shrink-0 transition-colors ${
            isDark
              ? 'border-[#222] bg-[#0E0E0E]'
              : 'border-[#E8E8E2] bg-white'
          }`}
        >
          {/* Result Count Banner */}
          <div className={`px-4 py-2 flex items-center justify-between text-[11px] border-b sticky top-0 backdrop-blur-xs z-10 font-mono ${
            isDark
              ? 'border-[#1F1F1F] bg-[#0E0E0E]/90 text-[#737373]'
              : 'border-[#EAEAE2] bg-white/90 text-[#666]'
          }`}>
            <span>Showing {filteredWords.length} entries</span>
            <span className={`text-[10px] font-semibold ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`}>Offline Ready</span>
          </div>

          {filteredWords.length === 0 ? (
            <div className="p-8 text-center text-[#888] space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-[#666]" />
              <p className={`text-xs font-semibold ${isDark ? 'text-[#A3A3A3]' : 'text-[#333]'}`}>No words found</p>
              <p className="text-[11px]">Try adjusting your search terms or filter criteria.</p>
            </div>
          ) : (
            <div className={`divide-y ${isDark ? 'divide-[#1A1A1A]' : 'divide-[#F0F0EA]'}`}>
              {filteredWords.map((item) => {
                const isSelected = selectedWord?.id === item.id;
                const isFav = favorites.includes(item.id);
                return (
                  <div
                    key={item.id}
                    id={`word-item-${item.id}`}
                    onClick={() => onSelectWord(item)}
                    className={`p-3.5 cursor-pointer transition flex items-center justify-between group ${
                      isSelected
                        ? isDark
                          ? 'bg-[#1C1C1C] border-l-4 border-[#D4AF37] text-[#F5F5F5]'
                          : 'bg-[#FFF9E6] border-l-4 border-[#D4AF37] text-[#1F1F1F]'
                        : isDark
                          ? 'hover:bg-[#141414] text-[#D4D4D4]'
                          : 'hover:bg-[#F7F7F2] text-[#2C2C2C]'
                    }`}
                  >
                    <div className="min-w-0 pr-2 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-serif font-bold text-xs sm:text-sm tracking-wide truncate ${
                          isDark ? 'text-[#F0F0F0]' : 'text-[#111827]'
                        }`}>
                          {item.en}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${
                          isDark ? 'bg-[#1F1F1F] text-[#D4AF37] border-[#333]' : 'bg-[#F2F2EC] text-[#8C701E] border-[#DDD]'
                        }`}>
                          {item.cefr}
                        </span>
                      </div>

                      {/* Uzbek & German preview line */}
                      <div className="text-[11px] truncate flex items-center gap-1.5 font-sans">
                        <span className="text-emerald-500 font-medium truncate">
                          {item.uz}
                        </span>
                        <span className="text-[#666]">•</span>
                        <span className="text-amber-500 font-medium truncate">
                          {item.deGender ? `${item.deGender} ` : ''}{item.de}
                        </span>
                      </div>
                    </div>

                    {/* Quick Pronounce & Star buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleQuickSpeak(e, item)}
                        className={`p-1.5 rounded-md transition ${
                          speakingId === item.id
                            ? 'bg-[#D4AF37] text-black animate-pulse'
                            : isDark
                              ? 'text-[#737373] hover:text-[#D4AF37] hover:bg-[#202020]'
                              : 'text-[#888] hover:text-[#8C701E] hover:bg-[#EAEAE2]'
                        }`}
                        title="Pronounce Word"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (settings.soundEffects) playTone('click');
                          onToggleFavorite(item.id);
                        }}
                        className={`p-1.5 rounded-md transition ${
                          isFav
                            ? isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'
                            : isDark ? 'text-[#444] hover:text-[#D4AF37]' : 'text-[#BBB] hover:text-[#8C701E]'
                        }`}
                        title={isFav ? 'Favorited' : 'Add to Favorites'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? (isDark ? 'fill-[#D4AF37]' : 'fill-[#8C701E]') : ''}`} />
                      </button>

                      <ChevronRight className={`w-4 h-4 ${
                        isSelected 
                          ? isDark ? 'opacity-100 text-[#D4AF37]' : 'opacity-100 text-[#8C701E]'
                          : 'opacity-0 group-hover:opacity-100 text-[#888]'
                      } transition`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail Pane */}
        <div id="dictionary-detail-pane" className={`flex-1 hidden md:block overflow-hidden transition-colors ${
          isDark ? 'bg-[#0A0A0A]' : 'bg-[#F9F9F7]'
        }`}>
          <WordDetail
            word={selectedWord}
            isFavorited={selectedWord ? favorites.includes(selectedWord.id) : false}
            onToggleFavorite={onToggleFavorite}
            onPracticeWord={onPracticeWord}
            settings={settings}
            customLists={customLists}
          />
        </div>
      </div>
    </div>
  );
};
