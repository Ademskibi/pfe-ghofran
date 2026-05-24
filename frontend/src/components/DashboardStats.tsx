import React from 'react';
import { Users, CheckCircle2, TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  accentColor: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, accentColor, trend }) => {
  return (
    <div
      className="rounded-xl p-5 transition-all duration-300 group hover:-translate-y-1"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-base)',
        borderLeft: `4px solid ${accentColor}`,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-[10px] tracking-wider uppercase font-semibold mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-mono font-bold" style={{ color: accentColor }}>
              {value}
            </p>
            {trend !== undefined && (
              <span className="text-xs font-semibold" style={{ color: trend >= 0 ? '#11b4d7' : '#f38033' }}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
        </div>
        <div
          className="p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  totalStudents: number;
  testsCompleted: number;
  g1Count: number;
  g2Count: number;
  g3Count: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalStudents,
  testsCompleted,
  g1Count,
  g2Count,
  g3Count,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-6">
      <StatCard
        icon={<Users className="w-5 h-5" />}
        label="Élèves inscrits"
        value={totalStudents}
        accentColor="#6b7280"
      />
      <StatCard
        icon={<CheckCircle2 className="w-5 h-5" />}
        label="Tests complétés"
        value={testsCompleted}
        accentColor="#11b4d7"
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5" />}
        label="G1 Léger"
        value={g1Count}
        accentColor="#11b4d7"
      />
      <StatCard
        icon={<AlertTriangle className="w-5 h-5" />}
        label="G2 Modéré"
        value={g2Count}
        accentColor="#f4dd15"
      />
      <StatCard
        icon={<AlertCircle className="w-5 h-5" />}
        label="G3 Sévère"
        value={g3Count}
        accentColor="#f38033"
      />
    </div>
  );
};

export default DashboardStats;
