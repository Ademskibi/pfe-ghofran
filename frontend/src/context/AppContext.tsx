import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, TestSession, InterventionStrategy, UserToken } from '../types';

interface AppContextType {
  students: Student[];
  testSessions: TestSession[];
  interventionStrategies: InterventionStrategy[];
  currentUser: UserToken | null;
  authToken: string | null;
  loading: boolean;
  error: string | null;
  login: (token: string) => void;
  logout: () => void;
  fetchStudents: () => Promise<void>;
  addStudent: (data: Partial<Student>) => Promise<void>;
  addStudentWithAccount: (data: Partial<Student> & { email: string; password: string }) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  fetchTestSessions: (studentId?: string) => Promise<void>;
  createTestSession: (data: Partial<TestSession>) => Promise<void>;
  fetchInterventions: () => Promise<void>;
  fetchFullReport: (studentId?: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [testSessions, setTestSessions] = useState<TestSession[]>([]);
  const [interventionStrategies, setInterventionStrategies] = useState<InterventionStrategy[]>([]);
  const [currentUser, setCurrentUser] = useState<UserToken | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const token = sessionStorage.getItem('neurocal_token');
    if (token) {
      try {
        const payloadStr = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadStr) as UserToken;
        if (payload.exp && payload.exp * 1000 < Date.now()) {
           sessionStorage.removeItem('neurocal_token');
           setCurrentUser(null);
           setAuthToken(null);
        } else {
           setCurrentUser(payload);
           setAuthToken(token);
        }
      } catch (e) {
        console.error('Invalid token format');
        sessionStorage.removeItem('neurocal_token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authToken && currentUser) {
      if (currentUser.role === 'teacher') {
        fetchStudents();
        fetchTestSessions();
        fetchInterventions();
      } else if (currentUser.role === 'student' && currentUser.studentId) {
        fetchTestSessions(currentUser.studentId);
      }
    }
  }, [authToken, currentUser]);

  const login = (token: string) => {
    sessionStorage.setItem('neurocal_token', token);
    const payloadStr = atob(token.split('.')[1]);
    const payload = JSON.parse(payloadStr) as UserToken;
    setCurrentUser(payload);
    setAuthToken(token);
  };

  const logout = () => {
    sessionStorage.removeItem('neurocal_token');
    setCurrentUser(null);
    setAuthToken(null);
    setStudents([]);
    setTestSessions([]);
    setInterventionStrategies([]);
  };

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };
  };

  const fetchStudents = async () => {
    if (!authToken || currentUser?.role !== 'teacher') return;
    try {
      const res = await fetch(`${API_URL}/students`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addStudent = async (data: Partial<Student>) => {
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchStudents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addStudentWithAccount = async (data: Partial<Student> & { email: string; password: string }) => {
    const res = await fetch(`${API_URL}/students/with-account`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || 'Failed to create student with account');
    }

    await fetchStudents();
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    try {
      const res = await fetch(`${API_URL}/students/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchStudents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        await fetchStudents();
        await fetchTestSessions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTestSessions = async (studentId?: string) => {
    try {
      const url = studentId ? `${API_URL}/testSessions?studentId=${studentId}` : `${API_URL}/testSessions`;
      const res = await fetch(url, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (studentId) {
          // just update for this student specifically if user is student, else it gets all
          if (currentUser?.role === 'student') setTestSessions(data);
          else {
            // Teacher gets all - might need optimization but fine for now
            const others = testSessions.filter(ts => ts.studentId !== studentId);
            setTestSessions([...others, ...data].sort((a,b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime()));
          }
        } else {
          setTestSessions(data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createTestSession = async (data: Partial<TestSession>) => {
    try {
      const res = await fetch(`${API_URL}/testSessions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) {
         if (currentUser?.role === 'student' && currentUser?.studentId) {
             await fetchTestSessions(currentUser.studentId);
         } else {
             await fetchTestSessions();
         }
         await fetchStudents(); // Update latest assessment date in UI
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInterventions = async () => {
    if (!authToken || currentUser?.role !== 'teacher') return;
    try {
      const res = await fetch(`${API_URL}/interventions`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setInterventionStrategies(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFullReport = async (studentId?: string) => {
    try {
      const url = studentId ? `${API_URL}/reports/full?studentId=${studentId}` : `${API_URL}/reports/full`;
      const res = await fetch(url, { headers: getHeaders() });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return (
    <AppContext.Provider
      value={{
        students,
        testSessions,
        interventionStrategies,
        currentUser,
        authToken,
        loading,
        error,
        login,
        logout,
        fetchStudents,
        addStudent,
        addStudentWithAccount,
        updateStudent,
        deleteStudent,
        fetchTestSessions,
        createTestSession,
        fetchInterventions,
        fetchFullReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
