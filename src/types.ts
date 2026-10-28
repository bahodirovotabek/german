export type Language = 'en' | 'uz' | 'de';

export type PosType = 
  | 'noun' 
  | 'verb' 
  | 'adjective' 
  | 'adverb' 
  | 'phrase' 
  | 'preposition' 
  | 'conjunction' 
  | 'pronoun' 
  | 'numeral' 
  | 'interjection';

export type GermanGender = 'der' | 'die' | 'das' | 'plural' | null;

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface DictionaryEntry {
  id: string;
  en: string;
  uz: string;
  de: string;
  deGender: GermanGender;
  pos: PosType;
  cefr: CefrLevel;
  category: string;
  ipaEn?: string;
  ipaDe?: string;
  exampleEn?: string;
  exampleUz?: string;
  exampleDe?: string;
  synonymsEn?: string[];
  synonymsUz?: string[];
  synonymsDe?: string[];
  pluralDe?: string;
  pluralUz?: string;
  pluralEn?: string;
  notes?: string;
}

export interface FavoriteItem {
  wordId: string;
  addedAt: number;
  lists?: string[]; // Custom collection tags
  notes?: string;
}

export interface SrsProgress {
  wordId: string;
  box: number; // 1 to 5
  nextReviewDate: number;
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  lastReviewed?: number;
}

export interface StudyStats {
  wordsLearned: number;
  streakDays: number;
  lastStudyDate: string;
  totalQuizzesTaken: number;
  correctQuizAnswers: number;
}

export type ViewMode = 'dictionary' | 'flashcards' | 'quiz' | 'favorites' | 'grammar' | 'stats';

export interface SearchFilter {
  query: string;
  sourceLang: 'all' | Language;
  targetLang: 'all' | Language;
  cefr: 'all' | CefrLevel;
  pos: 'all' | PosType;
  category: 'all' | string;
  gender: 'all' | 'der' | 'die' | 'das';
  favoritesOnly: boolean;
}

export interface QuizQuestion {
  word: DictionaryEntry;
  questionLang: Language;
  targetLang: Language;
  options: string[];
  correctAnswer: string;
  type: 'multiple_choice' | 'spelling' | 'match';
}
