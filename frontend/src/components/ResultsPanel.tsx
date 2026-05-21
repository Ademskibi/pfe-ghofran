import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertCircle, TrendingUp, Brain, Gauge } from 'lucide-react';
import { Student } from '../types';

interface ResultsPanelProps {
  selectedStudent: Student | null;
  testSessions: any[];
  onTabChange?: (tab: string) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  selectedStudent,
  testSessions,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<'results' | 'analytics'>('results');

  const handleTabChange = (tab: 'results' | 'analytics') => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  if (!selectedStudent) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-8 h-full flex flex-col items-center justify-center text-center">
        <div className="mb-4 p-4 rounded-full bg-sahartoon-beige">
          <AlertCircle className="w-8 h-8 text-sahartoon-burgundy/40" />
        </div>
        <h3 className="text-lg font-semibold text-sahartoon-dark mb-1">
          Sélectionnez un élève
        </h3>
        <p className="text-sm text-slate-500">
          Cliquez sur un élève dans la liste pour voir ses résultats et son analyse de gravité.
        </p>
      </div>
    );
  }

  const studentSessions = testSessions
    .filter((s) => s.studentId === selectedStudent._id)
    .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());

  const latestSession = studentSessions[0];

  // Prepare chart data
  const chartData = studentSessions.slice(0, 10).reverse().map((session, index) => ({
    date: new Date(session.testDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    dri: Math.round(session.dri || 0),
    tier: session.tier,
  }));

  const getTierLabel = (tier: number | undefined) => {
    const labels: Record<number, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
      0: { label: 'G0 — Dans la norme', color: 'text-slate-600', bg: 'bg-slate-100', icon: '✓' },
      1: { label: 'G1 — Léger', color: 'text-sahartoon-success', bg: 'bg-green-50', icon: '!' },
      2: { label: 'G2 — Modéré', color: 'text-sahartoon-warning', bg: 'bg-amber-50', icon: '⚠' },
      3: { label: 'G3 — Sévère', color: 'text-sahartoon-danger', bg: 'bg-red-50', icon: '✕' },
    };
    return labels[tier || 0];
  };

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-sahartoon-neutral/20 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange('results')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'results'
                ? 'bg-sahartoon-burgundy text-white shadow-soft-md'
                : 'text-slate-600 hover:bg-sahartoon-beige'
            }`}
          >
            📊 Résultats
          </button>
          <button
            onClick={() => handleTabChange('analytics')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-sahartoon-burgundy text-white shadow-soft-md'
                : 'text-slate-600 hover:bg-sahartoon-beige'
            }`}
          >
            📈 Vue classe
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'results' && latestSession && (
          <div className="space-y-6 animate-fadeIn">
            {/* Student Header */}
            <div className="pb-4 border-b border-sahartoon-neutral/20">
              <h3 className="text-xl font-bold text-sahartoon-dark mb-1">
                {selectedStudent.fullName}
              </h3>
              <p className="text-sm text-slate-500">
                Classe {selectedStudent.grade} • {selectedStudent.classGroup}
              </p>
            </div>

            {/* Latest Severity Card */}
            {latestSession && (
              <div
                className={`p-6 rounded-xl border-l-4 ${
                  getTierLabel(latestSession.tier).bg
                } border-l-sahartoon-burgundy shadow-soft-md`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">Dernier résultat</p>
                    <div className="flex items-baseline gap-3">
                      <p className={`text-3xl font-bold ${getTierLabel(latestSession.tier).color}`}>
                        {Math.round(latestSession.dri)}%
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTierLabel(latestSession.tier).color} ${getTierLabel(latestSession.tier).bg}`}>
                        {getTierLabel(latestSession.tier).label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(latestSession.testDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${getTierLabel(latestSession.tier).bg}`}>
                    <Gauge className={`w-6 h-6 ${getTierLabel(latestSession.tier).color}`} />
                  </div>
                </div>
              </div>
            )}

            {/* Indicators */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-sahartoon-beige/50 rounded-lg border border-sahartoon-neutral/30">
                <p className="text-xs text-slate-600 font-medium mb-2">Dyslexie</p>
                <p className="text-xl font-bold text-sahartoon-dark">
                  {latestSession?.condition?.includes('dyslexia') ? '✕' : '✓'}
                </p>
              </div>
              <div className="p-4 bg-sahartoon-beige/50 rounded-lg border border-sahartoon-neutral/30">
                <p className="text-xs text-slate-600 font-medium mb-2">Dysorthographie</p>
                <p className="text-xl font-bold text-sahartoon-dark">
                  {latestSession?.condition?.includes('dysorthography') ? '✕' : '✓'}
                </p>
              </div>
              <div className="p-4 bg-sahartoon-beige/50 rounded-lg border border-sahartoon-neutral/30">
                <p className="text-xs text-slate-600 font-medium mb-2">Dyscalculie</p>
                <p className="text-xl font-bold text-sahartoon-dark">
                  {latestSession?.condition?.includes('dyscalculia') ? '✕' : '✓'}
                </p>
              </div>
            </div>

            {/* Trend Chart */}
            {chartData.length > 0 && (
              <div className="p-4 bg-sahartoon-beige/30 rounded-lg border border-sahartoon-neutral/20">
                <h4 className="text-sm font-semibold text-sahartoon-dark mb-4">Tendance DRI</h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                      <YAxis stroke="#9ca3af" fontSize={11} domain={[0, 100]} />
                      <Tooltip
                        cursor={{ fill: '#f8f7f4' }}
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="dri"
                        stroke="#8B1E3F"
                        strokeWidth={2.5}
                        dot={{ fill: '#8B1E3F', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Sessions History */}
            {studentSessions.length > 0 && (
              <div className="p-4 bg-sahartoon-beige/30 rounded-lg border border-sahartoon-neutral/20">
                <h4 className="text-sm font-semibold text-sahartoon-dark mb-3">Historique</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {studentSessions.slice(0, 5).map((session, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 hover:bg-white/50 rounded transition-colors duration-200">
                      <span className="text-slate-600">
                        {new Date(session.testDate).toLocaleDateString('fr-FR', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sahartoon-dark">{Math.round(session.dri)}%</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getTierLabel(session.tier).color} ${getTierLabel(session.tier).bg}`}>
                          {getTierLabel(session.tier).label.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 bg-sahartoon-beige/30 rounded-lg border border-sahartoon-neutral/20 text-center">
              <Brain className="w-12 h-12 text-sahartoon-burgundy/30 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-sahartoon-dark mb-2">Vue classe — Bientôt</h4>
              <p className="text-sm text-slate-500">
                Comparaison avec les autres élèves et distribution des tiers dans la classe.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
