import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../i18n';
import { Search, Filter, ChevronRight, BarChart3 } from 'lucide-react';
import { TestSession } from '../types';

const ClassOverview: React.FC = () => {
  const { students, testSessions } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [situationFilter, setSituationFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const latestSessionByStudent = useMemo(() => {
    const map: Record<string, TestSession> = {};
    testSessions.forEach((session) => {
      if (!map[session.studentId] || new Date(session.testDate).getTime() > new Date(map[session.studentId].testDate).getTime()) {
        map[session.studentId] = session;
      }
    });
    return map;
  }, [testSessions]);

  const getSituation = (studentId: string) => {
    const latestSession = latestSessionByStudent[studentId];
    if (!latestSession) return 'unknown';
    if (latestSession.tier <= 1) return 'mild';
    if (latestSession.tier === 2) return 'moderate';
    return 'severe';
  };

  const totalStudents = students.length;
  const testsPassed = testSessions.filter((session) => session.tier <= 1).length;
  const mildCount = Object.values(latestSessionByStudent).filter((session) => session.tier <= 1).length;
  const moderateCount = Object.values(latestSessionByStudent).filter((session) => session.tier === 2).length;
  const severeCount = Object.values(latestSessionByStudent).filter((session) => session.tier === 3).length;

  const filteredStudents = students.filter(student => {
    const matchGrade = gradeFilter === 'all' || student.grade?.toString() === gradeFilter;
    const matchSituation = situationFilter === 'all' || getSituation(student._id) === situationFilter;
    const matchSearch = search === '' || student.fullName.toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchSituation && matchSearch;
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
    <div className="min-h-screen bg-sahartoon-beige dark:bg-slate-900 transition-colors duration-300">
      {/* Dark header section (no white bar) */}
      <div className="bg-sahartoon-burgundy text-white px-6 py-4 shadow-soft">
        <h1 className="text-2xl font-bold">{t('classOverview.classOverview')}</h1>
        <p className="text-white/80 text-sm mt-1">Visualiser et analyser la classe</p>
      </div>

      {/* Content Area */}
      <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">
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
              <option value="5">{t('classOverview.grade5')}</option>
              <option value="6">{t('classOverview.grade6')}</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <select className="input-primary" value={situationFilter} onChange={e => setSituationFilter(e.target.value)}>
              <option value="all">{t('classOverview.allSituations')}</option>
              <option value="mild">{t('classOverview.situationMild')}</option>
              <option value="moderate">{t('classOverview.situationModerate')}</option>
              <option value="severe">{t('classOverview.situationSevere')}</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-slate-500 space-y-1 mb-6">
          <p>{t('classOverview.situationMildDescription')}</p>
          <p>{t('classOverview.situationModerateDescription')}</p>
          <p>{t('classOverview.situationSevereDescription')}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-medium border-b border-slate-200">
                <th className="py-3 px-4 rounded-tl-lg">{t('classOverview.studentName')}</th>
                <th className="py-3 px-4">{t('classOverview.gradeClass')}</th>
                <th className="py-3 px-4">{t('classOverview.latestTier')}</th>
                <th className="py-3 px-4">{t('classOverview.latestDri')}</th>
                <th className="py-3 px-4">{t('classOverview.situation')}</th>
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
                      {(() => {
                        const situation = getSituation(st._id);
                        const badgeStyles = situation === 'mild'
                          ? 'bg-emerald-50 text-emerald-700'
                          : situation === 'moderate'
                          ? 'bg-amber-50 text-amber-700'
                          : situation === 'severe'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-slate-100 text-slate-600';
                        const label = situation === 'mild'
                          ? t('classOverview.situationMild')
                          : situation === 'moderate'
                          ? t('classOverview.situationModerate')
                          : situation === 'severe'
                          ? t('classOverview.situationSevere')
                          : t('classOverview.noData');
                        return (
                          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${badgeStyles}`}>
                            {label}
                          </span>
                        );
                      })()}
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
    </div>
  );
};

export default ClassOverview;
