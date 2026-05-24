import React, { useState, useMemo } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Student } from '../types';

interface StudentListProps {
  students: Student[];
  selectedStudentId: string | null;
  onSelectStudent: (studentId: string) => void;
  testSessions: any[];
}

const StudentListPanel: React.FC<StudentListProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
  testSessions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.classGroup?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const getStudentSeverity = (studentId: string) => {
    const sessions = testSessions.filter((s) => s.studentId === studentId);
    if (sessions.length === 0) return null;
    const latestSession = sessions[0];
    return latestSession.tier || 0;
  };

  const getSeverityBadge = (tier: number | null) => {
    if (tier === null) return null;
    const badges: Record<number, { label: string; color: string; bg: string }> = {
      0: { label: 'G0', color: 'text-slate-600', bg: 'bg-slate-100' },
      1: { label: 'G1', color: 'text-sahartoon-success', bg: 'bg-green-50' },
      2: { label: 'G2', color: 'text-sahartoon-warning', bg: 'bg-amber-50' },
      3: { label: 'G3', color: 'text-sahartoon-danger', bg: 'bg-red-50' },
    };
    const badge = badges[tier];
    return badge ? (
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${badge.bg} ${badge.color}`}>
        {badge.label}
      </span>
    ) : null;
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-50 text-red-600 border border-red-200',
      'bg-blue-50 text-blue-600 border border-blue-200',
      'bg-emerald-50 text-emerald-600 border border-emerald-200',
      'bg-purple-50 text-purple-600 border border-purple-200',
      'bg-pink-50 text-pink-600 border border-pink-200',
      'bg-cyan-50 text-cyan-600 border border-cyan-200',
      'bg-amber-50 text-amber-600 border border-amber-200',
      'bg-orange-50 text-orange-600 border border-orange-200',
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateAge = (dateOfBirth: string | Date) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-base)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="p-4" style={{ borderBottom: '1px solid var(--border-base)' }}>
        <h3 className="text-xs uppercase font-mono tracking-widest mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <span className="h-2 w-2 rounded-full animate-pulse-soft" style={{ backgroundColor: 'var(--brand-cyan)' }}></span>
          Élèves Inscrits
        </h3>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-primary pl-10"
          />
        </div>
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-y-auto">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <p className="text-slate-500 text-sm font-medium">Aucun élève trouvé</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredStudents.map((student) => {
              const severity = getStudentSeverity(student._id);
              const isSelected = selectedStudentId === student._id;

              return (
                <button
                  key={student._id}
                  onClick={() => onSelectStudent(student._id)}
                  className="w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-center justify-between gap-3 group"
                  style={isSelected ? {
                    backgroundColor: 'rgba(17,180,215,0.08)',
                    border: '1px solid rgba(17,180,215,0.25)',
                  } : {
                    backgroundColor: 'var(--bg-muted)',
                    border: '1px solid var(--border-base)',
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${getAvatarColor(student.fullName)}`}
                    >
                      {getInitials(student.fullName)}
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                        {student.fullName}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        <span>{calculateAge(student.dateOfBirth)} ANS</span>
                        <span>•</span>
                        <span>CLASSE {student.grade}</span>
                      </div>
                    </div>
                  </div>

                  {/* Severity Badge */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {getSeverityBadge(severity)}
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 transition-all duration-200 ${isSelected ? 'translate-x-1 text-sahartoon-burgundy' : 'group-hover:translate-x-0.5'}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div
        className="px-4 py-3 text-[10px] font-mono tracking-wider text-center"
        style={{ borderTop: '1px solid var(--border-base)', backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}
      >
        {filteredStudents.length} / {students.length} élèves
      </div>
    </div>
  );
};

export default StudentListPanel;
