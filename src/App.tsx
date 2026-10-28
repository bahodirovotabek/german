/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TitleBar } from './components/TitleBar';
import { Sidebar } from './components/Sidebar';
import { DictionaryView } from './components/DictionaryView';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { FavoritesView } from './components/FavoritesView';
import { GrammarTablesView } from './components/GrammarTablesView';
import { WordOfTheDayModal } from './components/WordOfTheDayModal';
import { SettingsModal } from './components/SettingsModal';
import { FULL_DICTIONARY } from './data/dictionaryData';
import { DictionaryEntry, ViewMode } from './types';
import { 
  getStoredFavorites, 
  toggleFavorite, 
  getStudyStats, 
  getStoredSettings, 
  saveStoredSettings, 
  getCustomLists, 
  saveCustomLists,
  AppSettings
} from './utils/storage';
import { Menu, X, BookOpen, Layers, BrainCircuit, Star, TableProperties } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [currentView, setCurrentView] = useState<ViewMode>('dictionary');
  const [favoritesList, setFavoritesList] = useState<string[]>(() => {
    return getStoredFavorites().map(f => f.wordId);
  });
  const [customLists, setCustomLists] = useState<string[]>(() => getCustomLists());
  const [studyStats, setStudyStats] = useState(() => getStudyStats());
  const [selectedWord, setSelectedWord] = useState<DictionaryEntry | null>(() => FULL_DICTIONARY[0] || null);
  const [isWotdOpen, setIsWotdOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [practiceWord, setPracticeWord] = useState<DictionaryEntry | null>(null);

  // Sync dark mode class on HTML document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveStoredSettings(settings);
  }, [settings]);

  // Global Keyboard Shortcuts (Ctrl+K to focus search, etc.)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCurrentView('dictionary');
        const input = document.getElementById('main-dictionary-search-input');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const handleToggleFavorite = (wordId: string) => {
    toggleFavorite(wordId);
    setFavoritesList(getStoredFavorites().map(f => f.wordId));
  };

  const handleAddCustomList = (name: string) => {
    const nextLists = Array.from(new Set([...customLists, name]));
    setCustomLists(nextLists);
    saveCustomLists(nextLists);
  };

  const handlePracticeWord = (word: DictionaryEntry) => {
    setPracticeWord(word);
    setCurrentView('flashcards');
  };

  // Word of the Day (seeded by day of year for consistency)
  const wordOfTheDay = useMemo(() => {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = Math.abs(dayOfYear * 17) % FULL_DICTIONARY.length;
    return FULL_DICTIONARY[index] || FULL_DICTIONARY[0];
  }, []);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none antialiased ${
      settings.darkMode ? 'bg-[#0A0A0A] text-[#E5E5E5]' : 'bg-[#F7F7F6] text-[#1A1A1A]'
    }`}>
      {/* 1. Windows 11 Fluent Style Title Bar */}
      <TitleBar
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenSearch={() => {
          setCurrentView('dictionary');
          setTimeout(() => {
            document.getElementById('main-dictionary-search-input')?.focus();
          }, 100);
        }}
        onOpenWordOfTheDay={() => setIsWotdOpen(true)}
        totalWordsCount={FULL_DICTIONARY.length}
      />

      {/* Mobile Top Navigation Toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-[#222] bg-[#0F0F0F]/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-[#333] text-[#A3A3A3] hover:text-[#D4AF37]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <span className="font-bold text-xs capitalize text-[#E5E5E5] font-serif">{currentView}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-semibold text-[10px]">
            {FULL_DICTIONARY.length.toLocaleString()}+ Words Offline
          </span>
        </div>
      </div>

      {/* Main App Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            currentView={currentView}
            onSelectView={(v) => {
              setCurrentView(v);
              setStudyStats(getStudyStats());
            }}
            favoritesCount={favoritesList.length}
            studyStats={studyStats}
            onOpenWordOfTheDay={() => setIsWotdOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isDarkMode={settings.darkMode}
          />
        </div>

        {/* Mobile Slide-over Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-xs flex">
            <div className="w-64 h-full bg-[#0F0F0F] border-r border-[#222] shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col justify-between">
              <Sidebar
                currentView={currentView}
                onSelectView={(v) => {
                  setCurrentView(v);
                  setMobileMenuOpen(false);
                  setStudyStats(getStudyStats());
                }}
                favoritesCount={favoritesList.length}
                studyStats={studyStats}
                onOpenWordOfTheDay={() => {
                  setIsWotdOpen(true);
                  setMobileMenuOpen(false);
                }}
                onOpenSettings={() => {
                  setIsSettingsOpen(true);
                  setMobileMenuOpen(false);
                }}
                isDarkMode={settings.darkMode}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* View Switcher Container */}
        <main id="app-main-content-viewport" className={`flex-1 h-full overflow-hidden transition-colors ${
          settings.darkMode ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'
        }`}>
          {currentView === 'dictionary' && (
            <DictionaryView
              allWords={FULL_DICTIONARY}
              selectedWord={selectedWord}
              onSelectWord={setSelectedWord}
              favorites={favoritesList}
              onToggleFavorite={handleToggleFavorite}
              onPracticeWord={handlePracticeWord}
              settings={settings}
              customLists={customLists}
            />
          )}

          {currentView === 'flashcards' && (
            <FlashcardsView
              allWords={FULL_DICTIONARY}
              favorites={favoritesList}
              onToggleFavorite={handleToggleFavorite}
              settings={settings}
              initialWord={practiceWord}
            />
          )}

          {currentView === 'quiz' && (
            <QuizView
              allWords={FULL_DICTIONARY}
              favorites={favoritesList}
              settings={settings}
            />
          )}

          {currentView === 'favorites' && (
            <FavoritesView
              allWords={FULL_DICTIONARY}
              favorites={favoritesList}
              onToggleFavorite={handleToggleFavorite}
              onSelectWord={(word) => {
                setSelectedWord(word);
                setCurrentView('dictionary');
              }}
              onStartFlashcards={() => setCurrentView('flashcards')}
              onStartQuiz={() => setCurrentView('quiz')}
              settings={settings}
              customLists={customLists}
              onAddCustomList={handleAddCustomList}
            />
          )}

          {currentView === 'grammar' && (
            <GrammarTablesView settings={settings} />
          )}
        </main>
      </div>

      {/* Word of the Day Modal */}
      <WordOfTheDayModal
        isOpen={isWotdOpen}
        onClose={() => setIsWotdOpen(false)}
        word={wordOfTheDay}
        isFavorited={favoritesList.includes(wordOfTheDay.id)}
        onToggleFavorite={handleToggleFavorite}
        onPracticeWord={handlePracticeWord}
        settings={settings}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
