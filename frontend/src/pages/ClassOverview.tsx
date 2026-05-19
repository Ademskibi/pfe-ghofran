import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { Search, Filter, ChevronRight, BarChart3 } from 'lucide-react';

const ClassOverview: React.FC = () => {
  const { students, testSessions } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredStudents = students.filter(student => {
    const matchGrade = gradeFilter === 'all' || student.grade?.toString() === gradeFilter;
    const matchStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchSearch = search === '' || student.fullName.toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchStatus && matchSearch;
  });

  // Calculate average DRI overall
  let totalDri = 0;
  let countDri = 0;
  
  testSessions.forEach(ts => {
    totalDri += ts.dri;
    countDri++;
  });
  const avgDri = countDri > 0 ? Math.round(totalDri / countDri) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{t('classOverview.classOverview')}</h2>
        <div className="flex gap-4">
          <div className="card py-2 px-4 flex items-center gap-3">
             <BarChart3 className="w-5 h-5 text-indigo-500" />
             <div>
               <p className="text-xs text-slate-500 font-medium">{t('classOverview.avgClassDri')}</p>
               <p className="text-lg font-bold text-slate-800 leading-none">{avgDri}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('classOverview.searchStudents')} 
              className="input-primary pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48 flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select className="input-primary" value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
              <option value="all">{t('classOverview.allGrades')}</option>
              <option value="1">{t('classOverview.grade1')}</option>
              <option value="2">{t('classOverview.grade2')}</option>
              <option value="3">{t('classOverview.grade3')}</option>
              <option value="4">{t('classOverview.grade4')}</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <select className="input-primary" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">{t('classOverview.allStatuses')}</option>
              <option value="Active">{t('classOverview.active')}</option>
              <option value="Monitoring">{t('classOverview.monitoring')}</option>
              <option value="Referred">{t('classOverview.referred')}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-medium border-b border-slate-200">
                <th className="py-3 px-4 rounded-tl-lg">{t('classOverview.studentName')}</th>
                <th className="py-3 px-4">{t('classOverview.gradeClass')}</th>
                <th className="py-3 px-4">{t('classOverview.latestTier')}</th>
                <th className="py-3 px-4">{t('classOverview.latestDri')}</th>
                <th className="py-3 px-4">{t('classOverview.status')}</th>
                <th className="py-3 px-4 text-right rounded-tr-lg">{t('classOverview.action')}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredStudents.map((st) => {
                const latestTs = [...testSessions].sort((a,b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime()).find(ts => ts.studentId === st._id);
                
                return (
                  <tr key={st._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/student/${st._id}`)}>
                    <td className="py-4 px-4 font-medium text-slate-800">{st.fullName}</td>
                    <td className="py-4 px-4 text-slate-600">G{st.grade || '-'} / {st.classGroup || '-'}</td>
                    <td className="py-4 px-4">
                      {latestTs ? <span className={`badge-tier-${latestTs.tier}`}>{t(`dashboard.tier${latestTs.tier}`)}</span> : <span className="text-slate-400 italic">{t('classOverview.noData')}</span>}
                    </td>
                    <td className="py-4 px-4">
                      {latestTs ? <span className="font-semibold text-slate-700">{Math.round(latestTs.dri)}</span> : <span className="text-slate-400 italic">{t('classOverview.noData')}</span>}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${st.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : st.status === 'Monitoring' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors flex items-center gap-1 ml-auto">
                        {t('classOverview.view')} <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">{t('classOverview.noStudentsFound')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassOverview;
