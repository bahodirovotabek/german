import React from 'react';
import { Settings, X, Volume2, Moon, Sun, VolumeX, RotateCcw, ShieldCheck, Laptop } from 'lucide-react';
import { AppSettings, defaultSettings } from '../utils/storage';
import { playTone } from '../utils/speech';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const isDark = settings.darkMode;

  const handleSpeedChange = (rate: number) => {
    onUpdateSettings({ ...settings, voiceSpeed: rate });
  };

  const handleThemeToggle = () => {
    onUpdateSettings({ ...settings, darkMode: !settings.darkMode });
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all settings to default values?')) {
      onUpdateSettings(defaultSettings);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
        isDark
          ? 'bg-[#141414] border-[#262626] text-[#E5E5E5]'
          : 'bg-white border-[#E5E5DE] text-[#1F1F1F]'
      }`}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? 'border-[#222]' : 'border-[#E8E8E2]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isDark ? 'bg-[#1C1C1C] border-[#2E2E2E] text-[#D4AF37]' : 'bg-amber-50 border-amber-200 text-[#8C701E]'
            }`}>
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`font-serif font-bold text-sm ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
                App Settings
              </h3>
              <p className="text-[11px] text-[#888] font-serif">Voice & Display Preferences</p>
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

        {/* Settings Body */}
        <div className="p-6 space-y-6 text-xs font-serif">
          {/* 1. Theme Setting */}
          <div className="space-y-2">
            <label className="font-bold uppercase tracking-wider text-[10px] text-[#888]">Appearance</label>
            <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
              isDark ? 'bg-[#0F0F0F] border-[#242424]' : 'bg-[#F9F9F7] border-[#E8E8E2]'
            }`}>
              <div className="flex items-center gap-2.5">
                {isDark ? <Moon className="w-4 h-4 text-[#D4AF37]" /> : <Sun className="w-4 h-4 text-[#8C701E]" />}
                <span className={`font-medium ${isDark ? 'text-[#E5E5E5]' : 'text-[#111827]'}`}>
                  {isDark ? 'Dark Theme (Active)' : 'Light Theme (Active)'}
                </span>
              </div>
              <button
                onClick={handleThemeToggle}
                className={`px-3.5 py-1.5 rounded-lg font-serif font-bold border transition text-xs ${
                  isDark
                    ? 'bg-[#1C1C1C] hover:bg-[#2A2A2A] border-[#2E2E2E] text-[#D4AF37]'
                    : 'bg-white hover:bg-[#F2F2EC] border-[#DDD] text-[#8C701E] shadow-2xs'
                }`}
              >
                Toggle Theme
              </button>
            </div>
          </div>

          {/* 2. Voice Speed (TTS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold uppercase tracking-wider text-[10px] text-[#888]">Pronunciation Speed</label>
              <span className={`font-mono font-bold ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`}>{settings.voiceSpeed}x</span>
            </div>
            <div className="flex items-center gap-2">
              {[0.75, 0.95, 1.15].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`flex-1 py-2 rounded-xl font-semibold border transition ${
                    settings.voiceSpeed === spd
                      ? isDark
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold'
                        : 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold'
                      : isDark
                        ? 'bg-[#0F0F0F] border-[#242424] text-[#A3A3A3] hover:text-[#E5E5E5]'
                        : 'bg-[#F9F9F7] border-[#E0E0D8] text-[#555] hover:text-[#111]'
                  }`}
                >
                  {spd === 0.75 ? '0.75x (Slow)' : spd === 0.95 ? '1.0x (Normal)' : '1.15x (Fast)'}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Audio & Sound FX */}
          <div className="space-y-3">
            <label className="font-bold uppercase tracking-wider text-[10px] text-[#888]">Audio & Feedback</label>
            
            <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
              isDark ? 'bg-[#0F0F0F] border-[#242424]' : 'bg-[#F9F9F7] border-[#E8E8E2]'
            }`}>
              <span className={`font-medium ${isDark ? 'text-[#E5E5E5]' : 'text-[#111827]'}`}>Interactive Sound Effects</span>
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={(e) => onUpdateSettings({ ...settings, soundEffects: e.target.checked })}
                className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
              />
            </div>

            <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
              isDark ? 'bg-[#0F0F0F] border-[#242424]' : 'bg-[#F9F9F7] border-[#E8E8E2]'
            }`}>
              <span className={`font-medium ${isDark ? 'text-[#E5E5E5]' : 'text-[#111827]'}`}>Auto-Pronounce on Flashcard Flip</span>
              <input
                type="checkbox"
                checked={settings.autoPronounce}
                onChange={(e) => onUpdateSettings({ ...settings, autoPronounce: e.target.checked })}
                className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Windows App Offline Status */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
            isDark ? 'bg-[#181818] border-[#2A2A2A]' : 'bg-amber-50/60 border-amber-200'
          }`}>
            <ShieldCheck className={`w-5 h-5 shrink-0 ${isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}`} />
            <div className="space-y-1">
              <div className={`font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>Offline Local Storage</div>
              <p className="text-[11px] text-[#888] leading-relaxed">
                All 10,000+ words, pronunciation synthesis, audio tracks, and SRS algorithms run 100% locally on your machine without requiring an active internet connection.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDark ? 'border-[#222] bg-[#0E0E0E]' : 'border-[#E8E8E2] bg-[#FAFAF8]'
        }`}>
          <button
            onClick={handleResetDefaults}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
              isDark ? 'text-[#888] hover:text-[#E5E5E5]' : 'text-[#777] hover:text-[#111]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#C29E2E] text-black font-serif font-bold text-xs shadow-md transition"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
