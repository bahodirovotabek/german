import { Language } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  return window.speechSynthesis.getVoices();
}

export function stopSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function speakWord(
  text: string,
  lang: Language,
  options: SpeechOptions = {}
): void {
  if (!isSpeechSupported() || !text) return;

  stopSpeech();

  // Clean text from articles for cleanest speech when desired or speak naturally
  const cleanText = text.replace(/^to\s+/i, ''); // e.g. "to learn" -> "learn" or keep
  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Map language codes
  let bcp47 = 'en-US';
  if (lang === 'de') {
    bcp47 = 'de-DE';
  } else if (lang === 'uz') {
    // Check if uz-UZ voice is installed, otherwise fallback to tr-TR or en-US with phonetic pronunciation
    bcp47 = 'uz-UZ';
  }

  utterance.lang = bcp47;
  utterance.rate = options.rate || 0.95; // Slightly clearer pace for learners
  utterance.pitch = options.pitch || 1.0;

  // Try to find the highest quality native voice
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    if (lang === 'de') {
      const deVoice = voices.find(v => v.lang.startsWith('de') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Hedda') || v.name.includes('Stefan')));
      if (deVoice) utterance.voice = deVoice;
      else {
        const anyDe = voices.find(v => v.lang.startsWith('de'));
        if (anyDe) utterance.voice = anyDe;
      }
    } else if (lang === 'en') {
      const enVoice = voices.find(v => (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (enVoice) utterance.voice = enVoice;
      else {
        const anyEn = voices.find(v => v.lang.startsWith('en'));
        if (anyEn) utterance.voice = anyEn;
      }
    } else if (lang === 'uz') {
      const uzVoice = voices.find(v => v.lang.startsWith('uz'));
      if (uzVoice) {
        utterance.voice = uzVoice;
      } else {
        // Fallback for Uzbek: Turkish voice has closest phonology or default
        const trVoice = voices.find(v => v.lang.startsWith('tr'));
        if (trVoice) {
          utterance.voice = trVoice;
        }
      }
    }
  }

  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    currentUtterance = null;
    options.onEnd?.();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    options.onError?.();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

// Sound effects generator using Web Audio API for offline responsiveness
export function playTone(type: 'success' | 'click' | 'flip' | 'error'): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'flip') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {
    // AudioContext blocked or not allowed until user interaction
  }
}
