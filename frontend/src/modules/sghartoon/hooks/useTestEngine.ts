import { useState, useEffect, useRef } from 'react';

// Question structure
export interface Question {
  id: string;
  cx: number; // 1=A, 2=B, 3=C
  qt: 'choice' | 'text';
  inst: string;
  stim: string | null;
  sc: string | null;
  choices?: string[];
  ans: string;
  tl: number; // time limit in seconds
  domain: string;
  curr: string;
  dictee: string | null;
  type?: 'dyslexia' | 'dyscalculia'; // added during test
}

export interface Answer {
  qid: string;
  type: 'dyslexia' | 'dyscalculia';
  ok: boolean;
  t: number; // actual time taken
  tl: number; // time limit
  domain: string;
  userAnswer?: string;
}

export interface TestScore {
  dyS: number; // 0-1 score
  dyFlSlow: boolean;
  dyFlLabel: string;
  dyFlSec: string;
  dyDomains: Record<string, number>;
  dcS: number;
  dcFlSlow: boolean;
  dcFlLabel: string;
  dcFlSec: string;
  dcDomains: Record<string, number>;
}

export const useTestEngine = (questions: Question[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  // Initialize timer
  useEffect(() => {
    if (currentQuestion && !isAnswered) {
      setTimeRemaining(currentQuestion.tl);
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [currentIndex, isAnswered, currentQuestion]);

  const handleTimeout = () => {
    if (currentQuestion && !isAnswered) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const newAnswer: Answer = {
        qid: currentQuestion.id,
        type: currentQuestion.type as 'dyslexia' | 'dyscalculia',
        ok: false,
        t: elapsed,
        tl: currentQuestion.tl,
        domain: currentQuestion.domain,
      };
      setAnswers((prev) => [...prev, newAnswer]);
      setIsAnswered(true);
    }
  };

  const submitAnswer = (correct: boolean, userAnswer?: string) => {
    if (isAnswered || !currentQuestion) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newAnswer: Answer = {
      qid: currentQuestion.id,
      type: currentQuestion.type as 'dyslexia' | 'dyscalculia',
      ok: correct,
      t: elapsed,
      tl: currentQuestion.tl,
      domain: currentQuestion.domain,
      userAnswer,
    };

    setAnswers((prev) => [...prev, newAnswer]);
    setIsAnswered(true);
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
    }
  };

  const isTestComplete = currentIndex >= questions.length - 1 && isAnswered;

  const computeScore = (): TestScore => {
    const dy = answers.filter((a) => a.type === 'dyslexia');
    const dc = answers.filter((a) => a.type === 'dyscalculia');

    const analyze = (grp: Answer[], normFrac = 0.45) => {
      if (!grp.length) {
        return {
          score: 0,
          flSlow: false,
          flLabel: '—',
          flSec: '',
          domains: {} as Record<string, number>,
        };
      }

      const err = grp.filter((a) => !a.ok).length / grp.length;
      const avgFrac =
        grp.reduce((s, a) => s + Math.min(a.t / a.tl, 1.5), 0) / grp.length;
      const flSlow = avgFrac > normFrac + 0.2;
      const avgSec = (
        grp.reduce((s, a) => s + a.t, 0) / grp.length
      ).toFixed(1);

      const sc = Math.min(
        err * 0.65 + Math.max(avgFrac - normFrac, 0) * 0.35,
        1
      );

      const doms: Record<string, { e: number; t: number }> = {};
      grp.forEach((a) => {
        if (!doms[a.domain]) doms[a.domain] = { e: 0, t: 0 };
        doms[a.domain].t++;
        if (!a.ok) doms[a.domain].e++;
      });

      const dr: Record<string, number> = {};
      Object.entries(doms).forEach(([d, v]) => {
        dr[d] = v.e / v.t;
      });

      return {
        score: sc,
        flSlow,
        flLabel: flSlow ? 'Lente ⚠' : 'Normale ✓',
        flSec: `(moy. ${avgSec}s/q)`,
        domains: dr,
      };
    };

    const dyr = analyze(dy, 0.45);
    const dcr = analyze(dc, 0.42);

    return {
      dyS: dyr.score,
      dyFlSlow: dyr.flSlow,
      dyFlLabel: dyr.flLabel,
      dyFlSec: dyr.flSec,
      dyDomains: dyr.domains,
      dcS: dcr.score,
      dcFlSlow: dcr.flSlow,
      dcFlLabel: dcr.flLabel,
      dcFlSec: dcr.flSec,
      dcDomains: dcr.domains,
    };
  };

  return {
    currentQuestion,
    currentIndex,
    progress,
    timeRemaining,
    isAnswered,
    isTestComplete,
    answers,
    submitAnswer,
    goToNext,
    computeScore,
  };
};
