import React, { useState, useMemo, useEffect } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  RefreshCw, 
  Trophy, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  Headphones,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DictionaryEntry, Language, QuizQuestion } from '../types';
import { speakWord, playTone } from '../utils/speech';
import { recordQuizResult, AppSettings } from '../utils/storage';

interface QuizViewProps {
  allWords: DictionaryEntry[];
  favorites: string[];
  settings: AppSettings;
}

export const QuizView: React.FC<QuizViewProps> = ({
  allWords,
  settings,
}) => {
  const [quizType, setQuizType] = useState<'multiple' | 'listening' | 'spelling'>('multiple');
  const [targetLang, setTargetLang] = useState<Language>('uz');
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [spellingInput, setSpellingInput] = useState<string>('');

  const isDark = settings.darkMode;

  // Generate 10 randomized multiple choice questions from dictionary pool
  const questions: QuizQuestion[] = useMemo(() => {
    const pool = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 10);

    return pool.map((item) => {
      // Determine correct answer based on target language
      const correctAnswer = targetLang === 'uz' ? item.uz : targetLang === 'de' ? (item.deGender ? `${item.deGender} ${item.de}` : item.de) : item.en;

      // Distractors from other words
      const distractors = allWords
        .filter(w => w.id !== item.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => targetLang === 'uz' ? w.uz : targetLang === 'de' ? (w.deGender ? `${w.deGender} ${w.de}` : w.de) : w.en);

      const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

      return {
        word: item,
        questionLang: 'en',
        targetLang,
        options,
        correctAnswer,
        type: quizType === 'spelling' ? 'spelling' : 'multiple_choice'
      };
    });
  }, [allWords, targetLang, quizType]);

  const currentQ = questions[questionIdx] || null;

  // Audio prompt for listening mode
  useEffect(() => {
    if (quizType === 'listening' && currentQ) {
      speakWord(currentQ.word.en, 'en', { rate: settings.voiceSpeed });
    }
  }, [quizType, questionIdx, currentQ]);

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
    setIsAnswerChecked(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      if (settings.soundEffects) playTone('success');
    } else {
      if (settings.soundEffects) playTone('error');
    }
  };

  const handleCheckSpelling = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswerChecked || !currentQ) return;
    setIsAnswerChecked(true);
    const cleanUser = spellingInput.trim().toLowerCase();
    const cleanTarget = currentQ.correctAnswer.toLowerCase();

    const isCorrect = cleanUser === cleanTarget;
    if (isCorrect) {
      setScore(prev => prev + 1);
      if (settings.soundEffects) playTone('success');
    } else {
      if (settings.soundEffects) playTone('error');
    }
  };

  const handleNext = () => {
    if (questionIdx + 1 >= questions.length) {
      setIsQuizComplete(true);
      recordQuizResult(score, questions.length);
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    } else {
      setQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setSpellingInput('');
      setIsAnswerChecked(false);
    }
  };

  const restartQuiz = () => {
    setQuestionIdx(0);
    setSelectedOption(null);
    setSpellingInput('');
    setIsAnswerChecked(false);
    setScore(0);
    setIsQuizComplete(false);
  };

  return (
    <div id="quiz-view-main" className={`h-full flex flex-col p-4 sm:p-6 overflow-y-auto max-w-3xl mx-auto w-full transition-colors ${
      isDark ? 'bg-[#0A0A0A] text-[#E5E5E5]' : 'bg-[#FAFAFA] text-[#1F1F1F]'
    }`}>
      {/* Top Header & Mode Toggle */}
      <div className={`p-4 rounded-2xl border mb-6 transition-colors flex flex-wrap items-center justify-between gap-3 ${
        isDark
          ? 'bg-[#141414] border-[#262626]'
          : 'bg-white border-[#E8E8E2] shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-serif font-bold text-[#888] uppercase text-[10px]">Quiz Type:</span>
          <div className={`flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-[#1C1C1C] border-[#2E2E2E]' : 'bg-[#F2F2EC] border-[#DDD]'
          }`}>
            <button
              onClick={() => { setQuizType('multiple'); restartQuiz(); }}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                quizType === 'multiple'
                  ? isDark ? 'bg-[#D4AF37] text-black font-bold' : 'bg-white text-black font-bold shadow-2xs'
                  : 'text-[#888]'
              }`}
            >
              Multiple Choice
            </button>
            <button
              onClick={() => { setQuizType('listening'); restartQuiz(); }}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                quizType === 'listening'
                  ? isDark ? 'bg-[#D4AF37] text-black font-bold' : 'bg-white text-black font-bold shadow-2xs'
                  : 'text-[#888]'
              }`}
            >
              Listening Mode
            </button>
            <button
              onClick={() => { setQuizType('spelling'); restartQuiz(); }}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                quizType === 'spelling'
                  ? isDark ? 'bg-[#D4AF37] text-black font-bold' : 'bg-white text-black font-bold shadow-2xs'
                  : 'text-[#888]'
              }`}
            >
              Typing Challenge
            </button>
          </div>
        </div>

        {/* Target Language Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#888] font-serif">Translate To:</span>
          <div className={`flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-[#1C1C1C] border-[#2E2E2E]' : 'bg-[#F2F2EC] border-[#DDD]'
          }`}>
            <button
              onClick={() => { setTargetLang('uz'); restartQuiz(); }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                targetLang === 'uz' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-[#888]'
              }`}
            >
              Uzbek
            </button>
            <button
              onClick={() => { setTargetLang('de'); restartQuiz(); }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                targetLang === 'de' ? 'bg-amber-600 text-white shadow-2xs' : 'text-[#888]'
              }`}
            >
              German
            </button>
          </div>
        </div>
      </div>

      {/* Main Quiz Container */}
      {!isQuizComplete && currentQ ? (
        <div className="flex-1 flex flex-col justify-between space-y-6">
          {/* Question Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border transition-colors relative ${
            isDark
              ? 'bg-[#141414] border-[#262626] shadow-xl'
              : 'bg-white border-[#E8E8E2] shadow-md'
          }`}>
            {/* Header: Question counter & score */}
            <div className="flex items-center justify-between text-xs mb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold uppercase border ${
                  isDark ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30' : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  Q {questionIdx + 1} / {questions.length}
                </span>
                <span className={`font-serif ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
                  {currentQ.word.category} • {currentQ.word.cefr}
                </span>
              </div>

              <div className="font-mono text-xs font-semibold">
                Score: <span className={isDark ? 'text-[#D4AF37]' : 'text-[#8C701E]'}>{score}</span> / {questionIdx}
              </div>
            </div>

            {/* Center: The Word or Listening Prompt */}
            <div className="text-center py-4 space-y-3">
              {quizType === 'listening' ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <button
                    onClick={() => speakWord(currentQ.word.en, 'en', { rate: settings.voiceSpeed })}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif font-bold transition shadow-xs ${
                      isDark ? 'bg-[#222] text-[#D4AF37] hover:bg-[#2A2A2A]' : 'bg-[#F2F2EC] text-[#8C701E] hover:bg-[#EAEAE2]'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Audio Prompt Again</span>
                  </button>
                  <p className="text-xs text-[#888] font-serif">
                    Listen to the English word and choose the corresponding {targetLang === 'uz' ? 'Uzbek' : 'German'} translation.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#888]">
                    Translate English Word
                  </div>
                  <h2 className={`text-3xl sm:text-4xl font-serif font-bold tracking-wide ${
                    isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'
                  }`}>
                    {currentQ.word.en}
                  </h2>
                  {currentQ.word.ipaEn && (
                    <p className={`text-xs font-mono ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
                      {currentQ.word.ipaEn}
                    </p>
                  )}
                  <button
                    onClick={() => speakWord(currentQ.word.en, 'en', { rate: settings.voiceSpeed })}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs transition ${
                      isDark ? 'bg-[#1C1C1C] text-[#D4AF37] hover:bg-[#252525]' : 'bg-[#F2F2EC] text-[#8C701E] hover:bg-[#EAEAE2]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Pronounce</span>
                  </button>
                </div>
              )}
            </div>

            {/* Answer Mode: Multiple Choice vs Typing Input */}
            {quizType !== 'spelling' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQ.correctAnswer;

                  let btnStyle = isDark
                    ? 'bg-[#181818] border-[#2A2A2A] text-[#D4D4D4] hover:border-[#D4AF37]/50 hover:bg-[#202020]'
                    : 'bg-[#FAFAF8] border-[#E0E0D8] text-[#222] hover:border-[#D4AF37] hover:bg-white';

                  if (isAnswerChecked) {
                    if (isCorrect) {
                      btnStyle = isDark
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                    } else if (isSelected) {
                      btnStyle = isDark
                        ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                        : 'bg-rose-50 border-rose-500 text-rose-800';
                    } else {
                      btnStyle = isDark
                        ? 'bg-[#121212] border-[#222] text-[#666] opacity-50'
                        : 'bg-[#F5F5F0] border-[#E8E8E2] text-[#AAA] opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`quiz-option-${idx}`}
                      onClick={() => handleSelectOption(option)}
                      disabled={isAnswerChecked}
                      className={`p-4 rounded-2xl border text-left font-serif text-sm font-semibold transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerChecked && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {isAnswerChecked && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <form onSubmit={handleCheckSpelling} className="mt-6 space-y-4">
                <div>
                  <input
                    type="text"
                    value={spellingInput}
                    onChange={(e) => setSpellingInput(e.target.value)}
                    disabled={isAnswerChecked}
                    placeholder={`Type exact ${targetLang === 'uz' ? 'Uzbek' : 'German'} translation...`}
                    className={`w-full p-4 rounded-2xl border text-base font-serif outline-hidden transition ${
                      isDark
                        ? 'bg-[#181818] border-[#333] text-[#F5F5F5] focus:border-[#D4AF37]'
                        : 'bg-[#F9F9F7] border-[#DDD] text-[#111] focus:border-[#8C701E]'
                    }`}
                  />
                </div>

                {!isAnswerChecked ? (
                  <button
                    type="submit"
                    className={`w-full py-3.5 rounded-xl font-serif font-bold text-xs shadow-md transition ${
                      isDark ? 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black' : 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black'
                    }`}
                  >
                    Check Spelling
                  </button>
                ) : (
                  <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                    spellingInput.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase()
                      ? isDark ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : isDark ? 'bg-rose-950/40 border-rose-600 text-rose-200' : 'bg-rose-50 border-rose-300 text-rose-800'
                  }`}>
                    <div className="font-bold">
                      Correct Answer: <span className="underline">{currentQ.correctAnswer}</span>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Bottom Next Button */}
          {isAnswerChecked && (
            <div className="flex justify-end animate-in fade-in duration-200">
              <button
                id="btn-quiz-next-question"
                onClick={handleNext}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-serif font-bold text-xs shadow-md transition ${
                  isDark ? 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black' : 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black'
                }`}
              >
                <span>{questionIdx + 1 >= questions.length ? 'View Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className={`p-8 rounded-3xl border text-center space-y-5 max-w-lg mx-auto w-full my-auto transition-colors ${
          isDark ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E8E8E2] shadow-md'
        }`}>
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border ${
            isDark ? 'bg-[#1C1C1C] border-[#333] text-[#D4AF37]' : 'bg-amber-50 border-amber-200 text-[#8C701E]'
          }`}>
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className={`text-2xl sm:text-3xl font-serif font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-[#111827]'}`}>
              Quiz Completed!
            </h2>
            <p className="text-xs text-[#888] font-serif">
              You scored <span className={isDark ? 'text-[#D4AF37] font-bold' : 'text-[#8C701E] font-bold'}>{score}</span> out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </p>
          </div>

          <div className="pt-2">
            <button
              id="btn-restart-quiz"
              onClick={restartQuiz}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-serif font-bold text-xs shadow-md transition ${
                isDark ? 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black' : 'bg-[#D4AF37] hover:bg-[#C29E2E] text-black'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Take Another Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
