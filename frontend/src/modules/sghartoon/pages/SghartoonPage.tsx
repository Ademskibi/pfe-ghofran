import React, { useState, useEffect } from 'react';
import { TestPlayer } from '../components/TestPlayer';
import { DYSLEXIA_QUESTIONS, DYSCALCULIA_QUESTIONS } from '../data/questionBank';
import { TestScore, Question } from '../hooks/useTestEngine';
import { ageToComplexityPool, scoreToGravity, CURRICULUM } from '../data/taxonomy';
import styles from '../styles/sghartoonPage.module.css';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  classLevel: string;
}

const SghartoonPage: React.FC = () => {
  const [stage, setStage] = useState<
    'select' | 'test' | 'results'
  >('select');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [testScore, setTestScore] = useState<TestScore | null>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);

  // Mock students - replace with API call
  const mockStudents: Student[] = [
    {
      id: '1',
      firstName: 'Mariem',
      lastName: 'Trabelsi',
      age: 7,
      classLevel: '2ème année de base',
    },
    {
      id: '2',
      firstName: 'Mohamed',
      lastName: 'Ben Salah',
      age: 9,
      classLevel: '4ème année de base',
    },
    {
      id: '3',
      firstName: 'Nour',
      lastName: 'Hamdi',
      age: 11,
      classLevel: '6ème année de base',
    },
  ];

  const handleStartTest = (student: Student, testType: 'dyslexia' | 'dyscalculia') => {
    setSelectedStudent(student);

    // Select questions by pool
    const pool = ageToComplexityPool(student.age);
    const allQuestions = testType === 'dyslexia' ? DYSLEXIA_QUESTIONS : DYSCALCULIA_QUESTIONS;

    // Filter by complexity and randomize
    const filtered = allQuestions.filter((q) => q.cx === pool);
    const selected = filtered
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((q) => ({
        ...q,
        type: testType,
      }));

    setTestQuestions(selected);
    setStage('test');
  };

  const handleTestComplete = (score: TestScore) => {
    setTestScore(score);
    setStage('results');
  };

  const handleBackToSelect = () => {
    setStage('select');
    setSelectedStudent(null);
    setTestScore(null);
    setTestQuestions([]);
  };

  if (stage === 'test' && selectedStudent && testQuestions.length > 0) {
    return (
      <TestPlayer
        studentName={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
        studentAge={selectedStudent.age}
        questions={testQuestions}
        onComplete={handleTestComplete}
        onCancel={handleBackToSelect}
      />
    );
  }

  if (stage === 'results' && selectedStudent && testScore) {
    const dyGravity = scoreToGravity(testScore.dyS);
    const dcGravity = scoreToGravity(testScore.dcS);
    const pool = ageToComplexityPool(selectedStudent.age);
    const poolKey = pool === 1 ? '1ère-2ème' : pool === 2 ? '3ème-4ème' : '5ème-6ème';
    const currDy = CURRICULUM.dyslexia[poolKey];
    const currDc = CURRICULUM.dyscalculia[poolKey];

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <h1>📊 Résultats Sghartoon</h1>
          <button className={styles.backBtn} onClick={handleBackToSelect}>
            ← Retour
          </button>
        </div>

        <div className={styles.studentInfo}>
          <div className={styles.studentName}>
            {selectedStudent.firstName} {selectedStudent.lastName}
          </div>
          <div className={styles.studentMeta}>
            {selectedStudent.age} ans · {selectedStudent.classLevel}
          </div>
        </div>

        <div className={styles.resultsGrid}>
          {/* Dyslexia Results */}
          <div
            className={styles.resultBox}
            style={{ background: dyGravity.bg, borderColor: dyGravity.color }}
          >
            <h3 style={{ color: dyGravity.color }}>📖 Dyslexie</h3>
            <div className={styles.scorePercentage} style={{ color: dyGravity.color }}>
              {Math.round(testScore.dyS * 100)}%
            </div>
            <div style={{ color: dyGravity.color, fontSize: '0.9rem' }}>
              {dyGravity.ic} {dyGravity.code} — {dyGravity.label}
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: dyGravity.color,
                marginTop: '8px',
              }}
            >
              {testScore.dyFlLabel} {testScore.dyFlSec}
            </div>
          </div>

          {/* Dyscalculia Results */}
          <div
            className={styles.resultBox}
            style={{ background: dcGravity.bg, borderColor: dcGravity.color }}
          >
            <h3 style={{ color: dcGravity.color }}>🔢 Dyscalculie</h3>
            <div className={styles.scorePercentage} style={{ color: dcGravity.color }}>
              {Math.round(testScore.dcS * 100)}%
            </div>
            <div style={{ color: dcGravity.color, fontSize: '0.9rem' }}>
              {dcGravity.ic} {dcGravity.code} — {dcGravity.label}
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: dcGravity.color,
                marginTop: '8px',
              }}
            >
              {testScore.dcFlLabel} {testScore.dcFlSec}
            </div>
          </div>
        </div>

        {/* Curriculum Info */}
        <div className={styles.curriculumBox}>
          <h3>📚 Référentiel curriculaire — MEN Tunisie</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
            {currDy.label}
          </p>
          <div className={styles.competencesList}>
            {currDy.competences.slice(0, 2).map((c, i) => (
              <div key={i} className={styles.competence}>
                📖 {c}
              </div>
            ))}
            {currDc.competences.slice(0, 2).map((c, i) => (
              <div key={i} className={styles.competence}>
                🔢 {c}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button
            className={styles.retakeBtn}
            onClick={() => handleStartTest(selectedStudent, 'dyslexia')}
          >
            🔄 Refaire le test
          </button>
          <button className={styles.reportBtn}>🖨️ Générer rapport</button>
        </div>
      </div>
    );
  }

  // Selection stage
  return (
    <div className={styles.selectionContainer}>
      <div className={styles.selectionHeader}>
        <div className={styles.logo}>🦁</div>
        <h1>Sghartoon Enseignant 🇹🇳</h1>
        <p>Dépistage adaptatif — Dyslexie & Dyscalculie (MEN Tunisie)</p>
      </div>

      <div className={styles.studentList}>
        <h2>Sélectionnez un élève</h2>
        <div className={styles.studentGrid}>
          {mockStudents.map((student) => (
            <div key={student.id} className={styles.studentCard}>
              <div className={styles.studentCardContent}>
                <div className={styles.studentInitials}>
                  {student.firstName[0]}
                  {student.lastName[0]}
                </div>
                <div>
                  <div className={styles.cardName}>
                    {student.firstName} {student.lastName}
                  </div>
                  <div className={styles.cardMeta}>
                    {student.age} ans · {student.classLevel}
                  </div>
                </div>
              </div>
              <div className={styles.testButtons}>
                <button
                  className={styles.testBtnDy}
                  onClick={() => handleStartTest(student, 'dyslexia')}
                >
                  📖 Dyslexie
                </button>
                <button
                  className={styles.testBtnDc}
                  onClick={() => handleStartTest(student, 'dyscalculia')}
                >
                  🔢 Dyscalculie
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.infoBox}>
        <h3>ℹ️ À propos de Sghartoon</h3>
        <p>
          Sghartoon est un outil de dépistage pédagogique adaptatif couvrant
          l'ensemble du curriculum tunisien (1ère–6ème année de base). Les
          questions s'ajustent à l'âge de l'élève. En cas de gravité G2/G3,
          orienter vers un spécialiste.
        </p>
      </div>
    </div>
  );
};

export default SghartoonPage;
