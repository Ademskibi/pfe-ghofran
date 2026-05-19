import React, { useEffect, useState } from 'react';
import { Question, useTestEngine, TestScore } from '../hooks/useTestEngine';
import { ageToComplexityPool, scoreToGravity } from '../data/taxonomy';
import styles from '../styles/testPlayer.module.css';

interface TestPlayerProps {
  studentName: string;
  studentAge: number;
  questions: Question[];
  onComplete: (score: TestScore) => void;
  onCancel: () => void;
}

export const TestPlayer: React.FC<TestPlayerProps> = ({
  studentName,
  studentAge,
  questions,
  onComplete,
  onCancel,
}) => {
  const engine = useTestEngine(questions);
  const [showWelcome, setShowWelcome] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'incorrect';
    message: string;
  } | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  const pool = ageToComplexityPool(studentAge);
  const poolLabel = pool === 1 ? '🅰 Base' : pool === 2 ? '🅱 Intermédiaire' : '🅲 Avancé';

  const handleChoiceClick = (choice: string) => {
    if (engine.isAnswered) return;
    const isCorrect = choice === engine.currentQuestion?.ans;
    setSelectedChoice(choice);
    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect
        ? '✅ Bravo !'
        : `😊 Bonne réponse : ${engine.currentQuestion?.ans}`,
    });
    engine.submitAnswer(isCorrect, choice);
  };

  const handleTextSubmit = () => {
    if (engine.isAnswered || !textInput.trim()) return;
    const isCorrect =
      textInput.trim().toLowerCase() ===
      engine.currentQuestion?.ans.toLowerCase();
    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect
        ? '✅ Bravo !'
        : `😊 Bonne réponse : ${engine.currentQuestion?.ans}`,
    });
    engine.submitAnswer(isCorrect, textInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    }
  };

  const handleNext = () => {
    if (engine.isTestComplete) {
      const score = engine.computeScore();
      onComplete(score);
    } else {
      setSelectedChoice(null);
      setTextInput('');
      setFeedback(null);
      engine.goToNext();
    }
  };

  if (engine.isTestComplete && !showWelcome) {
    return (
      <div className={styles.completionScreen}>
        <div className={styles.celebrations}>🎉</div>
        <h2>Bravo {studentName} !</h2>
        <p>Tu as répondu à toutes les questions.</p>
        <p>Tu as très bien travaillé !</p>
        <div className={styles.stars}>⭐⭐⭐</div>
        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Dis à ton enseignant(e) que tu as terminé. 😊
        </p>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className={styles.welcomeScreen}>
        <div className={styles.welcomeEmoji}>🦁</div>
        <span className={styles.welcomeBadge}>🇹🇳 Sghartoon Enseignant</span>
        <h2>Bonjour {studentName} !</h2>
        <p>
          Tu vas répondre à <strong>{questions.length} questions</strong>.
          <br />
          Fais de ton mieux et prends ton temps.
          <br />
          Il n't y a pas de mauvaises réponses ! 😊🌟
        </p>
        <button
          className={styles.btnBegin}
          onClick={() => setShowWelcome(false)}
        >
          C'est parti ! ✨
        </button>
        <button className={styles.btnCancel} onClick={onCancel}>
          Annuler
        </button>
      </div>
    );
  }

  const q = engine.currentQuestion;
  if (!q) return null;

  const questionType = q.id.startsWith('dy') ? 'dyslexia' : 'dyscalculia';
  const typeLabel =
    questionType === 'dyslexia' ? '📖 Dyslexie' : '🔢 Dyscalculie';
  const typeClass = questionType === 'dyslexia' ? 'cbdy' : 'cbdc';

  const timerColor =
    engine.timeRemaining < 5
      ? '#dc2626'
      : engine.timeRemaining < 10
        ? '#d97706'
        : '#c0392b';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.studentTag}>{studentName}</div>
        <div className={styles.complexityBadge}>{poolLabel}</div>
        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>
            Question {engine.currentIndex + 1} / {questions.length}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${engine.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <span className={`${styles.categoryBadge} ${styles[typeClass]}`}>
          {typeLabel}
        </span>

        <div className={styles.timer}>
          <div className={styles.timerBar}>
            <div
              className={styles.timerFill}
              style={{
                width: `${(engine.timeRemaining / q.tl) * 100}%`,
                background: timerColor,
              }}
            ></div>
          </div>
          <div className={styles.timerText}>{engine.timeRemaining}s</div>
        </div>

        <div className={styles.questionDomain}>{q.domain}</div>
        <div className={styles.questionText}>{q.inst}</div>

        {q.stim && (
          <div className={`${styles.stimulus} ${styles[q.sc || 'stimEm']}`}>
            {q.stim}
          </div>
        )}

        <div className={styles.answersContainer} id="aa">
          {q.qt === 'choice' ? (
            <div className={styles.choices}>
              {q.choices?.map((choice) => (
                <button
                  key={choice}
                  className={`${styles.choiceBtn} ${
                    selectedChoice === choice
                      ? q.ans === choice
                        ? styles.correct
                        : styles.incorrect
                      : ''
                  } ${engine.isAnswered ? styles.disabled : ''}`}
                  onClick={() => handleChoiceClick(choice)}
                  disabled={engine.isAnswered}
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.textAnswerContainer}>
              <input
                type="text"
                className={styles.textInput}
                placeholder="Écris ta réponse..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={engine.isAnswered}
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
              <button
                className={styles.submitBtn}
                onClick={handleTextSubmit}
                disabled={engine.isAnswered || !textInput.trim()}
              >
                OK ✓
              </button>
            </div>
          )}
        </div>

        {feedback && (
          <div className={`${styles.feedback} ${styles[feedback.type]}`}>
            {feedback.message}
          </div>
        )}

        <div className={styles.navigation}>
          <div className={styles.timingInfo}>
            ⏱ {engine.isAnswered ? 'En attente...' : 'En cours…'}
          </div>
          <button
            className={styles.nextBtn}
            onClick={handleNext}
            disabled={!engine.isAnswered}
          >
            {engine.currentIndex + 1 < questions.length ? 'Suivant →' : 'Terminer ✓'}
          </button>
        </div>
      </div>
    </div>
  );
};
