import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useI18n } from '../i18n/I18nContext';

const ProgressTracking: React.FC = () => {
  const { students, testSessions } = useAppContext();
  const { t } = useI18n();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const targetStudent = students.find(s => s._id === selectedStudentId);
  const studentSessions = selectedStudentId 
    ? [...testSessions].filter(ts => ts.studentId === selectedStudentId).sort((a,b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime()) // ascending
    : [];

  const driHistory = studentSessions.map((ts, idx) => ({
    name: `${t('progress.test')} ${idx+1}`,
    date: new Date(ts.testDate).toLocaleDateString(),
    dri: Math.round(ts.dri)
  }));

  const firstSession = studentSessions.length > 0 ? studentSessions[0] : null;
  const latestSession = studentSessions.length > 1 ? studentSessions[studentSessions.length - 1] : null;

  let radarData = [];
  if (firstSession && selectedStudentId) {
    radarData = firstSession.domains.map(d => {
       const latestD = latestSession ? latestSession.domains.find(ld => ld.name === d.name) : undefined;
       return {
         domain: d.name,
         first: d.score,
         latest: latestD ? latestD.score : d.score, 
         fullMark: 100
       };
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{t('progress.title')}</h2>
        <div className="w-64">
           <select 
             className="input-primary w-full shadow-sm"
             value={selectedStudentId}
             onChange={e => setSelectedStudentId(e.target.value)}
           >
             <option value="" disabled>{t('progress.selectStudent')}</option>
             {students.map(st => (
               <option key={st._id} value={st._id}>{st.fullName}</option>
             ))}
           </select>
        </div>
      </div>

      {!selectedStudentId ? (
         <div className="card py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
               <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
               </svg>
            </div>
            <p className="text-lg font-medium text-slate-500">{t('progress.empty')}</p>
         </div>
      ) : (
         <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 tracking-tight">{t('progress.driTrend')}</h3>
              {studentSessions.length > 0 ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={driHistory} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="dri" stroke="#6366f1" strokeWidth={4} activeDot={{ r: 8 }} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-slate-400">{t('progress.noAssessments')}</div>
              )}
            </div>

            {studentSessions.length > 1 && (
               <div className="card">
                 <h3 className="text-lg font-semibold text-slate-800 mb-4 tracking-tight">{t('progress.domainComparison')}</h3>
                 <div className="h-80 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                       <PolarGrid stroke="#e2e8f0" />
                       <PolarAngleAxis dataKey="domain" tick={{fill: '#64748b', fontSize: 11}} />
                       <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#cbd5e1', fontSize: 10}} />
                        <Radar name={t('progress.firstAssessment')} dataKey="first" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                        <Radar name={t('progress.latestAssessment')} dataKey="latest" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                       <Tooltip />
                     </RadarChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div><span className="text-sm text-slate-600 font-medium">{t('progress.firstAssessment')}</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-600"></div><span className="text-sm text-slate-600 font-medium">{t('progress.latestAssessment')}</span></div>
                 </div>
               </div>
            )}
         </div>
      )}
    </div>
  );
};

export default ProgressTracking;
