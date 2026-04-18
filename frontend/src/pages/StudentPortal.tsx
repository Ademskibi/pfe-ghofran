<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { Brain, Gamepad2, Star, Smile } from 'lucide-react';

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

  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<number[]>(new Array(10).fill(50));
  const [testPhase, setTestPhase] = useState<'intro' | 'testing' | 'success'>('intro');

  const mySessions = [...testSessions].sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
=======
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { CheckCircle, Brain, Clock3 } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

type QuestionType = 'dyslexia' | 'dyscalculia';
type QuestionMode = 'choice' | 'text';

interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  mode: QuestionMode;
  correctChoiceIndex?: number;
  timer: number;
}

interface AnswerRecord {
  questionId: string;
  type: QuestionType;
  mode: QuestionMode;
  userAnswer: string;
  isCorrect: boolean;
  timedOut: boolean;
  timeSpent: number;
}

const QUESTION_BANK: AssessmentQuestion[] = [
  { id: 'dy1', type: 'dyslexia', mode: 'choice', correctChoiceIndex: 0, timer: 20 },
  { id: 'dy2', type: 'dyslexia', mode: 'choice', correctChoiceIndex: 0, timer: 15 },
  { id: 'dy3', type: 'dyslexia', mode: 'choice', correctChoiceIndex: 1, timer: 20 },
  { id: 'dy4', type: 'dyslexia', mode: 'choice', correctChoiceIndex: 1, timer: 18 },
  { id: 'dy5', type: 'dyslexia', mode: 'text', timer: 30 },
  { id: 'dy6', type: 'dyslexia', mode: 'choice', correctChoiceIndex: 1, timer: 20 },
  { id: 'dy7', type: 'dyslexia', mode: 'choice', correctChoiceIndex: 1, timer: 20 },
  { id: 'dy8', type: 'dyslexia', mode: 'choice', correctChoiceIndex: 1, timer: 25 },
  { id: 'dc1', type: 'dyscalculia', mode: 'choice', correctChoiceIndex: 2, timer: 15 },
  { id: 'dc2', type: 'dyscalculia', mode: 'choice', correctChoiceIndex: 2, timer: 20 },
  { id: 'dc3', type: 'dyscalculia', mode: 'text', timer: 25 },
  { id: 'dc4', type: 'dyscalculia', mode: 'choice', correctChoiceIndex: 1, timer: 20 },
  { id: 'dc5', type: 'dyscalculia', mode: 'choice', correctChoiceIndex: 1, timer: 18 },
  { id: 'dc6', type: 'dyscalculia', mode: 'text', timer: 25 },
  { id: 'dc7', type: 'dyscalculia', mode: 'choice', correctChoiceIndex: 1, timer: 15 },
  { id: 'dc8', type: 'dyscalculia', mode: 'choice', correctChoiceIndex: 1, timer: 20 },
];

const riskFromScore = (score: number): 'low' | 'moderate' | 'high' => {
  if (score < 45) return 'high';
  if (score < 70) return 'moderate';
  return 'low';
};

const scoreColor = (score: number): string => {
  if (score < 45) return 'text-rose-600';
  if (score < 70) return 'text-amber-600';
  return 'text-emerald-600';
};

const getRiskRecommendations = (
  dyslexiaRisk: 'low' | 'moderate' | 'high',
  dyscalculiaRisk: 'low' | 'moderate' | 'high',
  t: (key: string) => string,
): string[] => {
  const recos: string[] = [];

  if (dyslexiaRisk !== 'low') {
    recos.push(t('studentPortal.reco.dyslexia1'));
    recos.push(t('studentPortal.reco.dyslexia2'));
  }

  if (dyscalculiaRisk !== 'low') {
    recos.push(t('studentPortal.reco.dyscalculia1'));
    recos.push(t('studentPortal.reco.dyscalculia2'));
  }

  if (!recos.length) {
    recos.push(t('studentPortal.reco.general'));
  }

  return recos;
};

