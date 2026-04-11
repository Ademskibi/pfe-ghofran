import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Plus, Users, Brain, Activity, Calendar } from 'lucide-react';
import { Student } from '../types';
import { useI18n } from '../i18n/I18nContext';

const Dashboard: React.FC = () => {
  const { students, testSessions, addStudent, addStudentWithAccount } = useAppContext();
  const { t } = useI18n();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Stats
  const activeStudents = students.filter(s => s.status === 'Active').length;
  
  // High risk unique students (tiers 2 and 3)
  const atRiskStudentIds = new Set(testSessions.filter(ts => ts.tier >= 2).map(ts => ts.studentId));
  const atRiskCount = atRiskStudentIds.size;

  const currentMonthSessions = testSessions.filter(ts => {
    const d = new Date(ts.testDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Chart Data: DRI Trend (last 10 sessions chronologically)
  // testSessions is sorted descending, so we take top 10 and reverse
  const last10 = [...testSessions].slice(0, 10).reverse().map(ts => {
    const st = students.find(s => s._id === ts.studentId);
    return {
      date: new Date(ts.testDate).toLocaleDateString(),
      dri: Math.round(ts.dri),
      name: st ? st.fullName.split(' ')[0] : t('common.unknown')
    };
  });

  // Chart Data: Tier Distribution
  const tierCounts = [0, 0, 0, 0];
  testSessions.forEach(ts => {
    if (ts.tier >= 0 && ts.tier <= 3) {
      tierCounts[ts.tier]++;
    }
  });

  const pieData = [
    { name: t('dashboard.tier0'), value: tierCounts[0] },
    { name: t('dashboard.tier1'), value: tierCounts[1] },
    { name: t('dashboard.tier2'), value: tierCounts[2] },
    { name: t('dashboard.tier3'), value: tierCounts[3] },
  ];
  const COLORS = ['#94a3b8', '#10b981', '#f59e0b', '#f43f5e']; // slate, emerald, amber, rose

  // Recent 10 table
  const recent10 = testSessions.slice(0, 10);

  // Add Student Form State
  const [formData, setFormData] = useState<Partial<Student>>({
    fullName: '', dateOfBirth: '', grade: 1, classGroup: '', gender: 'M', 
    status: 'Active', languageOfInstruction: '', clinicalNotes: '', parentalConsentGiven: false
  });
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');

  const mapCreateStudentError = (msg?: string) => {
    if (!msg) return t('dashboard.createFailed');
    const normalized = msg.toLowerCase();
    if (normalized.includes('user already exists')) return t('dashboard.userAlreadyExists');
    if (normalized.includes('email and password are required')) return t('dashboard.emailPasswordRequired');
    if (normalized.includes('server error creating student and account')) return t('dashboard.createFailed');
    if (normalized.includes('failed to create student with account')) return t('dashboard.createFailed');
    return msg;
  };

  const resetAddStudentForm = () => {
    setFormData({
      fullName: '', dateOfBirth: '', grade: 1, classGroup: '', gender: 'M',
      status: 'Active', languageOfInstruction: '', clinicalNotes: '', parentalConsentGiven: false
    });
    setAccountEmail('');
    setAccountPassword('');
    setFormError('');
    setIsSubmitting(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasEmail = accountEmail.trim().length > 0;
    const hasPassword = accountPassword.trim().length > 0;

    if (hasEmail !== hasPassword) {
      setFormError(t('dashboard.emailPasswordBoth'));
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');

      if (hasEmail && hasPassword) {
        await addStudentWithAccount({
          ...formData,
          email: accountEmail.trim().toLowerCase(),
          password: accountPassword
        });
      } else {
        await addStudent(formData);
      }

      setShowAddModal(false);
      resetAddStudentForm();
    } catch (err: any) {
      setFormError(mapCreateStudentError(err?.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{t('dashboard.title')}</h2>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" /> {t('dashboard.addStudent')}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex flex-col justify-center">
           <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
             <Users className="w-4 h-4" /> {t('dashboard.totalStudents')}
           </div>
           <div className="text-3xl font-bold text-slate-800">{students.length}</div>
        </div>
        <div className="card flex flex-col justify-center border-l-4 border-l-emerald-500">
           <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
             <Activity className="w-4 h-4 text-emerald-500" /> {t('dashboard.active')}
           </div>
           <div className="text-3xl font-bold text-emerald-700">{activeStudents}</div>
        </div>
        <div className="card flex flex-col justify-center border-l-4 border-l-rose-500">
           <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
             <Brain className="w-4 h-4 text-rose-500" /> {t('dashboard.atRisk')}
           </div>
           <div className="text-3xl font-bold text-rose-700">{atRiskCount}</div>
        </div>
        <div className="card flex flex-col justify-center border-l-4 border-l-indigo-500">
           <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
             <Calendar className="w-4 h-4 text-indigo-500" /> {t('dashboard.assessmentsMonth')}
           </div>
           <div className="text-3xl font-bold text-indigo-700">{currentMonthSessions}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">{t('dashboard.driTrend')}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last10} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="dri" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">{t('dashboard.tierDistribution')}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">{t('dashboard.recentSessions')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-medium border-b border-slate-200">
                <th className="py-3 px-4 rounded-tl-lg">{t('dashboard.studentName')}</th>
                <th className="py-3 px-4">{t('dashboard.tier')}</th>
                <th className="py-3 px-4">{t('dashboard.dri')}</th>
                <th className="py-3 px-4">{t('common.date')}</th>
                <th className="py-3 px-4 rounded-tr-lg">{t('dashboard.condition')}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recent10.map((session) => {
                const st = students.find(s => s._id === session.studentId);
                return (
                  <tr key={session._id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700">{st ? st.fullName : t('common.unknown')}</td>
                    <td className="py-3 px-4">
                      <span className={`badge-tier-${session.tier}`}>{t('dashboard.tier')} {session.tier}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{Math.round(session.dri)}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(session.testDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-slate-500 capitalize">{session.condition ? t(`condition.${session.condition}`) : '--'}</td>
                  </tr>
                );
              })}
              {recent10.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">{t('dashboard.noSessions')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm shadow-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
               <h3 className="text-lg font-bold text-slate-800">{t('dashboard.addModalTitle')}</h3>
               <button
                 onClick={() => {
                   setShowAddModal(false);
                   resetAddStudentForm();
                 }}
                 className="text-slate-400 hover:text-slate-600 transition"
               >
                 &times;
               </button>
             </div>
             
             <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.fullName')} *</label>
                    <input type="text" required className="input-primary" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.dob')} *</label>
                    <input type="date" required className="input-primary" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.grade')}</label>
                    <input type="number" min="1" max="8" className="input-primary" value={formData.grade} onChange={e => setFormData({...formData, grade: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.classGroup')}</label>
                    <input type="text" className="input-primary" value={formData.classGroup} onChange={e => setFormData({...formData, classGroup: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.gender')}</label>
                    <select className="input-primary" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                      <option value="M">{t('gender.M')}</option>
                      <option value="F">{t('gender.F')}</option>
                      <option value="Other">{t('gender.Other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.language')}</label>
                    <input type="text" className="input-primary" value={formData.languageOfInstruction} onChange={e => setFormData({...formData, languageOfInstruction: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.status')}</label>
                    <select className="input-primary" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                      <option value="Active">{t('status.Active')}</option>
                      <option value="Monitoring">{t('status.Monitoring')}</option>
                      <option value="Referred">{t('status.Referred')}</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 mt-2">
                    <input type="checkbox" id="consent" checked={formData.parentalConsentGiven} onChange={e => setFormData({...formData, parentalConsentGiven: e.target.checked})} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="consent" className="text-sm font-medium text-slate-700">{t('dashboard.consent')}</label>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-slate-100 mt-1">
                    <p className="text-sm font-semibold text-slate-700 mb-2">{t('dashboard.optionalAccount')}</p>
                    <p className="text-xs text-slate-500 mb-3">{t('dashboard.optionalHint')}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.studentEmail')}</label>
                    <input
                      type="email"
                      className="input-primary"
                      placeholder={t('dashboard.studentEmailPlaceholder')}
                      value={accountEmail}
                      onChange={e => setAccountEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('dashboard.studentPassword')}</label>
                    <input
                      type="password"
                      className="input-primary"
                      placeholder={t('dashboard.studentPasswordPlaceholder')}
                      value={accountPassword}
                      onChange={e => setAccountPassword(e.target.value)}
                    />
                  </div>
                </div>

                {formError && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-100">
                    {formError}
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetAddStudentForm();
                    }}
                    className="btn-secondary"
                    disabled={isSubmitting}
                  >
                    {t('common.cancel')}
                  </button>
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? t('dashboard.saving') : t('dashboard.saveStudent')}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
