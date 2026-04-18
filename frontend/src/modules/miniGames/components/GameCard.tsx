import React, { ReactNode } from 'react';
import { useTranslation } from '../../../i18n';
import ScoreStars from './ScoreStars';

interface GameCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  progress?: {
    score?: number;
    completedRounds?: number;
    lastPlayedAt?: string;
  };
}

const GameCard: React.FC<GameCardProps> = ({ title, description, icon, onClick, progress }) => {
  const { t } = useTranslation();
  const roundedStars = progress?.score ? Math.min(3, Math.ceil(progress.score / 40)) : 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-[32px] border border-[var(--color-bg-shape)] bg-white p-6 text-left shadow-xl transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-3xl bg-[var(--color-bg-shape)] p-4 text-[var(--color-ui-dark)] shadow-sm">{icon}</div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[.3em] text-[var(--color-ui-dark)]">{t('miniGames.playNow')}</p>
          <p className="text-5xl leading-none">→</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <h2 className="text-2xl font-bold text-[var(--color-black)]">{title}</h2>
        <p className="text-[var(--color-fox-dark)] text-base leading-7">{description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="rounded-3xl bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-ui-dark)]">
          {t('miniGames.rounds', { count: progress?.completedRounds ?? 0 })}
        </div>
        <ScoreStars count={roundedStars} />
      </div>
    </button>
  );
};

export default GameCard;
