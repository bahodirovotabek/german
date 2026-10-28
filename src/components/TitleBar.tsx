import React from 'react';
import { BookOpen, Moon, Sun, Search, Sparkles, Volume2, Minus, Square, X, WifiOff } from 'lucide-react';
import { AppSettings } from '../utils/storage';

interface TitleBarProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenSearch: () => void;
  onOpenWordOfTheDay: () => void;
  totalWordsCount: number;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  settings,
  onUpdateSettings,
  onOpenSearch,
  onOpenWordOfTheDay,
  totalWordsCount
}) => {
  const toggleDark = () => {
    onUpdateSettings({
      ...settings,
      darkMode: !settings.darkMode
    });
  };

  return (
    <header
      id="windows-titlebar"
      className={`h-11 select-none flex items-center justify-between px-3 border-b transition-colors ${
        settings.darkMode
          ? 'bg-[#0F0F0F]/95 border-[#222] text-[#E5E5E5]'
          : 'bg-[#FDFCFA]/95 border-[#E5E5E0] text-[#1F1F1F]'
      } backdrop-blur-md sticky top-0 z-50`}
    >
      {/* Left: App Logo, Title & Offline Badge */}
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#D4AF37] to-[#997A15] flex items-center justify-center text-black shadow-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-[#0A0A0A]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-xs tracking-wide text-[#E5E5E5] dark:text-[#F3E5AB]">
            Trilingual Dict
          </span>
          <span className="text-[10px] text-[#A3A3A3] font-mono hidden sm:inline tracking-wider">
            EN · UZ · DE
          </span>
        </div>

        {/* Offline Ready Badge */}
        <div className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
          settings.darkMode
            ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
            : 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#8C701E]'
        }`}>
          <WifiOff className="w-2.5 h-2.5 text-[#D4AF37]" />
          <span>{totalWordsCount.toLocaleString()}+ Words Offline</span>
        </div>
      </div>

      {/* Center: Quick search shortcut & Word of day */}
      <div className="flex items-center gap-1.5">
        <button
          id="btn-quick-search-header"
          onClick={onOpenSearch}
          className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs transition border ${
            settings.darkMode
              ? 'bg-[#181818] border-[#2A2A2A] hover:border-[#D4AF37]/50 hover:bg-[#202020] text-[#A3A3A3]'
              : 'bg-white border-[#E0E0D8] hover:bg-[#F5F5F0] text-[#4A4A4A] shadow-2xs'
          }`}
          title="Quick Search (Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="hidden sm:inline">Quick Search...</span>
          <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
            settings.darkMode ? 'bg-[#262626] text-[#D4AF37]' : 'bg-[#EAEAEA] text-[#333]'
          }`}>
            Ctrl K
          </kbd>
        </button>

        <button
          id="btn-word-of-day"
          onClick={onOpenWordOfTheDay}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
            settings.darkMode
              ? 'hover:bg-[#1C1C1C] text-[#D4AF37] border border-transparent hover:border-[#D4AF37]/30'
              : 'hover:bg-[#FFF9E6] text-[#8C701E]'
          }`}
          title="Word of the Day"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
          <span className="hidden lg:inline text-[11px] font-serif">Word of the Day</span>
        </button>
      </div>

      {/* Right: Theme Toggle & Windows Mock Window Controls */}
      <div className="flex items-center gap-2">
        <button
          id="btn-theme-toggle"
          onClick={toggleDark}
          aria-label="Toggle Dark Mode"
          className={`p-1.5 rounded-md transition ${
            settings.darkMode
              ? 'hover:bg-[#1E1E1E] text-[#D4AF37]'
              : 'hover:bg-[#EAEAE0] text-[#4A4A4A]'
          }`}
          title={settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {settings.darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Mock Windows 11 Title Bar Controls for Desktop Feel */}
        <div className="hidden sm:flex items-center ml-1 border-l pl-2 border-[#282828] dark:border-[#282828]">
          <button
            id="mock-win-minimize"
            className="w-7 h-7 flex items-center justify-center rounded text-[#737373] hover:bg-[#202020] hover:text-[#E5E5E5] transition text-xs"
            title="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            id="mock-win-maximize"
            className="w-7 h-7 flex items-center justify-center rounded text-[#737373] hover:bg-[#202020] hover:text-[#E5E5E5] transition text-xs"
            title="Maximize"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            id="mock-win-close"
            className="w-7 h-7 flex items-center justify-center rounded text-[#737373] hover:bg-rose-900/60 hover:text-rose-200 transition text-xs"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