const StudentPortal: React.FC = () => {
  const { currentUser, students, testSessions, createTestSession, updateStudent } = useAppContext();
  const { t, value, tArray } = useI18n();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(searchParams.get('studentId') || '');
  const [phase, setPhase] = useState<'intro' | 'testing' | 'success'>('intro');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_BANK[0].timer);
  const [textAnswer, setTextAnswer] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const activeStudentId = useMemo(() => {
    if (currentUser?.role === 'student') {
      return currentUser.studentId || '';
    }
    return selectedStudentId;
  }, [currentUser, selectedStudentId]);

  const activeStudent = students.find((s) => s._id === activeStudentId);

  const mySessions = useMemo(
    () => [...testSessions].filter((s) => s.studentId === activeStudentId).sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime()),
    [testSessions, activeStudentId],
  );

>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
  const latestSession = mySessions.length > 0 ? mySessions[0] : null;

  const currentQuestion = QUESTION_BANK[currentIndex];
  const currentLocalized = value(`studentPortal.questions.${currentQuestion.id}`) as { text: string; choices?: string[] } | undefined;
  const currentQuestionText = currentLocalized?.text || currentQuestion.id;
  const currentChoices = currentLocalized?.choices || [];
  const expectedChoice =
    currentQuestion.mode === 'choice' && typeof currentQuestion.correctChoiceIndex === 'number'
      ? currentChoices[currentQuestion.correctChoiceIndex] || ''
      : '';
  const expectedTextAnswers = tArray(`studentPortal.answers.${currentQuestion.id}`).map((x) => x.trim().toLowerCase());
  const progressPct = ((currentIndex + 1) / QUESTION_BANK.length) * 100;

  useEffect(() => {
    if (currentUser?.role === 'student' && currentUser.studentId) {
      setSelectedStudentId(currentUser.studentId);
    }
  }, [currentUser]);

  useEffect(() => {
    if (phase !== 'testing') return;
    setSecondsLeft(currentQuestion.timer);
    setTextAnswer('');
    setSelectedChoice('');
    setIsAnswered(false);
    setFeedback('');
  }, [phase, currentIndex, currentQuestion.timer]);

  useEffect(() => {
    if (phase !== 'testing' || isAnswered) return;
    if (secondsLeft <= 0) {
      submitCurrentAnswer('', true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [phase, secondsLeft, isAnswered]);

  const startAssessment = () => {
    if (!activeStudentId) return;
    setPhase('testing');
    setCurrentIndex(0);
    setAnswers([]);
    setSubmitError('');
  };

<<<<<<< HEAD
  const nextQ = () => {
    if (currentQ < 9) {
      setCurrentQ((prev) => prev + 1);
    }
  };

  const prevQ = () => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!currentUser?.studentId) return;

    const domains = DOMAINS.map((name, i) => ({
      name,
      score: scores[i]
    }));

    createTestSession({
      studentId: currentUser.studentId,
      domains,
      condition: 'calm',
      testDate: new Date().toISOString()
    });

    setTestPhase('success');

    setTimeout(() => {
      setTestPhase('intro');
      setScores(new Array(10).fill(50));
      setCurrentQ(0);
    }, 3000);
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
            onClick={() => setTestPhase('testing')}
            className="mt-8 w-full rounded-3xl bg-[var(--color-yellow-button)] px-6 py-5 text-xl font-bold text-[var(--color-black)] shadow-lg shadow-[rgba(255,213,0,0.3)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {t('studentPortal.startTest')}
=======
  const submitCurrentAnswer = (rawValue: string, timedOut = false) => {
    if (isAnswered) return;

    const normalizedValue = rawValue.trim().toLowerCase();
    const expected =
      currentQuestion.mode === 'choice'
        ? expectedChoice.trim().toLowerCase()
        : expectedTextAnswers;
    const isCorrect =
      !timedOut &&
      normalizedValue.length > 0 &&
      (Array.isArray(expected) ? expected.includes(normalizedValue) : normalizedValue === expected);
    const timeSpent = Math.max(0, currentQuestion.timer - secondsLeft);

    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      type: currentQuestion.type,
      mode: currentQuestion.mode,
      userAnswer: rawValue,
      isCorrect,
      timedOut,
      timeSpent,
    };

    setAnswers((prev) => [...prev, record]);
    setIsAnswered(true);

    if (currentQuestion.mode === 'choice') {
      setSelectedChoice(rawValue);
    }

    if (timedOut) {
      setFeedback(t('studentPortal.timeUp'));
    } else if (isCorrect) {
      setFeedback(t('studentPortal.correct'));
    } else {
      const expectedView = Array.isArray(expected)
        ? (expected[0] || '')
        : expected;
      setFeedback(t('studentPortal.expected', { answer: expectedView }));
    }
  };

  const onChoiceClick = (choice: string) => {
    submitCurrentAnswer(choice, false);
  };

  const onTextSubmit = () => {
    if (!textAnswer.trim()) return;
    submitCurrentAnswer(textAnswer, false);
  };

  const nextQuestion = async () => {
    if (currentIndex + 1 < QUESTION_BANK.length) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    await completeAssessment();
  };

  const completeAssessment = async () => {
    if (!activeStudentId) return;

    const sectionScore = (type: QuestionType) => {
      const scoped = answers.filter((a) => a.type === type);
      if (!scoped.length) return 0;
      const correct = scoped.filter((a) => a.isCorrect).length;
      return Math.round((correct / scoped.length) * 100);
    };

    const scoreByQuestionIds = (ids: string[]) => {
      const scoped = answers.filter((a) => ids.includes(a.questionId));
      if (!scoped.length) return 0;
      const correct = scoped.filter((a) => a.isCorrect).length;
      return Math.round((correct / scoped.length) * 100);
    };

    const dyslexiaScore = sectionScore('dyslexia');
    const dyscalculiaScore = sectionScore('dyscalculia');
    const dyslexiaRisk = riskFromScore(dyslexiaScore);
    const dyscalculiaRisk = riskFromScore(dyscalculiaScore);

    const recommendations = getRiskRecommendations(dyslexiaRisk, dyscalculiaRisk, t);

    const domains = [
      { name: t('studentPortal.domains.dyslexiaDecoding'), score: scoreByQuestionIds(['dy1', 'dy4', 'dy8']) },
      { name: t('studentPortal.domains.dyslexiaPhonology'), score: scoreByQuestionIds(['dy2', 'dy3', 'dy5', 'dy6', 'dy7']) },
      { name: t('studentPortal.domains.numericalReasoning'), score: scoreByQuestionIds(['dc1', 'dc2', 'dc5', 'dc7']) },
      { name: t('studentPortal.domains.arithmeticFluency'), score: scoreByQuestionIds(['dc3', 'dc4', 'dc6', 'dc8']) },
    ];

    const highestRisk =
      dyslexiaRisk === 'high' || dyscalculiaRisk === 'high'
        ? 'Referred'
        : dyslexiaRisk === 'moderate' || dyscalculiaRisk === 'moderate'
          ? 'Monitoring'
          : 'Active';

    const riskLabel = (risk: 'low' | 'moderate' | 'high') => {
      if (risk === 'low') return t('studentPortal.statusRiskLow');
      if (risk === 'moderate') return t('studentPortal.statusRiskModerate');
      return t('studentPortal.statusRiskHigh');
    };

    const aiAnalysis = [
      `Dyslexia score: ${dyslexiaScore}% (${riskLabel(dyslexiaRisk)})`,
      `Dyscalculia score: ${dyscalculiaScore}% (${riskLabel(dyscalculiaRisk)})`,
      `${t('studentPortal.recommendationsLabel')}:`,
      ...recommendations.map((r) => `- ${r}`),
    ].join('\n');

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await createTestSession({
        studentId: activeStudentId,
        domains,
        condition: 'calm',
        version: 'built-in-16q-v1',
        duration: answers.reduce((sum, item) => sum + item.timeSpent, 0),
        aiAnalysis,
        testDate: new Date().toISOString(),
      });

      if (currentUser?.role === 'teacher') {
        await updateStudent(activeStudentId, {
          status: highestRisk as 'Active' | 'Monitoring' | 'Referred',
          lastAssessmentDate: new Date().toISOString(),
        });
      }

      setPhase('success');

      window.setTimeout(() => {
        if (currentUser?.role === 'teacher') {
          navigate(`/student/${activeStudentId}`);
        } else {
          setPhase('intro');
        }
      }, 1800);
    } catch (err) {
      setSubmitError(t('studentPortal.saveError'));
      setPhase('intro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const radarData = latestSession?.domains.map((d) => ({
    domain: d.name,
    score: d.score,
    fullMark: 100,
  })) || [];

  const driHistory = [...mySessions].reverse().map((ts, idx) => ({
    name: `${t('studentPortal.test')} ${idx + 1}`,
    dri: Math.round(ts.dri),
  }));

  const teacherNeedsStudentSelection = currentUser?.role === 'teacher' && !activeStudentId;

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center mb-10">
      <div className="w-full card bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
        <h2 className="text-2xl font-bold">{t('studentPortal.title')}</h2>
        <p className="text-indigo-100 mt-1">{t('studentPortal.subtitle')}</p>
      </div>

      {phase === 'intro' && (
        <div className="w-full card shadow border-t-4 border-t-indigo-500 flex flex-col items-center text-center p-8 sm:p-12">
          <Brain className="w-16 h-16 text-indigo-500 mb-6" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            {mySessions.length > 0 ? t('studentPortal.retakeAssessment') : t('studentPortal.newAssessment')}
          </h3>
          <p className="text-slate-500 mb-6 max-w-xl">
            {t('studentPortal.intro')}
          </p>

          {currentUser?.role === 'teacher' && (
            <div className="w-full max-w-md mb-6 text-left">
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('studentPortal.studentLabel')}</label>
              <select
                className="input-primary"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="">{t('progress.selectStudent')}</option>
                {students.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeStudent && (
            <div className="mb-6 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
              {t('studentPortal.selectedStudent', { name: activeStudent.fullName })}
            </div>
          )}

          {submitError && (
            <div className="w-full max-w-xl p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-100 mb-4">
              {submitError}
            </div>
          )}

          <button
            onClick={startAssessment}
            disabled={teacherNeedsStudentSelection || isSubmitting}
            className="btn-primary text-lg px-8 py-3 rounded-full shadow-md hover:shadow-lg transition disabled:opacity-60"
          >
            {isSubmitting ? t('dashboard.saving') : mySessions.length > 0 ? t('studentPortal.startRetake') : t('studentPortal.startTest')}
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {testPhase === 'testing' && (
        <div className="w-full rounded-[32px] bg-panel p-8 shadow-2xl border border-panel">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--color-fox-dark)]">{t('studentPortal.question')} {currentQ + 1} / 10</p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--color-fox-dark)]">{t('studentPortal.chooseNumber')}</h2>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[rgba(47,168,204,0.12)] text-[var(--color-ui-dark)] shadow-sm">
              <Star className="h-8 w-8" />
            </div>
          </div>

          <div className="rounded-[32px] bg-panel-soft p-8 text-center shadow-inner border border-panel">
            <p className="text-5xl font-extrabold text-[var(--color-ui-dark)]">{scores[currentQ]}</p>
            <p className="mt-3 text-[var(--color-fox-dark)]">{t('studentPortal.moveSlider')}</p>
          </div>

          <div className="mt-8">
            <input
              type="range"
              min="0"
              max="100"
              value={scores[currentQ]}
              onChange={handleSlider}
              className="w-full accent-[var(--color-ui)]"
            />
            <div className="mt-4 flex justify-between text-sm text-[var(--color-fox-dark)]">
              <span>{t('studentPortal.low')}</span>
              <span>{t('studentPortal.high')}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={prevQ}
              disabled={currentQ === 0}
              className="w-full rounded-3xl bg-panel-soft px-6 py-4 text-base font-semibold text-[var(--color-fox-dark)] transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('studentPortal.previous')}
            </button>
            {currentQ < 9 ? (
              <button
                type="button"
                onClick={nextQ}
                className="w-full rounded-3xl bg-brand px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {t('studentPortal.next')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded-3xl bg-[var(--color-yellow-button)] px-6 py-4 text-base font-bold text-[var(--color-black)] shadow-lg shadow-[rgba(255,213,0,0.3)] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {t('studentPortal.finish')}
              </button>
            )}
=======
      {phase === 'testing' && (
        <div className="w-full card shadow border border-indigo-100">
          <div className="w-full h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progressPct}%` }}></div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold tracking-wide text-indigo-600 uppercase">
              {t('studentPortal.questionOf', { current: currentIndex + 1, total: QUESTION_BANK.length })}
            </span>
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <Clock3 className="w-4 h-4" />
              <span>{t('studentPortal.secondsLeft', { seconds: secondsLeft })}</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
              {currentQuestion.type === 'dyslexia' ? t('studentPortal.sectionDyslexia') : t('studentPortal.sectionDyscalculia')}
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">{currentQuestionText}</h3>
          </div>

          {currentQuestion.mode === 'choice' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentChoices.map((choice) => {
                const isSelected = selectedChoice === choice;
                const isCorrectChoice = isAnswered && choice.toLowerCase() === expectedChoice.toLowerCase();
                const isWrongSelection = isAnswered && isSelected && !isCorrectChoice;

                return (
                  <button
                    key={choice}
                    onClick={() => onChoiceClick(choice)}
                    disabled={isAnswered}
                    className={`p-4 rounded-xl border-2 text-left font-semibold transition ${
                      isCorrectChoice
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : isWrongSelection
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700'
                    } disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                className="input-primary text-base"
                value={textAnswer}
                disabled={isAnswered}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onTextSubmit();
                  }
                }}
                placeholder={t('studentPortal.typeAnswer')}
              />
              <button
                onClick={onTextSubmit}
                disabled={isAnswered || !textAnswer.trim()}
                className="btn-primary disabled:opacity-60"
              >
                {t('studentPortal.submitAnswer')}
              </button>
            </div>
          )}

          {feedback && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${feedback === t('studentPortal.correct') ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {feedback}
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-slate-100 mt-6">
            <button
              onClick={nextQuestion}
              disabled={!isAnswered || isSubmitting}
              className="btn-primary disabled:opacity-60"
            >
              {currentIndex + 1 < QUESTION_BANK.length ? t('studentPortal.nextQuestion') : t('studentPortal.finishTest')}
            </button>
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
          </div>
        </div>
      )}

<<<<<<< HEAD
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
=======
      {phase === 'success' && (
        <div className="w-full card shadow p-16 flex flex-col items-center text-center animate-pulse">
          <CheckCircle className="w-20 h-20 text-emerald-500 mb-6" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('studentPortal.resultsSaved')}</h3>
          <p className="text-slate-500">
            {currentUser?.role === 'teacher'
              ? t('studentPortal.backTeacher')
              : t('studentPortal.sentTeacher')}
          </p>
        </div>
      )}

      {phase === 'intro' && mySessions.length > 0 && currentUser?.role === 'teacher' && (
        <>
          <div className="w-full card">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">{t('studentPortal.summary')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">{t('dashboard.dri')}</p>
                <p className="text-2xl font-black text-slate-800">{Math.round(latestSession?.dri || 0)}</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">{t('studentPortal.summaryTier')}</p>
                <p className="text-2xl font-black text-slate-800">{latestSession?.tier ?? 0}</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">{t('studentPortal.summaryDate')}</p>
                <p className="text-base font-bold text-slate-700">{latestSession ? new Date(latestSession.testDate).toLocaleDateString() : '-'}</p>
              </div>
            </div>

            {latestSession?.domains?.length ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {latestSession.domains.map((d) => (
                  <div key={d.name} className="flex justify-between p-2 rounded border border-slate-100 bg-white">
                    <span className="text-slate-600">{d.name}</span>
                    <span className={`font-bold ${scoreColor(d.score)}`}>{Math.round(d.score)}%</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('studentPortal.latestDomainProfile')}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="domain" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar name={t('dashboard.dri')} dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('studentPortal.driHistory')}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={driHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Line type="monotone" dataKey="dri" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
      )}
    </div>
  );
};

export default StudentPortal;
