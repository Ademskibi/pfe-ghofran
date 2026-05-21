import React, { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { Student } from '../types';
import SeverityLegendBar from '../components/SeverityLegendBar';
import DashboardStats from '../components/DashboardStats';
import StudentListPanel from '../components/StudentListPanel';
import ResultsPanel from '../components/ResultsPanel';

const Dashboard: React.FC = () => {
  const { students, testSessions, addStudent } = useAppContext();
  const { t } = useTranslation();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Calculate severity counts
  const tierCounts = [0, 0, 0, 0];
  testSessions.forEach((ts) => {
    if (ts.tier >= 0 && ts.tier <= 3) {
      tierCounts[ts.tier]++;
    }
  });

  const testsCompleted = testSessions.length;

  // Handle export CSV
  const handleExport = useCallback(() => {
    const headers = ['Nom', 'Âge', 'Classe', 'Dernier test', 'Gravité', 'DRI'];
    const rows = students.map((student) => {
      const latestSession = testSessions.find((s) => s.studentId === student._id);
      return [
        student.fullName,
        new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear(),
        student.grade || '',
        latestSession
          ? new Date(latestSession.testDate).toLocaleDateString('fr-FR')
          : '',
        latestSession ? `G${latestSession.tier}` : '',
        latestSession ? Math.round(latestSession.dri) : '',
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sahartoon_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [students, testSessions]);

  const selectedStudent = students.find((s) => s._id === selectedStudentId) || null;

  return (
    <div className="min-h-screen bg-sahartoon-beige dark:bg-slate-900 transition-colors duration-300">
      {/* Dark Maroon Header */}
      <div className="bg-sahartoon-burgundy text-white px-6 py-4 shadow-soft">
        <h1 className="text-2xl font-bold">Sahartoon Enseignant TN</h1>
        <p className="text-white/80 text-sm mt-1">Dépistage des troubles DYS — Niveaux de gravité</p>
      </div>

      {/* Severity Legend */}
      <SeverityLegendBar
        g0Count={tierCounts[0]}
        g1Count={tierCounts[1]}
        g2Count={tierCounts[2]}
        g3Count={tierCounts[3]}
        total={testSessions.length || 1}
      />

      {/* Stats Cards */}
      <DashboardStats
        totalStudents={students.length}
        testsCompleted={testsCompleted}
        g1Count={tierCounts[1]}
        g2Count={tierCounts[2]}
        g3Count={tierCounts[3]}
      />

      {/* Main Content Area - Split Layout */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Left Panel - Student List (35%) */}
          <div className="lg:col-span-1">
            <StudentListPanel
              students={students}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
              testSessions={testSessions}
            />
          </div>

          {/* Right Panel - Results & Gravity (65%) */}
          <div className="lg:col-span-2">
            <ResultsPanel
              selectedStudent={selectedStudent}
              testSessions={testSessions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
