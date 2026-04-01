import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CheckCircle, Brain } from 'lucide-react';

const DOMAINS = [
  "Number sense",
  "Counting accuracy",
  "Arithmetic fluency",
  "Place value understanding",
  "Word problem solving",
  "Number line estimation",
  "Pattern recognition",
  "Mental calculation",
  "Symbol recognition",
  "Time and measurement"
];

const StudentPortal: React.FC = () => {
  const { currentUser, testSessions, createTestSession } = useAppContext();
  
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<number[]>(new Array(10).fill(50));
  const [testPhase, setTestPhase] = useState<'intro' | 'testing' | 'success'>('intro');

  const mySessions = [...testSessions].sort((a,b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
  const latestSession = mySessions.length > 0 ? mySessions[0] : null;

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScores = [...scores];
    newScores[currentQ] = parseInt(e.target.value, 10);
    setScores(newScores);
  };

  const nextQ = () => {
    if (currentQ < 9) {
      setCurrentQ(prev => prev + 1);
    }
  };

  const prevQ = () => {
    if (currentQ > 0) {
      setCurrentQ(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!currentUser?.studentId) return;

    const domains = DOMAINS.map((name, i) => ({
      name,
      score: scores[i]
    }));

    createTestSession({
      studentId: currentUser.studentId,
      domains,
      condition: 'calm',
      testDate: new Date().toISOString()
    });

    setTestPhase('success');

    setTimeout(() => {
      setTestPhase('intro');
      setScores(new Array(10).fill(50));
      setCurrentQ(0);
    }, 3000);
  };

  const radarData = latestSession?.domains.map(d => ({
    domain: d.name,
    score: d.score,
    fullMark: 100
  })) || [];

  const driHistory = [...mySessions].reverse().map((ts, idx) => ({
    name: `Test ${idx+1}`,
    dri: Math.round(ts.dri)
  }));


  return (
    <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center mb-10">
      
      <div className="w-full card bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
         <h2 className="text-2xl font-bold">Student Portal</h2>
         <p className="text-indigo-100 mt-1">Ready for your assessment? Do your best!</p>
      </div>

      {testPhase === 'intro' && (
        <div className="w-full card shadow border-t-4 border-t-indigo-500 flex flex-col items-center text-center p-12">
           <Brain className="w-16 h-16 text-indigo-500 mb-6" />
           <h3 className="text-2xl font-bold text-slate-800 mb-2">New Assessment</h3>
           <p className="text-slate-500 mb-8 max-w-md">You will answer 10 questions to assess different math skills. Use the slider to rate your confidence or score in each area.</p>
           <button onClick={() => setTestPhase('testing')} className="btn-primary text-lg px-8 py-3 rounded-full shadow-md hover:shadow-lg transition">
             Start Test
           </button>
        </div>
      )}

      {testPhase === 'testing' && (
        <div className="w-full card shadow border border-indigo-100">
           <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
             <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((currentQ + 1) / 10) * 100}%` }}></div>
           </div>

           <div className="text-center mb-8">
             <span className="text-sm font-bold tracking-wide text-indigo-600 uppercase">Question {currentQ + 1} of 10</span>
             <h3 className="text-2xl font-bold text-slate-800 mt-2">{DOMAINS[currentQ]}</h3>
           </div>

           <div className="py-12 px-8 flex flex-col items-center">
              <span className="text-4xl font-extrabold text-indigo-600 mb-6">{scores[currentQ]}</span>
              <input 
                type="range" 
                min="0" max="100" 
                value={scores[currentQ]} 
                onChange={handleSlider}
                className="w-full max-w-lg h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="w-full max-w-lg flex justify-between mt-3 text-sm font-medium text-slate-400">
                <span>0 (Low)</span>
                <span>100 (High)</span>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row justify-between pt-6 border-t border-slate-100">
             <button onClick={prevQ} disabled={currentQ === 0} className="btn-secondary disabled:opacity-50 mt-2 sm:mt-0 order-2 sm:order-1">Previous</button>
             {currentQ < 9 ? (
               <button onClick={nextQ} className="btn-primary order-1 sm:order-2">Next Question</button>
             ) : (
               <button onClick={handleSubmit} className="btn-primary bg-emerald-600 hover:bg-emerald-700 shadow-md font-bold order-1 sm:order-2">Submit Test</button>
             )}
           </div>
        </div>
      )}

      {testPhase === 'success' && (
        <div className="w-full card shadow p-16 flex flex-col items-center text-center animate-pulse">
          <CheckCircle className="w-20 h-20 text-emerald-500 mb-6" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Results Submitted!</h3>
          <p className="text-slate-500">Your results have been sent to your teacher. Redirecting...</p>
        </div>
      )}

      {testPhase === 'intro' && mySessions.length > 0 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Latest Domain Profile</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="domain" tick={{fill: '#64748b', fontSize: 10}} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Radar name="Score" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">DRI History</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={driHistory}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                   <Tooltip cursor={{ fill: '#f8fafc' }} />
                   <Line type="monotone" dataKey="dri" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
