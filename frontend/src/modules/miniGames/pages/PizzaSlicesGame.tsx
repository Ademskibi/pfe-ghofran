import React, { useEffect, useState } from 'react';
import { ArrowRight, Circle } from 'lucide-react';
import { useTranslation } from '../../../i18n';
import { useAppContext } from '../../../context/AppContext';
import { usePizzaGame } from '../hooks/usePizzaGame';
import AnswerButton from '../components/AnswerButton';
import FeedbackModal from '../components/FeedbackModal';
import ScoreStars from '../components/ScoreStars';
import '../styles/miniGames.css';

const PizzaSlicesGame: React.FC = () => {
  const {
    sliceCount,
    answerOptions,
    selectedAnswer,
    status,
    round,
    pizzaStyle,
    handleAnswer,
    handleNext,
    handleRetry,
  } = usePizzaGame();

  const { t } = useTranslation();
  const { saveMiniGameProgress } = useAppContext();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [stars, setStars] = useState(0);

  useEffect(() => {
    if (status === 'correct') {
      setStars(3);
      setShowSuccess(true);
    }
    if (status === 'wrong') {
      setStars(0);
      setShowError(true);
    }
  }, [status]);

  const handleNextRound = async () => {
    await saveMiniGameProgress({
      gameType: 'pizza-slices',
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
      <div className="rounded-[32px] bg-gradient-to-br from-[var(--color-principal)] via-[var(--color-yellow-button)] to-[var(--color-fox)] p-6 shadow-xl border border-white/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--color-fox-dark)]">{t('pizzaGame.countTheSlices')}</p>
            <h1 className="mt-2 text-4xl font-extrabold text-[var(--color-fox-dark)]">{t('pizzaGame.howManyPizzaSlices')}</h1>
            <p className="mt-3 text-[var(--color-fox-dark)]">{t('pizzaGame.pickCorrectNumber')}</p>
          </div>
          <div className="rounded-3xl bg-white/90 p-4 shadow-sm">
            <Circle className="h-12 w-12 text-[var(--color-fox)]" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[32px] bg-panel p-6 shadow-xl border border-panel">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--color-fox-dark)]">{t('pizzaGame.round', { round })}</p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--color-fox-dark)]">{t('pizzaGame.countTheSlices')}</h2>
            </div>
            <ScoreStars count={status === 'correct' ? 3 : 0} />
          </div>
          <div className="mx-auto flex items-center justify-center">
            <div className="pizza-disc" style={pizzaStyle}>
              {[1, 2, 3, 4].map((item) => (
                <span key={item} className="pizza-slice-topper" />
              ))}
            </div>
          </div>
          <div className="mt-8 rounded-[32px] bg-panel-soft p-5 text-center shadow-inner border border-panel">
            <p className="text-sm text-[var(--color-fox-dark)]">{t('pizzaGame.question')}</p>
            <p className="mt-3 text-4xl font-extrabold text-[var(--color-fox-dark)]">{t('pizzaGame.howManySlices')}</p>
          </div>
        </div>

        <div className="space-y-4">
          {answerOptions.map((option) => (
            <AnswerButton
              key={option}
              label={option.toString()}
              onClick={() => handleAnswer(option)}
              disabled={status === 'correct'}
              status={selectedAnswer === option ? status : 'idle'}
            />
          ))}
          <div className="rounded-[32px] border border-panel bg-panel-soft p-5 text-center">
            <p className="text-sm text-[var(--color-fox-dark)]">{t('pizzaGame.needNewPizza')}</p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-3xl bg-[var(--color-ui)] px-5 py-3 text-lg font-semibold text-white shadow-lg shadow-brand transition hover:bg-[var(--color-ui-dark)]"
            >
              {t('pizzaGame.nextPizza')} <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <FeedbackModal
        open={showSuccess}
        title={t('pizzaGame.greatJob')}
        message={t('pizzaGame.countedSlices', { count: sliceCount })}
        type="success"
        primaryLabel={t('pizzaGame.nextRound')}
        onPrimary={handleNextRound}
      />

      <FeedbackModal
        open={showError}
        title={t('pizzaGame.almostThere')}
        message={t('pizzaGame.tryAgainMessage')}
        type="error"
        primaryLabel={t('pizzaGame.tryAgain')}
        onPrimary={handleTryAgain}
      />
    </div>
  );
};

export default PizzaSlicesGame;
