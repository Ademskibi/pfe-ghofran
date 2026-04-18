import { useCallback, useEffect, useMemo, useState } from 'react';

type GameStatus = 'idle' | 'correct' | 'wrong';

type GroupItem = {
  id: string;
  count: number;
  icon: string;
  label: string;
  bg: string;
};

const shapes: GroupItem[] = [
  { id: 'star', count: 0, icon: '⭐', label: 'stars', bg: 'bg-amber-100' },
  { id: 'apple', count: 0, icon: '🍎', label: 'apples', bg: 'bg-rose-100' },
  { id: 'ball', count: 0, icon: '⚽', label: 'balls', bg: 'bg-cyan-100' },
  { id: 'diamond', count: 0, icon: '🔷', label: 'shapes', bg: 'bg-violet-100' },
];

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const createGroups = (target: number) => {
  const count = getRandomInt(3, 4);
  const chosen = shuffle(shapes).slice(0, count);
  const correctIndex = getRandomInt(0, chosen.length - 1);
  return chosen.map((item, index) => ({
    ...item,
    count: index === correctIndex ? target : Math.max(1, target + (index % 2 === 0 ? index + 1 : -(index + 1))),
  }))
    .map((item) => ({ ...item, count: item.count === target ? target : Math.max(1, item.count) }));
};

export const useNumberMatchGame = () => {
  const [targetNumber, setTargetNumber] = useState(1);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [round, setRound] = useState(1);

  const resetRound = useCallback(() => {
    const target = getRandomInt(2, 5);
    setTargetNumber(target);
    setGroups(shuffle(createGroups(target)));
    setSelectedGroup(null);
    setStatus('idle');
  }, []);

  useEffect(() => {
    resetRound();
  }, [resetRound]);

  const handleGroupSelect = (id: string) => {
    setSelectedGroup(id);
    const group = groups.find((item) => item.id === id);
    if (!group) return;
    setStatus(group.count === targetNumber ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    setRound((r) => r + 1);
    resetRound();
  };

  const handleRetry = () => {
    setSelectedGroup(null);
    setStatus('idle');
  };

  const summary = useMemo(
    () => groups.map((group) => ({ ...group, isCorrect: group.count === targetNumber })),
    [groups, targetNumber],
  );

  return {
    targetNumber,
    groups: summary,
    status,
    selectedGroup,
    round,
    handleGroupSelect,
    handleNext,
    handleRetry,
    resetRound,
  };
};
