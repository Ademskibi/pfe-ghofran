import React from 'react';
import { Users, CheckCircle2, TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  borderColor: string;
  textColor: string;
  iconColor?: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  borderColor,
  textColor,
  iconColor,
  trend,
}) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-md transition-all duration-300 border-l-4 ${borderColor} group hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sahartoon-dark/70 text-sm font-medium mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
            {trend !== undefined && (
              <span className={`text-xs font-semibold ${trend >= 0 ? 'text-sahartoon-success' : 'text-sahartoon-danger'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${iconColor || 'bg-slate-100'} text-sahartoon-dark group-hover:scale-110 transition-transform duration-300`}>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-6">
      <StatCard
        icon={<Users className="w-5 h-5" />}
        label="Élèves inscrits"
        value={totalStudents}
        borderColor="border-l-slate-300"
        textColor="text-slate-700"
        iconColor="bg-slate-100"
      />

      <StatCard
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        label="Tests complétés"
        value={testsCompleted}
        borderColor="border-l-emerald-500"
        textColor="text-emerald-700"
        iconColor="bg-emerald-50"
      />

      <StatCard
        icon={<TrendingUp className="w-5 h-5 text-sahartoon-success" />}
        label="G1 Léger"
        value={g1Count}
        borderColor="border-l-sahartoon-success"
        textColor="text-sahartoon-success"
        iconColor="bg-green-50"
      />

      <StatCard
        icon={<AlertTriangle className="w-5 h-5 text-sahartoon-warning" />}
        label="G2 Modéré"
        value={g2Count}
        borderColor="border-l-sahartoon-warning"
        textColor="text-sahartoon-warning"
        iconColor="bg-amber-50"
      />

      <StatCard
        icon={<AlertCircle className="w-5 h-5 text-sahartoon-danger" />}
        label="G3 Sévère"
        value={g3Count}
        borderColor="border-l-sahartoon-danger"
        textColor="text-sahartoon-danger"
        iconColor="bg-red-50"
      />
    </div>
  );
};

export default DashboardStats;
