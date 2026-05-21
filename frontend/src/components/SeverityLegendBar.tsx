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
    <div className="bg-white border-b border-sahartoon-neutral px-6 py-4 shadow-soft sticky top-[88px] z-30">
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {levels.map((level) => {
          const Icon = level.icon;
          const percentage = getPercentage(level.count);
          return (
            <div
              key={level.id}
              className="flex items-center gap-3 px-4 py-3 rounded-full bg-sahartoon-beige border border-sahartoon-neutral/30 hover:shadow-soft-md transition-all duration-200"
            >
              <div className={`flex-shrink-0 ${level.color} p-2 rounded-full text-white`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-sahartoon-dark">{level.label}</span>
                <span className={`text-sm font-bold ${level.textColor}`}>
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
