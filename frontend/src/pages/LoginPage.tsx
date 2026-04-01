import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Brain } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.role !== role) {
         throw new Error(`Account is a ${data.role}, not a ${role}`);
      }

      login(data.token);
      
      if (data.role === 'teacher') {
        navigate('/dashboard');
      } else {
        navigate('/student-portal');
      }

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-800">
      {/* Left Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-lg mb-8 mx-auto sm:mx-0">
            <button
              onClick={() => setRole('teacher')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'teacher' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Teacher
            </button>
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'student' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Student
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                required 
                className="input-primary" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required 
                className="input-primary" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-100">
                {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full btn-primary h-11"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Gradient Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-800 to-indigo-600 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-400 opacity-20 mix-blend-overlay"></div>
        
        <div className="z-10 text-center max-w-lg">
          <Brain className="w-20 h-20 mx-auto mb-8 text-indigo-100 opacity-90" />
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">NeuroCal</h2>
          <p className="text-xl text-indigo-100 font-medium tracking-wide">
            Early screening. Better outcomes.
          </p>
          <p className="mt-8 text-indigo-200">
            Supporting educators and students in identifying and managing dyscalculia through intuitive, science-backed screening tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
