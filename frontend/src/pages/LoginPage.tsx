import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../i18n';
import logo from '../OIP.webp';
import { Brain } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAppContext();
<<<<<<< HEAD
  const { t } = useTranslation();
=======
  const { t } = useI18n();
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
  const navigate = useNavigate();

  const mapLoginError = (msg?: string) => {
    if (!msg) return t('login.failed');
    const normalized = msg.toLowerCase();
    if (normalized.includes('invalid credentials')) return t('login.invalidCredentials');
    if (normalized.includes('server error')) return t('login.serverError');
    return msg;
  };

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
        throw new Error(mapLoginError(data.error));
      }

      if (data.role !== role) {
        throw new Error(t('login.roleMismatch', { actual: data.role, expected: role }));
      }

      login(data.token);
      
      if (data.role === 'teacher') {
        navigate('/dashboard');
      } else {
        navigate('/student-portal');
      }

    } catch (err: any) {
      setErrorMsg(mapLoginError(err?.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-[var(--color-black)] bg-app-background">
      {/* Left Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center sm:text-left">
<<<<<<< HEAD
            <img src={logo} alt="NeuroCal logo" className="mx-auto h-16 w-auto mb-4 sm:mx-0" />
            <h1 className="text-3xl font-bold text-[var(--color-fox-dark)] mb-2">{t('auth.welcomeBack')}</h1>
            <p className="text-[var(--color-fox-dark)]">{t('auth.pleaseSignIn')}</p>
=======
            <div className="flex justify-center sm:justify-end mb-4">
              <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('login.welcome')}</h1>
            <p className="text-slate-500">{t('login.subtitle')}</p>
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
          </div>

          <div className="flex p-1 bg-[var(--color-bg-shape)] rounded-lg mb-8 mx-auto sm:mx-0">
            <button
              onClick={() => setRole('teacher')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'teacher' ? 'bg-white shadow text-[var(--color-fox-dark)]' : 'text-[var(--color-fox-dark)] hover:text-[var(--color-ui-dark)]'}`}
            >
<<<<<<< HEAD
              {t('auth.teacher')}
=======
              {t('roles.teacher')}
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
            </button>
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${role === 'student' ? 'bg-white shadow text-[var(--color-fox-dark)]' : 'text-[var(--color-fox-dark)] hover:text-[var(--color-ui-dark)]'}`}
            >
<<<<<<< HEAD
              {t('auth.student')}
=======
              {t('roles.student')}
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
<<<<<<< HEAD
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.email')}</label>
=======
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('login.email')}</label>
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
              <input 
                type="email" 
                required 
                className="input-primary" 
<<<<<<< HEAD
                placeholder={t('auth.enterEmail')}
=======
                placeholder={t('login.emailPlaceholder')}
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
<<<<<<< HEAD
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.password')}</label>
=======
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('login.password')}</label>
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
              <input 
                type="password" 
                required 
                className="input-primary" 
<<<<<<< HEAD
                placeholder={t('auth.placeholderPassword')}
=======
                placeholder={t('login.passwordPlaceholder')}
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-[rgba(244,124,32,0.12)] text-[var(--color-fox-dark)] text-sm rounded-lg border border-[var(--color-fox)]">
                {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full btn-primary h-11"
              disabled={isLoading}
            >
<<<<<<< HEAD
              {isLoading ? t('auth.signingIn') : t('auth.signIn')}
=======
              {isLoading ? t('login.signingIn') : t('login.signIn')}
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
            </button>
          </form>
        </div>
      </div>

      {/* Right Gradient Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[var(--color-ui-dark)] via-[var(--color-ui)] to-[var(--color-fox)] text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-[var(--color-glasses)] opacity-20 mix-blend-overlay"></div>
        
        <div className="z-10 text-center max-w-lg">
<<<<<<< HEAD
         <img src={logo} alt="NeuroCal logo" className="mx-auto h-16 w-auto mb-4 sm:mx-0" />
          {/* <h2 className="text-4xl font-extrabold mb-4 tracking-tight">NeuroCal</h2> */}
          <p className="text-xl text-[var(--color-muzzle)] font-medium tracking-wide">
            {t('auth.earlyScreening')}
          </p>
          <p className="mt-8 text-[var(--color-muzzle)]">
            {t('auth.supportDescription')}
=======
          <Brain className="w-20 h-20 mx-auto mb-8 text-indigo-100 opacity-90" />
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">NeuroCal</h2>
          <p className="text-xl text-indigo-100 font-medium tracking-wide">
            {t('login.heroTitle')}
          </p>
          <p className="mt-8 text-indigo-200">
            {t('login.heroText')}
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
