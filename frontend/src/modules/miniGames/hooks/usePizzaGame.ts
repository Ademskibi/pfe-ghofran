import { useCallback, useEffect, useMemo, useState } from 'react';

type GameStatus = 'idle' | 'correct' | 'wrong';

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const buildOptions = (correct: number) => {
  const options = new Set<number>();
  options.add(correct);
  while (options.size < 4) {
    const delta = getRandomInt(1, 3);
    const candidate = Math.max(1, Math.min(10, correct + (Math.random() < 0.5 ? -delta : delta)));
    if (candidate !== correct) {
      options.add(candidate);
    }
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
};

const makePizzaRound = () => {
  const count = getRandomInt(2, 8);
  const options = buildOptions(count);
  return { count, options };
};

const makePizzaBg = (count: number) => {
  if (count <= 0) {
    return '#f7d1a4';
  }
  const colors = ['#fdd57e', '#f7c465'];
  const segments = Array.from({ length: count }, (_, index) => {
    const start = (index * 360) / count;
    const end = ((index + 1) * 360) / count;
    return `${colors[index % colors.length]} ${start}deg ${end}deg`;
  });
  return `conic-gradient(${segments.join(', ')})`;
};

export const usePizzaGame = () => {
  const [sliceCount, setSliceCount] = useState(0);
  const [answerOptions, setAnswerOptions] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const resetRound = useCallback(() => {
    const next = makePizzaRound();
    setSliceCount(next.count);
    setAnswerOptions(next.options);
    setSelectedAnswer(null);
    setStatus('idle');
  }, []);

  useEffect(() => {
    resetRound();
  }, [resetRound]);

  const handleAnswer = (value: number) => {
    setSelectedAnswer(value);
    setStatus(value === sliceCount ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    setRound((r) => r + 1);
    resetRound();
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setStatus('idle');
  };

  const pizzaStyle = useMemo(() => ({ background: makePizzaBg(sliceCount) }), [sliceCount]);

  return {
    sliceCount,
    answerOptions,
    selectedAnswer,
    status,
    round,
    pizzaStyle,
    handleAnswer,
    handleNext,
    handleRetry,
    resetRound,
  };
};
