import { useState } from 'react';
import { TestScore } from './useTestEngine';

interface SaveTestResultParams {
  studentId: string;
  testType: 'dyslexia' | 'dyscalculia';
  score: number;           // 0-1 score
  duration: number;        // milliseconds
  answers: {
    index: number;
    userAnswer: string | number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  differentialFactors?: {
    vision?: boolean;
    hearing?: boolean;
    attention?: boolean;
    languageBarrier?: boolean;
    absenteeism?: boolean;
    familyHistory?: boolean;
    socioeconomicContext?: boolean;
  };
  condition?: string;
}

export const useSaveTestResult = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveResult = async (params: SaveTestResultParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/resultat-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: params.studentId,
          testType: params.testType,
          score: params.score,
          time: Math.floor(params.duration / 1000), // Convert to seconds
          duration: Math.floor(params.duration / 1000),
          answers: params.answers,
          differentialFactors: params.differentialFactors || {},
          condition: params.condition || 'normal',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setLoading(false);
      throw err;
    }
  };

  return {
    saveResult,
    loading,
    error,
  };
};

export const useFetchStudents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async (classId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const url = classId
        ? `/api/students?classId=${classId}`
        : '/api/students';

      const response = await fetch(url, {
        headers: {
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.status}`);
      }

      const students = await response.json();
      setLoading(false);
      return students;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setLoading(false);
      throw err;
    }
  };

  return {
    fetchStudents,
    loading,
    error,
  };
};

export const useFetchTestResults = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async (studentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/resultat-tests/${studentId}`, {
        headers: {
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.status}`);
      }

      const results = await response.json();
      setLoading(false);
      return results;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setLoading(false);
      throw err;
    }
  };

  return {
    fetchResults,
    loading,
    error,
  };
};
