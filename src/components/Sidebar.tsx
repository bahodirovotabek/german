import React from 'react';
import { 
  BookOpen, 
  Layers, 
  BrainCircuit, 
  Star, 
  TableProperties, 
  Settings as SettingsIcon, 
  Sparkles,
  Flame,
  Award
} from 'lucide-react';
import { ViewMode, StudyStats } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  favoritesCount: number;
  studyStats: StudyStats;
  onOpenWordOfTheDay: () => void;
  onOpenSettings: () => void;
  isDarkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  favoritesCount,
  studyStats,
  onOpenWordOfTheDay,
  onOpenSettings,
  isDarkMode,
}) => {
  const navItems: Array<{
    id: ViewMode;
    label: string;
    uzLabel: string;
    deLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }> = [
    {
      id: 'dictionary',
      label: 'Dictionary',
      uzLabel: 'Lug‘at',
      deLabel: 'Wörterbuch',
      icon: BookOpen,
      badge: '10k+'
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      uzLabel: 'Kartochkalar',
      deLabel: 'Karteikarten',
      icon: Layers,
      badge: 'SRS'
    },
    {
      id: 'quiz',
      label: 'Quiz & Practice',
      uzLabel: 'Viktorina',
      deLabel: 'Quiz & Übung',
      icon: BrainCircuit,
    },
    {
      id: 'favorites',
      label: 'Favorites',
      uzLabel: 'Sevimlilar',
      deLabel: 'Favoriten',
      icon: Star,
      badge: favoritesCount > 0 ? favoritesCount : undefined
    },
    {
      id: 'grammar',
      label: 'Grammar Tables',
      uzLabel: 'Grammatika',
      deLabel: 'Grammatik',
      icon: TableProperties,
    }
  ];

  return (
    <aside
      id="app-sidebar"
      className={`w-64 flex flex-col justify-between border-r shrink-0 select-none transition-colors ${
        isDarkMode
          ? 'bg-[#0D0D0D] border-[#222] text-[#D4D4D4]'
          : 'bg-[#F9F9F7] border-[#E8E8E2] text-[#2C2C2C]'
      } backdrop-blur-md`}
    >
      {/* Top Section: Navigation Links */}
      <div className="p-3 space-y-4">
        {/* Daily Streak & Retention Widget */}
        <div className={`p-3 rounded-xl border ${
          isDarkMode
            ? 'bg-[#141414] border-[#262626]'
            : 'bg-white border-[#E5E5DE] shadow-2xs'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#D4AF37]">
              <Flame className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              <span>{studyStats.streakDays} Day Streak</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-medium">
              Daily Goal
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#A3A3A3] mb-1.5 font-medium">
            <span>Words Studied</span>
            <span className="font-semibold text-[#E5E5E5] dark:text-[#F5F5F5]">{studyStats.wordsLearned}</span>
          </div>

          <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(15, (studyStats.wordsLearned % 30) * 3.33))}%` }}
            />
          </div>
        </div>

        {/* Navigation List */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#737373]">
            Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? isDarkMode
                      ? 'bg-[#1A1A1A] text-[#F3E5AB] border border-[#D4AF37]/50 shadow-xs'
                      : 'bg-[#FFF9E6] text-[#8C701E] border border-[#D4AF37]/40 shadow-2xs'
                    : isDarkMode
                      ? 'hover:bg-[#141414] text-[#A3A3A3] hover:text-[#E5E5E5] border border-transparent'
                      : 'hover:bg-[#F0F0EA] text-[#4A4A4A] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? (isDarkMode ? 'text-[#D4AF37]' : 'text-[#8C701E]') : 'text-[#737373]'}`} />
                  <div className="text-left font-serif">
                    <div className="tracking-wide">{item.label}</div>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                    isActive
                      ? isDarkMode
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                        : 'bg-[#D4AF37]/20 text-[#8C701E]'
                      : isDarkMode
                        ? 'bg-[#1E1E1E] text-[#737373]'
                        : 'bg-[#EAEAEA] text-[#737373]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Tools */}
        <div className="space-y-1 pt-2">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#737373]">
            Study Tools
          </p>

          <button
            id="nav-wotd-btn"
            onClick={onOpenWordOfTheDay}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
              isDarkMode
                ? 'hover:bg-[#141414] text-[#A3A3A3] hover:text-[#D4AF37]'
                : 'hover:bg-[#F0F0EA] text-[#4A4A4A]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-serif">Word of the Day</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Settings & Info */}
      <div className={`p-3 border-t ${
        isDarkMode ? 'border-[#222]' : 'border-[#E8E8E2]'
      } space-y-2`}>
        <button
          id="btn-open-settings"
          onClick={onOpenSettings}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
            isDarkMode
              ? 'hover:bg-[#141414] text-[#A3A3A3] hover:text-[#E5E5E5]'
              : 'hover:bg-[#F0F0EA] text-[#4A4A4A]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <SettingsIcon className="w-4 h-4 text-[#737373]" />
            <span className="font-serif">Settings & Speech</span>
          </div>
        </button>

        <div className="px-3 py-1 flex items-center justify-between text-[10px] text-[#737373]">
          <span>Windows Offline App</span>
          <span className="font-mono text-[#D4AF37]/80">v1.2.0</span>
        </div>
      </div>
    </aside>
  );
};
