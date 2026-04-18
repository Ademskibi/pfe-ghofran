import React, { useEffect, useState } from 'react';
import { CircleDot, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../i18n';
import { useNumberMatchGame } from '../hooks/useNumberMatchGame';
import AnswerButton from '../components/AnswerButton';
import FeedbackModal from '../components/FeedbackModal';
import ScoreStars from '../components/ScoreStars';
import '../styles/miniGames.css';

const NumberElementsGame: React.FC = () => {
  const {
    targetNumber,
    groups,
    status,
    selectedGroup,
    round,
    handleGroupSelect,
    handleNext,
    handleRetry,
  } = useNumberMatchGame();

  const { t } = useTranslation();
  const { saveMiniGameProgress } = useAppContext();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (status === 'correct') {
      setShowSuccess(true);
    }
    if (status === 'wrong') {
      setShowError(true);
    }
  }, [status]);

  const handleNextRound = async () => {
    await saveMiniGameProgress({
      gameType: 'number-match',
      score: 100,
      level: 'easy',
      completedRounds: 1,
    });
    setShowSuccess(false);
    handleNext();
  };

  const handleTryAgain = () => {
    setShowError(false);
    handleRetry();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-gradient-to-br from-cyan-100 via-sky-100 to-teal-100 p-6 shadow-xl border border-white/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--color-ui-dark)]">{t('numberGame.matchTheGroup')}</p>
            <h1 className="mt-2 text-4xl font-extrabold text-[var(--color-black)]">{t('numberGame.findRightNumber')}</h1>
            <p className="mt-3 text-[var(--color-fox-dark)]">{t('numberGame.tapGroup')}</p>
          </div>
          <div className="rounded-3xl bg-white/90 p-4 shadow-sm">
            <CircleDot className="h-12 w-12 text-[var(--color-ui)]" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[32px] bg-panel p-6 shadow-xl border border-panel">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--color-ui-dark)]">{t('numberGame.round', { round })}</p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--color-black)]">{t('numberGame.howManyObjects')}</h2>
            </div>
            <ScoreStars count={status === 'correct' ? 3 : 0} />
          </div>
          <div className="rounded-[32px] bg-[var(--color-bg-shape)] p-6 text-center shadow-inner border border-[var(--color-bg)]">
            <p className="text-sm text-[var(--color-ui-dark)]">{t('numberGame.targetNumber')}</p>
            <p className="mt-3 text-6xl font-extrabold text-[var(--color-black)]">{targetNumber}</p>
          </div>
        </div>

        <div className="space-y-4">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => handleGroupSelect(group.id)}
              className={`group-bubble w-full rounded-[32px] border-2 p-5 text-left transition ${selectedGroup === group.id ? 'border-[var(--color-ui)] bg-[rgba(47,168,204,0.08)]' : 'border-[var(--color-bg)] bg-white hover:border-[var(--color-ui)]'}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-[var(--color-black)]">{group.label}</span>
                <span className="rounded-full bg-[var(--color-bg-shape)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ui-dark)]">{group.count}</span>
              </div>
              <div className="flex flex-wrap">
                {Array.from({ length: group.count }).map((_, index) => (
                  <div key={index} className="element mr-2 mb-2 rounded-full bg-white px-3 py-2 text-2xl shadow-sm">{group.icon}</div>
                ))}
              </div>
            </button>
          ))}
          <div className="rounded-[32px] border border-[var(--color-bg)] bg-[var(--color-bg-shape)] p-5 text-center">
            <p className="text-sm text-[var(--color-ui-dark)]">{t('numberGame.wantNewChallenge')}</p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-3xl bg-[var(--color-ui)] px-5 py-3 text-lg font-semibold text-white shadow-lg shadow-[rgba(47,168,204,0.2)] transition hover:bg-[var(--color-ui-dark)]"
            >
              {t('numberGame.nextRound')} <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <FeedbackModal
        open={showSuccess}
        title={t('numberGame.niceWork')}
        message={t('numberGame.youFoundGroup')}
        type="success"
        primaryLabel={t('numberGame.nextRound')}
        onPrimary={handleNextRound}
      />

      <FeedbackModal
        open={showError}
        title={t('numberGame.tryAgain')}
        message={t('numberGame.tryAgainMessage')}
        type="error"
        primaryLabel={t('numberGame.tryAgain')}
        onPrimary={handleTryAgain}
      />
    </div>
  );
};

export default NumberElementsGame;
