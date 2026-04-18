import React from 'react';

interface ScoreStarsProps {
  count: number;
  maxStars?: number;
}

const ScoreStars: React.FC<ScoreStarsProps> = ({ count, maxStars = 3 }) => {
  const stars = Array.from({ length: maxStars }, (_, index) => index < count);

  return (
    <div className="flex items-center gap-1 text-2xl">
      {stars.map((active, index) => (
        <span key={index} className={active ? 'text-amber-400' : 'text-slate-300'}>
          ★
        </span>
      ))}
    </div>
  );
};

export default ScoreStars;
