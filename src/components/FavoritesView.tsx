import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Trash2, 
  Volume2, 
  Download, 
  Upload, 
  Layers, 
  BrainCircuit, 
  Plus, 
  Search,
  BookOpen,
  FolderHeart
} from 'lucide-react';
import { DictionaryEntry } from '../types';
import { speakWord, playTone } from '../utils/speech';
import { AppSettings, exportUserDataJson, importUserDataJson } from '../utils/storage';

interface FavoritesViewProps {
  allWords: DictionaryEntry[];
  favorites: string[];
  onToggleFavorite: (wordId: string) => void;
  onSelectWord: (word: DictionaryEntry) => void;
  onStartFlashcards: () => void;
  onStartQuiz: () => void;
  settings: AppSettings;
  customLists: string[];
  onAddCustomList: (name: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  allWords,
  favorites,
  onToggleFavorite,
  onSelectWord,
  onStartFlashcards,
  onStartQuiz,
  settings,
  customLists,
  onAddCustomList
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newListName, setNewListName] = useState<string>('');
  const [showAddList, setShowAddList] = useState<boolean>(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const isDark = settings.darkMode;

  // Map favorite IDs to full dictionary entries
  const favWords = useMemo(() => {
    return allWords.filter(w => favorites.includes(w.id));
  }, [allWords, favorites]);

  // Filtered favorite words
  const filteredFavs = useMemo(() => {
    if (!searchQuery.trim()) return favWords;
    const q = searchQuery.toLowerCase();
    return favWords.filter(w => 
      w.en.toLowerCase().includes(q) || 
      w.uz.toLowerCase().includes(q) || 
      w.de.toLowerCase().includes(q)
    );
  }, [favWords, searchQuery]);

  const handleSpeak = (e: React.MouseEvent, word: DictionaryEntry) => {
    e.stopPropagation();
    if (settings.soundEffects) playTone('click');
    setSpeakingId(word.id);
    speakWord(word.en, 'en', {
      rate: settings.voiceSpeed,
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  };

  const handleExport = () => {
    const dataStr = exportUserDataJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trilingual_dict_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (importUserDataJson(content)) {
        window.location.reload();
      }
    };
    reader.readAsText(file);
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onAddCustomList(newListName.trim());
      setNewListName('');
      setShowAddList(false);
    }
  };

  return (
    <div id="favorites-view-main" className={`h-full flex flex-col p-4 sm:p-6 overflow-y-auto max-w-5xl mx-auto w-full transition-colors ${
      isDark ? 'bg-[#0A0A0A] text-[#E5E5E5]' : 'bg-[#FAFAFA] text-[#1F1F1F]'
    }`}>
      {/* Top Banner & Study Actions */}
      <div className={`p-5 sm:p-6 rounded-2xl border mb-6 transition-colors ${
        isDark
          ? 'bg-[#141414] border-[#262626] shadow-xl'
          : 'bg-white border-[#E8E8E2] shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isDark ? 'bg-[#1E1E1E] border-[#333] text-[#D4AF37]' : 'bg-amber-50 border-amber-200 text-[#8C701E]'
            }`}>
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className={`text-xl font-serif font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
                Saved Vocabulary & Favorites
              </h2>
              <p className="text-xs text-[#888] font-serif">
                {favorites.length} essential words saved for Spaced Repetition and review.
              </p>
            </div>
          </div>

          {/* Quick Study buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-favorites-flashcards"
              onClick={onStartFlashcards}
              disabled={favorites.length === 0}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-serif font-bold transition shadow-xs ${
                favorites.length > 0
                  ? isDark ? 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black' : 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black'
                  : 'bg-[#222] text-[#666] cursor-not-allowed'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Practice Deck ({favorites.length})</span>
            </button>

            <button
              id="btn-favorites-quiz"
              onClick={onStartQuiz}
              disabled={favorites.length === 0}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-serif font-semibold transition ${
                favorites.length > 0
                  ? isDark
                    ? 'bg-[#1C1C1C] border-[#2E2E2E] text-[#D4AF37] hover:bg-[#252525]'
                    : 'bg-[#F9F9F7] border-[#DDD] text-[#8C701E] hover:bg-[#F0F0EA]'
                  : 'border-[#222] text-[#666] cursor-not-allowed'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Quiz Mode</span>
            </button>
          </div>
        </div>

        {/* Export & Import actions */}
        <div className={`mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'border-[#222]' : 'border-[#E8E8E2]'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                isDark ? 'bg-[#1C1C1C] border-[#2E2E2E] text-[#A3A3A3] hover:text-[#E5E5E5]' : 'bg-[#F5F5F0] border-[#DDD] text-[#555] hover:text-[#111]'
              }`}
              title="Backup saved words to JSON file"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Backup Data</span>
            </button>

            <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer transition ${
              isDark ? 'bg-[#1C1C1C] border-[#2E2E2E] text-[#A3A3A3] hover:text-[#E5E5E5]' : 'bg-[#F5F5F0] border-[#DDD] text-[#555] hover:text-[#111]'
            }`}>
              <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Restore Backup</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <div className="text-[11px] text-[#888] font-mono">
            Encrypted Offline Storage
          </div>
        </div>
      </div>

      {/* Filter and Search within Favorites */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`} />
          <input
            type="text"
            placeholder="Search saved vocabulary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm outline-hidden border transition ${
              isDark
                ? 'bg-[#141414] border-[#262626] focus:border-[#D4AF37] text-[#F5F5F5] placeholder-[#737373]'
                : 'bg-white border-[#E0E0D8] focus:border-[#8C701E] text-[#111] placeholder-[#888]'
            }`}
          />
        </div>
      </div>

      {/* Word Cards Grid */}
      {filteredFavs.length === 0 ? (
        <div className={`p-12 rounded-3xl border text-center space-y-3 my-auto transition-colors ${
          isDark ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E8E8E2]'
        }`}>
          <FolderHeart className="w-12 h-12 mx-auto text-[#666]" />
          <h3 className={`text-base font-serif font-bold ${isDark ? 'text-[#E5E5E5]' : 'text-[#111827]'}`}>
            No saved words found
          </h3>
          <p className="text-xs text-[#888] max-w-sm mx-auto">
            Click the star icon next to any word in the Dictionary to add it to your personal favorites list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFavs.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectWord(item)}
              className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between group ${
                isDark
                  ? 'bg-[#141414] border-[#262626] hover:border-[#D4AF37]/40 hover:bg-[#1A1A1A]'
                  : 'bg-white border-[#E8E8E2] hover:border-[#D4AF37] hover:bg-[#FDFCFA] shadow-xs'
              }`}
            >
              <div className="space-y-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className={`font-serif font-bold text-sm truncate ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
                    {item.en}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${
                    isDark ? 'bg-[#1E1E1E] text-[#D4AF37] border-[#333]' : 'bg-[#F2F2EC] text-[#8C701E] border-[#DDD]'
                  }`}>
                    {item.cefr}
                  </span>
                </div>

                <div className="text-xs truncate flex items-center gap-2 font-serif">
                  <span className="text-emerald-500 font-medium truncate">
                    {item.uz}
                  </span>
                  <span className="text-[#666]">•</span>
                  <span className="text-amber-500 font-medium truncate">
                    {item.deGender ? `${item.deGender} ` : ''}{item.de}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => handleSpeak(e, item)}
                  className={`p-2 rounded-lg transition ${
                    speakingId === item.id
                      ? 'bg-[#D4AF37] text-black animate-pulse'
                      : isDark
                        ? 'text-[#737373] hover:text-[#D4AF37] hover:bg-[#222]'
                        : 'text-[#888] hover:text-[#8C701E] hover:bg-[#F0F0EA]'
                  }`}
                  title="Pronounce Word"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (settings.soundEffects) playTone('click');
                    onToggleFavorite(item.id);
                  }}
                  className={`p-2 rounded-lg transition ${
                    isDark
                      ? 'text-[#D4AF37] hover:text-rose-400 hover:bg-[#222]'
                      : 'text-[#8C701E] hover:text-rose-600 hover:bg-[#F0F0EA]'
                  }`}
                  title="Remove from Favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
