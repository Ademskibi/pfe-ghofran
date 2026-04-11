import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ArrowLeft, Edit, AlertCircle, Activity, Brain } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, testSessions, interventionStrategies, updateStudent } = useAppContext();
  const { t } = useI18n();
  
  const student = students.find(s => s._id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'interventions'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  if (!student) {
    return <div className="p-8 text-center text-slate-500">{t('studentDetail.notFound')}</div>;
  }

  const [editForm, setEditForm] = useState(student);

  const studentSessions = [...testSessions]
    .filter(ts => ts.studentId === student._id)
    .sort((a,b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());

  const latestSession = studentSessions.length > 0 ? studentSessions[0] : null;

  const radarData = latestSession?.domains.map(d => ({
    domain: d.name,
    score: d.score,
    fullMark: 100
  })) || [];

  const driHistory = [...studentSessions].reverse().map((ts, idx) => ({
    name: `${t('progress.test')} ${idx+1}`,
    date: new Date(ts.testDate).toLocaleDateString(),
    dri: Math.round(ts.dri)
  }));

  // Find weak domains from latest session (< 50)
  const weakDomains = latestSession ? latestSession.domains.filter(d => d.score < 50).map(d => d.name) : [];
  
  // Interventions for weak domains
  const matchedInterventions = interventionStrategies.filter(inv => {
     // match if intervention domain substring matches any weak domain
     return weakDomains.some(wd => wd.toLowerCase().includes(inv.domain?.toLowerCase() || 'missing'));
  });
  // fallback if none matched
  const displayInterventions = matchedInterventions.length > 0 ? matchedInterventions : interventionStrategies.slice(0, 3);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(student._id, editForm);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{t('studentDetail.title')}</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('overview')}
        >{t('studentDetail.overview')}</button>
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'assessments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('assessments')}
        >{t('studentDetail.assessments')} ({studentSessions.length})</button>
        <button 
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'interventions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('interventions')}
        >{t('studentDetail.interventions')}</button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{student.fullName}</h3>
                <p className="text-sm text-slate-500 mt-1">{t('dashboard.grade')} {student.grade} • {t('dashboard.classGroup')} {student.classGroup}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="btn-primary flex items-center gap-2"
                  onClick={() => navigate(`/student-portal?studentId=${student._id}`)}
                >
                  <Brain className="w-4 h-4" /> {t('studentDetail.launchAssessment')}
                </button>
                <button className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-full transition" onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">{t('studentDetail.studentInfo.status')}</span> <span className="font-medium text-slate-800">{t(`status.${student.status}`)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t('studentDetail.studentInfo.dob')}</span> <span className="font-medium text-slate-800">{new Date(student.dateOfBirth).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t('studentDetail.studentInfo.gender')}</span> <span className="font-medium text-slate-800">{t(`gender.${student.gender}`)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t('studentDetail.studentInfo.language')}</span> <span className="font-medium text-slate-800">{student.languageOfInstruction || t('studentDetail.studentInfo.na')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{t('studentDetail.studentInfo.consent')}</span> <span className="font-medium text-slate-800">{student.parentalConsentGiven ? t('common.yes') : t('common.no')}</span></div>
            </div>

            {latestSession && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="font-medium text-slate-800 mb-2">{t('studentDetail.latestAssessment')}</h4>
                <div className={`p-4 rounded-lg flex justify-between items-center ${latestSession.tier >= 2 ? 'bg-rose-50 border border-rose-100' : 'bg-slate-50 border border-slate-100'}`}>
                   <div>
                     <p className="text-xs text-slate-500 font-bold uppercase mb-1">{t('studentDetail.tierLevel')}</p>
                     <p className={`font-bold text-lg ${latestSession.tier >= 2 ? 'text-rose-700' : 'text-slate-700'}`}>{t('dashboard.tier')} {latestSession.tier}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-slate-500 font-bold uppercase mb-1">{t('studentDetail.driScore')}</p>
                     <p className={`font-bold text-lg ${latestSession.tier >= 2 ? 'text-rose-700' : 'text-emerald-700'}`}>{Math.round(latestSession.dri)}</p>
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {latestSession && (
              <div className="card">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">{t('studentDetail.latestSessionSummary')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">{t('dashboard.dri')}</p>
                    <p className="text-2xl font-black text-slate-800">{Math.round(latestSession.dri || 0)}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">{t('dashboard.tier')}</p>
                    <p className="text-2xl font-black text-slate-800">{latestSession.tier ?? 0}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">{t('common.date')}</p>
                    <p className="text-base font-bold text-slate-700">{new Date(latestSession.testDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {latestSession.domains?.length ? (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {latestSession.domains.map((d) => (
                      <div key={d.name} className="flex justify-between p-2 rounded border border-slate-100 bg-white">
                        <span className="text-slate-600">{d.name}</span>
                        <span className="font-bold text-slate-800">{Math.round(d.score)}%</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500" /> {t('studentDetail.driProgress')}</h3>
              {studentSessions.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={driHistory}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                       <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                       <Tooltip cursor={{ fill: '#f8fafc' }} />
                       <Line type="monotone" dataKey="dri" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-slate-400">{t('studentDetail.noAssessmentsYet')}</div>
              )}
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Radar className="w-5 h-5 text-indigo-500" /> {t('studentDetail.latestDomainProfile')}</h3>
              {latestSession ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="domain" tick={{fill: '#64748b', fontSize: 11}} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#94a3b8', fontSize: 10}} />
                      <Radar name={t('dashboard.dri')} dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-slate-400">{t('studentDetail.noProfileData')}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="card">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50 text-slate-500 text-sm font-medium border-b border-slate-200">
                   <th className="py-3 px-4 rounded-tl-lg">{t('common.date')}</th>
                   <th className="py-3 px-4">{t('dashboard.dri')}</th>
                   <th className="py-3 px-4">{t('dashboard.tier')}</th>
                   <th className="py-3 px-4">{t('dashboard.condition')}</th>
                   <th className="py-3 px-4 rounded-tr-lg">{t('studentDetail.domainsTested')}</th>
                 </tr>
               </thead>
               <tbody className="text-sm">
                 {studentSessions.map((session) => (
                   <React.Fragment key={session._id}>
                     <tr className="border-b border-slate-100 hover:bg-slate-50">
                       <td className="py-4 px-4 font-medium text-slate-700">{new Date(session.testDate).toLocaleDateString()}</td>
                       <td className="py-4 px-4 font-bold text-slate-800">{Math.round(session.dri)}</td>
                       <td className="py-4 px-4"><span className={`badge-tier-${session.tier}`}>{t('dashboard.tier')} {session.tier}</span></td>
                       <td className="py-4 px-4 capitalize text-slate-600">{session.condition ? t(`condition.${session.condition}`) : '--'}</td>
                       <td className="py-4 px-4 text-slate-500">{session.domains?.length || 0}</td>
                     </tr>
                     {/* Can add collapsible row here for details if needed */}
                   </React.Fragment>
                 ))}
                 {studentSessions.length === 0 && (
                   <tr><td colSpan={5} className="py-8 text-center text-slate-500">{t('studentDetail.noAssessmentsRecord')}</td></tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'interventions' && (
        <div className="space-y-4">
          {weakDomains.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-amber-800">
               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
               <div>
                  <p className="font-bold mb-1">{t('studentDetail.identifiedNeeds')}</p>
                  <p className="text-sm">{weakDomains.join(', ')}</p>
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {displayInterventions.map(intv => (
              <div key={intv._id} className="card hover:shadow-md transition-shadow flex flex-col h-full">
                 <div className="mb-3">
                   <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded">{intv.domain}</span>
                 </div>
                 <h4 className="font-bold text-slate-800 text-lg mb-2">{intv.title}</h4>
                 <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-4">{intv.description}</p>
                 <div className="border-t border-slate-100 pt-3 flex justify-between text-xs text-slate-500">
                    <span>{intv.duration} {t('studentDetail.minutesPerSession')}</span>
                    <span className="capitalize">{intv.difficulty}</span>
                 </div>
              </div>
            ))}
            {displayInterventions.length === 0 && (
              <div className="col-span-full p-8 text-center text-slate-400 card">{t('studentDetail.noInterventions')}</div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">{t('studentDetail.editStudent')}</h3>
               <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
             </div>
             <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.status')}</label>
                  <select className="input-primary" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value as any})}>
                  <option value="Active">{t('status.Active')}</option>
                  <option value="Monitoring">{t('status.Monitoring')}</option>
                  <option value="Referred">{t('status.Referred')}</option>
                  <option value="Archived">{t('status.Archived')}</option>
                  </select>
               </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.classGroup')}</label>
                  <input type="text" className="input-primary" value={editForm.classGroup || ''} onChange={e => setEditForm({...editForm, classGroup: e.target.value})} />
               </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('studentDetail.clinicalNotes')}</label>
                  <textarea className="input-primary h-24" value={editForm.clinicalNotes || ''} onChange={e => setEditForm({...editForm, clinicalNotes: e.target.value})}></textarea>
               </div>
               <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">{t('common.cancel')}</button>
                <button type="submit" className="btn-primary">{t('studentDetail.saveChanges')}</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetail;
