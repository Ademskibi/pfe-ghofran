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
      'bg-red-100 text-red-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-indigo-100 text-indigo-600',
      'bg-yellow-100 text-yellow-600',
      'bg-orange-100 text-orange-600',
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
    <div className="flex flex-col h-full bg-white rounded-xl shadow-soft overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-sahartoon-neutral/20">
        <h3 className="text-lg font-bold text-sahartoon-dark mb-4">👩‍🎓 Élèves</h3>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-sahartoon-beige border border-sahartoon-neutral/30 rounded-lg text-sm text-sahartoon-dark placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sahartoon-burgundy/20 focus:border-sahartoon-burgundy transition-all duration-200"
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
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center justify-between gap-3 group ${
                    isSelected
                      ? 'bg-sahartoon-burgundy/10 border-2 border-sahartoon-burgundy shadow-soft-md'
                      : 'bg-sahartoon-beige/50 border border-transparent hover:bg-sahartoon-beige hover:shadow-soft'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(student.fullName)}`}
                    >
                      {getInitials(student.fullName)}
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-sahartoon-dark truncate">
                        {student.fullName}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>{calculateAge(student.dateOfBirth)} ans</span>
                        <span>•</span>
                        <span>Classe {student.grade}</span>
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
      <div className="px-4 py-3 border-t border-sahartoon-neutral/20 bg-sahartoon-beige/30 text-xs text-slate-600 font-medium text-center">
        {filteredStudents.length} de {students.length} élèves
      </div>
    </div>
  );
};

export default StudentListPanel;
