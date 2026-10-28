import { FavoriteItem, SrsProgress, StudyStats } from '../types';

const FAVORITES_KEY = 'trilingual_dict_favorites_v1';
const HISTORY_KEY = 'trilingual_dict_history_v1';
const SRS_KEY = 'trilingual_dict_srs_v1';
const STATS_KEY = 'trilingual_dict_stats_v1';
const SETTINGS_KEY = 'trilingual_dict_settings_v1';
const CUSTOM_LISTS_KEY = 'trilingual_dict_custom_lists_v1';

export interface AppSettings {
  darkMode: boolean;
  themeStyle: 'slate' | 'zinc' | 'nord';
  voiceSpeed: number;
  autoPronounce: boolean;
  soundEffects: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  defaultDirection: 'en-uz' | 'en-de' | 'uz-en' | 'de-en' | 'all';
  latinUzbek: boolean;
}

export const defaultSettings: AppSettings = {
  darkMode: false,
  themeStyle: 'slate',
  voiceSpeed: 0.95,
  autoPronounce: false,
  soundEffects: true,
  fontSize: 'md',
  defaultDirection: 'all',
  latinUzbek: true,
};

// Favorites
export function getStoredFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteItem[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
}

export function toggleFavorite(wordId: string, customList?: string): boolean {
  const list = getStoredFavorites();
  const index = list.findIndex(f => f.wordId === wordId);
  let isFav = false;

  if (index >= 0) {
    list.splice(index, 1);
    isFav = false;
  } else {
    list.push({
      wordId,
      addedAt: Date.now(),
      lists: customList ? [customList] : ['General']
    });
    isFav = true;
  }

  saveFavorites(list);
  return isFav;
}

export function isWordFavorited(wordId: string): boolean {
  const list = getStoredFavorites();
  return list.some(f => f.wordId === wordId);
}

// Custom Lists
export function getCustomLists(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LISTS_KEY);
    return raw ? JSON.parse(raw) : ['General', 'Travel Words', 'IELTS / Academic', 'German A2 Exam', 'Hard Words'];
  } catch {
    return ['General', 'Travel Words', 'IELTS / Academic', 'German A2 Exam', 'Hard Words'];
  }
}

export function saveCustomLists(lists: string[]): void {
  try {
    localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(lists));
  } catch (e) {
    console.error('Failed to save custom lists', e);
  }
}

// Search History
export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : ['hello', 'water', 'book', 'development', 'wichtig'];
  } catch {
    return [];
  }
}

export function addSearchHistory(query: string): void {
  if (!query || query.trim().length < 2) return;
  const list = getSearchHistory().filter(q => q.toLowerCase() !== query.toLowerCase());
  list.unshift(query.trim());
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 30)));
  } catch {}
}

export function clearSearchHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// SRS Flashcards
export function getSrsData(): Record<string, SrsProgress> {
  try {
    const raw = localStorage.getItem(SRS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updateSrsItem(wordId: string, rating: 'again' | 'hard' | 'good' | 'easy'): SrsProgress {
  const data = getSrsData();
  const current = data[wordId] || {
    wordId,
    box: 1,
    nextReviewDate: Date.now(),
    repetitions: 0,
    easeFactor: 2.5,
    intervalDays: 1,
  };

  let newBox = current.box;
  let nextInterval = 1;

  if (rating === 'again') {
    newBox = 1;
    nextInterval = 1;
  } else if (rating === 'hard') {
    newBox = Math.max(1, current.box);
    nextInterval = Math.max(1, Math.round(current.intervalDays * 1.2));
  } else if (rating === 'good') {
    newBox = Math.min(5, current.box + 1);
    nextInterval = Math.round(current.intervalDays * 2.5) || 3;
  } else if (rating === 'easy') {
    newBox = Math.min(5, current.box + 2);
    nextInterval = Math.round(current.intervalDays * 3.8) || 6;
  }

  const updated: SrsProgress = {
    wordId,
    box: newBox,
    repetitions: current.repetitions + 1,
    easeFactor: current.easeFactor,
    intervalDays: nextInterval,
    nextReviewDate: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
    lastReviewed: Date.now(),
  };

  data[wordId] = updated;
  try {
    localStorage.setItem(SRS_KEY, JSON.stringify(data));
  } catch {}

  // Update study stats
  incrementWordsStudied();
  return updated;
}

// Study Stats
export function getStudyStats(): StudyStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    const today = new Date().toISOString().slice(0, 10);
    if (!raw) {
      return {
        wordsLearned: 18,
        streakDays: 1,
        lastStudyDate: today,
        totalQuizzesTaken: 0,
        correctQuizAnswers: 0,
      };
    }
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return {
      wordsLearned: 18,
      streakDays: 1,
      lastStudyDate: new Date().toISOString().slice(0, 10),
      totalQuizzesTaken: 0,
      correctQuizAnswers: 0,
    };
  }
}

export function incrementWordsStudied(): void {
  const stats = getStudyStats();
  const today = new Date().toISOString().slice(0, 10);

  if (stats.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (stats.lastStudyDate === yesterday) {
      stats.streakDays += 1;
    } else {
      stats.streakDays = 1;
    }
    stats.lastStudyDate = today;
  }

  stats.wordsLearned += 1;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function recordQuizResult(correct: number, total: number): void {
  const stats = getStudyStats();
  stats.totalQuizzesTaken += 1;
  stats.correctQuizAnswers += correct;
  stats.wordsLearned += correct;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

// Settings
export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

// Backup / Export
export function exportUserDataJson(): string {
  const backup = {
    favorites: getStoredFavorites(),
    customLists: getCustomLists(),
    srs: getSrsData(),
    stats: getStudyStats(),
    settings: getStoredSettings(),
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(backup, null, 2);
}

export function importUserDataJson(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.favorites) localStorage.setItem(FAVORITES_KEY, JSON.stringify(parsed.favorites));
    if (parsed.customLists) localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(parsed.customLists));
    if (parsed.srs) localStorage.setItem(SRS_KEY, JSON.stringify(parsed.srs));
    if (parsed.stats) localStorage.setItem(STATS_KEY, JSON.stringify(parsed.stats));
    if (parsed.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed.settings));
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}
