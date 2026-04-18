import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CircleDot, Gamepad2, Pizza } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../i18n';
import GameCard from '../components/GameCard';
import ScoreStars from '../components/ScoreStars';
import '../styles/miniGames.css';

const MiniGamesHome: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser, miniGameProgress, fetchMiniGameProgress } = useAppContext();

  useEffect(() => {
    if (currentUser?.studentId || currentUser?.userId) {
      fetchMiniGameProgress();
    }
  }, [currentUser, fetchMiniGameProgress]);

  const latestProgress = (gameType: 'pizza-slices' | 'number-match') => {
    return [...miniGameProgress]
      .filter((item) => item.gameType === gameType)
      .sort((a, b) => new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime())[0];
  };

  const pizzaProgress = latestProgress('pizza-slices');
  const numberProgress = latestProgress('number-match');

  return (
    <div className="mini-games-page space-y-6">
      <section className="rounded-[32px] bg-gradient-to-br from-amber-200 via-pink-100 to-cyan-200 p-8 shadow-2xl border border-white/70">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--color-ui-dark)]">{t('miniGames.funLearning')}</p>
            <h1 className="mt-3 text-4xl font-extrabold text-[var(--color-black)] sm:text-5xl">{t('miniGames.miniGames')}</h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--color-fox-dark)]">{t('miniGames.colorfulCounting')}</p>
          </div>
          <div className="rounded-[32px] bg-white/80 p-5 shadow-inner shadow-[rgba(26,26,26,0.08)]">
            <Sparkles className="h-14 w-14 text-[var(--color-principal)]" />
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <GameCard
          title={t('pizzaGame.countTheSlices')}
          description={t('pizzaGame.pickCorrectNumber')}
          icon={<Pizza className="h-8 w-8 text-[var(--color-principal)]" />}
          onClick={() => navigate('/mini-games/pizza-slices')}
          progress={{
            completedRounds: pizzaProgress?.completedRounds,
            score: pizzaProgress?.score,
          }}
        />
        <GameCard
          title={t('numberGame.findRightNumber')}
          description={t('numberGame.tapGroup')}
          icon={<CircleDot className="h-8 w-8 text-[var(--color-ui)]" />}
          onClick={() => navigate('/mini-games/number-match')}
          progress={{
            completedRounds: numberProgress?.completedRounds,
            score: numberProgress?.score,
          }}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[32px] bg-white p-6 shadow-xl border border-[var(--color-bg-shape)]">
          <div className="mb-4 flex items-center gap-3">
            <Gamepad2 className="h-7 w-7 text-[var(--color-ui)]" />
            <h2 className="text-xl font-semibold text-[var(--color-black)]">{t('miniGames.yourGameProgress')}</h2>
          </div>
          <div className="space-y-4">
            <div className="rounded-[28px] bg-[var(--color-bg-shape)] p-4">
              <p className="text-sm text-[var(--color-ui-dark)]">{t('miniGames.pizzaGame')}</p>
              <p className="mt-1 text-lg font-semibold text-[var(--color-black)]">{pizzaProgress ? t('miniGames.rounds', { count: pizzaProgress.completedRounds }) : t('miniGames.noRoundsYet')}</p>
              <ScoreStars count={pizzaProgress ? Math.min(3, Math.ceil(pizzaProgress.score / 40)) : 0} />
            </div>
            <div className="rounded-[28px] bg-[var(--color-bg-shape)] p-4">
              <p className="text-sm text-[var(--color-ui-dark)]">{t('miniGames.numberGame')}</p>
              <p className="mt-1 text-lg font-semibold text-[var(--color-black)]">{numberProgress ? t('miniGames.rounds', { count: numberProgress.completedRounds }) : t('miniGames.noRoundsYet')}</p>
              <ScoreStars count={numberProgress ? Math.min(3, Math.ceil(numberProgress.score / 40)) : 0} />
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-6 shadow-xl border border-[var(--color-bg-shape)]">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-[var(--color-yellow-button)]" />
            <h2 className="text-xl font-semibold text-[var(--color-black)]">{t('miniGames.easyForLittleFingers')}</h2>
          </div>
          <p className="text-[var(--color-ui-dark)]">{t('miniGames.largeButtons')}</p>
        </div>
      </section>
    </div>
  );
};

export default MiniGamesHome;
