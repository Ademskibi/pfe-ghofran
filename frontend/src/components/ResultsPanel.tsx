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
      <div
        className="rounded-xl p-8 h-full flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-base)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="mb-4 p-4 rounded-full"
          style={{
            backgroundColor: 'rgba(17,180,215,0.08)',
            border: '1px solid rgba(17,180,215,0.15)',
          }}
        >
          <AlertCircle className="w-8 h-8 animate-pulse-soft" style={{ color: 'var(--brand-cyan)' }} />
        </div>
        <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Sélectionnez un élève
        </h3>
        <p className="text-xs max-w-sm" style={{ color: 'var(--text-muted)' }}>
          Cliquez sur un élève dans la liste pour afficher son diagnostic de sévérité DYS.
        </p>
      </div>
    );
  }

  const studentSessions = testSessions
    .filter((s) => s.studentId === selectedStudent._id)
    .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());

  const latestSession = studentSessions[0];

  const chartData = studentSessions.slice(0, 10).reverse().map((session) => ({
    date: new Date(session.testDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    dri: Math.round(session.dri || 0),
    tier: session.tier,
  }));

  const getTierInfo = (tier: number | undefined) => {
    const map: Record<number, { label: string; color: string; hex: string }> = {
      0: { label: 'G0 — Dans la norme',  color: 'var(--text-muted)',     hex: '#9ca3af' },
      1: { label: 'G1 — Risque léger',   color: 'var(--brand-cyan)',     hex: '#11b4d7' },
      2: { label: 'G2 — Risque modéré',  color: 'var(--brand-yellow)',   hex: '#c9a800' },
      3: { label: 'G3 — Risque sévère',  color: 'var(--brand-orange)',   hex: '#f38033' },
    };
    return map[tier || 0] || map[0];
  };

  return (
    <div
      className="rounded-xl overflow-hidden h-full flex flex-col"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-base)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Tabs */}
      <div
        className="px-4 pt-4 pb-0 flex gap-1"
        style={{ borderBottom: '1px solid var(--border-base)' }}
      >
        {(['results', 'analytics'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className="px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all duration-200 relative -mb-px"
            style={
              activeTab === tab
                ? {
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--brand-cyan)',
                    borderTop: '1px solid var(--border-base)',
                    borderLeft: '1px solid var(--border-base)',
                    borderRight: '1px solid var(--border-base)',
                    borderBottom: '1px solid var(--bg-card)',
                  }
                : {
                    color: 'var(--text-muted)',
                    border: '1px solid transparent',
                  }
            }
          >
            {tab === 'results' ? '📊 Résultats' : '📈 Vue classe'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5" style={{ backgroundColor: 'var(--bg-card)' }}>
        {activeTab === 'results' && latestSession && (
          <div className="space-y-5 animate-fadeIn">
            {/* Student header */}
            <div className="pb-4" style={{ borderBottom: '1px solid var(--border-base)' }}>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {selectedStudent.fullName}
              </h3>
              <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>
                Classe {selectedStudent.grade} · {selectedStudent.classGroup}
              </p>
            </div>

            {/* Latest severity card */}
            <div
              className="p-5 rounded-xl"
              style={{
                backgroundColor: `${getTierInfo(latestSession.tier).hex}10`,
                border: `1px solid ${getTierInfo(latestSession.tier).hex}30`,
                borderLeft: `4px solid ${getTierInfo(latestSession.tier).hex}`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-mono font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                    Dernier diagnostic
                  </p>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <p className="text-3xl font-mono font-bold" style={{ color: getTierInfo(latestSession.tier).hex }}>
                      {Math.round(latestSession.dri)}%
                    </p>
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-bold font-mono"
                      style={{
                        backgroundColor: `${getTierInfo(latestSession.tier).hex}15`,
                        color: getTierInfo(latestSession.tier).hex,
                        border: `1px solid ${getTierInfo(latestSession.tier).hex}30`,
                      }}
                    >
                      {getTierInfo(latestSession.tier).label}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono mt-3" style={{ color: 'var(--text-muted)' }}>
                    Le {new Date(latestSession.testDate).toLocaleDateString('fr-FR', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div
                  className="p-3 rounded-xl"
                  style={{
                    backgroundColor: `${getTierInfo(latestSession.tier).hex}15`,
                    color: getTierInfo(latestSession.tier).hex,
                  }}
                >
                  <Gauge className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Condition indicators */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'dyslexia',       label: 'Dyslexie' },
                { key: 'dysorthography', label: 'Dysortho.' },
                { key: 'dyscalculia',    label: 'Dyscalculie' },
              ].map(({ key, label }) => {
                const detected = latestSession?.condition?.includes(key);
                return (
                  <div
                    key={key}
                    className="p-4 rounded-xl text-center transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--bg-muted)',
                      border: `1px solid ${detected ? '#f3803330' : 'var(--border-base)'}`,
                    }}
                  >
                    <p className="text-[10px] uppercase font-mono tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      {label}
                    </p>
                    <p
                      className="text-sm font-bold font-mono"
                      style={{ color: detected ? '#f38033' : '#11b4d7' }}
                    >
                      {detected ? 'Détecté' : 'Normal'}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Trend chart */}
            {chartData.length > 0 && (
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-base)' }}
              >
                <h4 className="text-[10px] uppercase font-mono tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-cyan)' }} />
                  Évolution du DRI
                </h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" vertical={false} />
                      <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} domain={[0, 100]} />
                      <Tooltip
                        cursor={{ fill: 'rgba(17,180,215,0.04)' }}
                        contentStyle={{
                          borderRadius: '10px',
                          border: '1px solid var(--border-base)',
                          boxShadow: 'var(--shadow-md)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="dri"
                        stroke="#11b4d7"
                        strokeWidth={2.5}
                        dot={{ fill: '#11b4d7', r: 4 }}
                        activeDot={{ r: 6, fill: '#11b4d7', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Sessions history */}
            {studentSessions.length > 0 && (
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-base)' }}
              >
                <h4 className="text-[10px] uppercase font-mono tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-orange)' }} />
                  Historique des sessions
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {studentSessions.slice(0, 5).map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs p-3 rounded-lg transition-all duration-200"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-base)',
                      }}
                    >
                      <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                        {new Date(session.testDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
                          {Math.round(session.dri)}%
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono"
                          style={{
                            backgroundColor: `${getTierInfo(session.tier).hex}15`,
                            color: getTierInfo(session.tier).hex,
                            border: `1px solid ${getTierInfo(session.tier).hex}30`,
                          }}
                        >
                          {getTierInfo(session.tier).label.split(' ')[0]}
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
            <div
              className="p-8 rounded-xl text-center"
              style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-base)' }}
            >
              <Brain className="w-12 h-12 mx-auto mb-3 animate-pulse-soft" style={{ color: 'rgba(17,180,215,0.4)' }} />
              <h4 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Analytics de la classe
              </h4>
              <p className="text-xs max-w-sm mx-auto mt-2" style={{ color: 'var(--text-muted)' }}>
                Intelligence artificielle pour comparaison de classe et distribution de sévérité — en cours de chargement.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
