import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { Brain, Gamepad2, Star, Smile } from 'lucide-react';
import { TestPlayer } from '../modules/sghartoon/components/TestPlayer';
import { DYSLEXIA_QUESTIONS, DYSCALCULIA_QUESTIONS } from '../modules/sghartoon/data/questionBank';
import { Question } from '../modules/sghartoon/hooks/useTestEngine';

const DOMAINS = [
  'Number sense',
  'Counting accuracy',
  'Arithmetic fluency',
  'Place value understanding',
  'Word problem solving',
  'Number line estimation',
  'Pattern recognition',
  'Mental calculation',
  'Symbol recognition',
  'Time and measurement'
];

const StudentPortal: React.FC = () => {
  const { currentUser, testSessions, createTestSession } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [testPhase, setTestPhase] = useState<'intro' | 'testing' | 'success'>('intro');
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);

  const mySessions = [...testSessions].sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
  const latestSession = mySessions.length > 0 ? mySessions[0] : null;

  const buildSghartoonQuestions = (): Question[] => {
    const allQuestions = [
      ...DYSLEXIA_QUESTIONS.map((q) => ({ ...q, type: 'dyslexia' as const })),
      ...DYSCALCULIA_QUESTIONS.map((q) => ({ ...q, type: 'dyscalculia' as const })),
    ];

    return allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
  };

  const handleStartTest = () => {
    setTestQuestions(buildSghartoonQuestions());
    setTestPhase('testing');
  };

  const handleTestComplete = () => {
    setTestPhase('success');
    setTestQuestions([]);
  };

  const handleCancelTest = () => {
    setTestPhase('intro');
    setTestQuestions([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center mb-10 px-4 sm:px-6">
      <div className="w-full rounded-[32px] bg-gradient-to-r from-[var(--color-ui)] via-[var(--color-glasses)] to-[var(--color-fox)] p-8 shadow-2xl text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-white shadow-lg shadow-black/10">
            <Gamepad2 className="h-10 w-10" />
          </div>
          <p className="text-sm uppercase tracking-[0.35em]">{t('studentPortal.studentPortal')}</p>
          <h1 className="text-4xl font-extrabold tracking-tight">{t('studentPortal.readyToPlay')}</h1>
          <p className="max-w-xl text-base text-[var(--color-muzzle)]">{t('studentPortal.bigButtons')}</p>
        </div>
      </div>

      <div className="w-full grid gap-4 lg:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate('/mini-games')}
          className="group rounded-[32px] bg-brand px-8 py-10 text-left shadow-xl shadow-brand transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-[var(--color-fox)] shadow-lg">
              <span className="text-3xl">🎮</span>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">{t('studentPortal.primaryAction')}</p>
              <h2 className="mt-3 text-3xl font-bold text-white">{t('studentPortal.playMiniGames')}</h2>
            </div>
          </div>
          <p className="mt-6 max-w-[18rem] text-white/90">{t('studentPortal.jumpIntoFun')}</p>
        </button>

        <div className="rounded-[32px] bg-panel p-8 shadow-xl border border-panel">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-fox-dark)]">{t('studentPortal.quickPlay')}</p>
              <h2 className="mt-3 text-3xl font-bold text-[var(--color-fox-dark)]">{t('studentPortal.startTest')}</h2>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-panel-soft text-[var(--color-fox-dark)] shadow-sm">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <p className="mt-5 text-[var(--color-fox-dark)]">{t('studentPortal.letsPlay')}</p>
          <button
            type="button"
            onClick={handleStartTest}
            className="mt-8 w-full rounded-3xl bg-[var(--color-yellow-button)] px-6 py-5 text-xl font-bold text-[var(--color-black)] shadow-lg shadow-[rgba(255,213,0,0.3)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {t('studentPortal.startTest')}
          </button>
        </div>
      </div>

      {testPhase === 'testing' && testQuestions.length > 0 && (
        <div className="w-full rounded-[32px] bg-panel p-8 shadow-2xl border border-panel">
          <TestPlayer
            studentName={currentUser?.role === 'student' ? 'Tu' : 'Élève'}
            studentAge={8}
            questions={testQuestions}
            onComplete={handleTestComplete}
            onCancel={handleCancelTest}
          />
        </div>
      )}

      {testPhase === 'success' && (
        <div className="w-full rounded-[32px] bg-[rgba(62,209,200,0.15)] p-10 shadow-2xl border border-[var(--color-glasses)] text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-[var(--color-ui)] shadow-lg">
            <Smile className="h-12 w-12" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-[var(--color-ui-dark)]">{t('studentPortal.greatJob')}</h2>
          <p className="mt-3 text-[var(--color-fox-dark)]">{t('studentPortal.answersSaved')}</p>
        </div>
      )}

      <div className="w-full grid gap-4 md:grid-cols-2">
        <div className="rounded-[32px] bg-panel p-6 shadow-lg border border-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-fox-dark)]">{t('studentPortal.sticker')}</p>
          <p className="mt-4 text-2xl font-bold text-[var(--color-fox-dark)]">⭐ {t('studentPortal.superStar')}</p>
          <p className="mt-2 text-[var(--color-fox-dark)]">{t('studentPortal.youreDoingAmazing')}</p>
        </div>
        <div className="rounded-[32px] bg-panel p-6 shadow-lg border border-panel">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-fox-dark)]">{t('studentPortal.mood')}</p>
          <p className="mt-4 text-2xl font-bold text-[var(--color-fox-dark)]">🎈 {t('studentPortal.playful')}</p>
          <p className="mt-2 text-[var(--color-fox-dark)]">{t('studentPortal.happyDay')}</p>
        </div>
      </div>

      {latestSession && (
        <div className="w-full rounded-[32px] bg-gradient-to-r from-[var(--color-bg-shape)] via-[var(--color-surface)] to-[var(--color-glasses)] p-6 shadow-xl border border-panel">
          <p className="text-sm text-[var(--color-fox-dark)]">{t('studentPortal.lastPlaySession')}</p>
          <p className="mt-3 text-xl font-semibold text-[var(--color-fox-dark)]">{t('studentPortal.score', { score: Math.round(latestSession.dri) })}</p>
          <p className="mt-2 text-[var(--color-fox-dark)]">{t('studentPortal.niceWork')}</p>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
