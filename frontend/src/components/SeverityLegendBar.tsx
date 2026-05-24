import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface SeverityLegendProps {
  g0Count?: number;
  g1Count?: number;
  g2Count?: number;
  g3Count?: number;
  total?: number;
}

const SeverityLegendBar: React.FC<SeverityLegendProps> = ({
  g0Count = 0,
  g1Count = 0,
  g2Count = 0,
  g3Count = 0,
  total = 1,
}) => {
  const getPercentage = (count: number) => Math.round((count / total) * 100) || 0;

  const levels = [
    {
      id: 'g0',
      label: 'G0 — Dans la norme',
      color: 'bg-slate-300',
      textColor: 'text-slate-700',
      icon: CheckCircle2,
      count: g0Count,
      range: '<20%',
    },
    {
      id: 'g1',
      label: 'G1 — Léger',
      color: 'bg-sahartoon-success',
      textColor: 'text-sahartoon-success',
      icon: Info,
      count: g1Count,
      range: '20–40%',
    },
    {
      id: 'g2',
      label: 'G2 — Modéré',
      color: 'bg-sahartoon-warning',
      textColor: 'text-sahartoon-warning',
      icon: AlertTriangle,
      count: g2Count,
      range: '40–65%',
    },
    {
      id: 'g3',
      label: 'G3 — Sévère',
      color: 'bg-sahartoon-danger',
      textColor: 'text-sahartoon-danger',
      icon: AlertCircle,
      count: g3Count,
      range: '>65%',
    },
  ];

  return (
    <div
      className="border-b px-6 py-4 sticky top-[68px] z-30"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-base)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-center justify-center gap-6 flex-wrap">
        {levels.map((level) => {
          const Icon = level.icon;
          const percentage = getPercentage(level.count);
          return (
            <div
              key={level.id}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--bg-muted)',
                border: '1px solid var(--border-base)',
              }}
            >
              <div className={`flex-shrink-0 ${level.color} p-2 rounded-lg text-white shadow-sm`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>{level.label}</span>
                <span className={`text-xs font-mono font-bold ${level.textColor}`}>
                  {level.count} ({percentage}%) — {level.range}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeverityLegendBar;
