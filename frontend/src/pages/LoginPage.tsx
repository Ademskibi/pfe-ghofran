import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../i18n';
import logo from '../OIP.webp';
import { Brain, GraduationCap, Sparkles, Sun, Moon } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [role, setRole]       = useState<'teacher' | 'student'>('teacher');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark]   = useState(false);

  const { login }   = useAppContext();
  const { t }       = useTranslation();
  const navigate    = useNavigate();

  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (data.role !== role) throw new Error(`Ce compte est de type « ${data.role} »`);
      login(data.token);
      navigate(data.role === 'teacher' ? '/dashboard' : '/student-portal');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      {/* ─────────────────────────────────
          LEFT  ─ Form panel
      ───────────────────────────────── */}
      <div
        className="w-full lg:w-[480px] xl:w-[520px] flex flex-col justify-center p-10 relative flex-shrink-0"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRight: '1px solid var(--border-base)',
        }}
      >
        {/* Dark mode toggle top-right */}
        <button
          onClick={toggleDark}
          className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-muted)',
            border: '1px solid var(--border-base)',
            color: 'var(--text-secondary)',
          }}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          {isDark ? 'Light' : 'Dark'}
        </button>

        {/* Logo + Brand */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={logo}
              alt="SAHARTOON NeuroCal"
              className="w-14 h-14 object-contain rounded-xl"
              style={{ boxShadow: 'var(--shadow-md)' }}
            />
            <div>
              <h1
                className="text-2xl font-extrabold tracking-tight leading-none"
                style={{ color: 'var(--text-primary)' }}
              >
                SAHARTOON
              </h1>
              <p
                className="text-xs font-mono font-semibold tracking-widest"
                style={{ color: 'var(--brand-cyan)' }}
              >
                NeuroCal — Dépistage DYS
              </p>
            </div>
          </div>
          <p className="text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
            Connectez-vous à votre espace pédagogique pour accéder à la plateforme de dépistage des troubles DYS.
          </p>
        </div>

        {/* Role toggle */}
        <div
          className="flex p-1 gap-1 rounded-xl mb-8"
          style={{ backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-base)' }}
        >
          {(['teacher', 'student'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
              style={
                role === r
                  ? {
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--brand-cyan)',
                      boxShadow: 'var(--shadow-sm)',
                      border: '1px solid rgba(17,180,215,0.25)',
                    }
                  : { color: 'var(--text-secondary)', border: '1px solid transparent' }
              }
            >
              {r === 'teacher' ? <Brain className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
              {r === 'teacher' ? t('auth.teacher') : t('auth.student')}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Adresse e-mail
            </label>
            <input
              type="email"
              required
              className="input-primary"
              placeholder={t('auth.enterEmail')}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Mot de passe
            </label>
            <input
              type="password"
              required
              className="input-primary"
              placeholder={t('auth.placeholderPassword')}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {errorMsg && (
            <div
              className="p-3 rounded-xl text-sm"
              style={{
                backgroundColor: 'rgba(243,128,51,0.1)',
                border: '1px solid rgba(243,128,51,0.25)',
                color: 'var(--brand-orange)',
              }}
            >
              ⚠ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full h-11 text-sm mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours…' : 'Se connecter'}
          </button>
        </form>
      </div>

      {/* ─────────────────────────────────
          RIGHT  ─ Brand panel
      ───────────────────────────────── */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-center items-center p-16 relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-page)' }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(#11b4d7 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        {/* Color accent blobs */}
        <div
          className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: '#11b4d7' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: '#f38033' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: '#f4dd15' }}
        />

        {/* Card */}
        <div
          className="relative z-10 text-center max-w-md w-full animate-slideUp"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-base)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Big logo */}
          <div className="mb-6 flex justify-center">
            <div
              className="p-4 rounded-2xl animate-float"
              style={{
                backgroundColor: 'rgba(17,180,215,0.08)',
                border: '1px solid rgba(17,180,215,0.15)',
              }}
            >
              <img src={logo} alt="SAHARTOON" className="w-20 h-20 object-contain" />
            </div>
          </div>

          <h2
            className="text-3xl font-extrabold mb-3 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            NeuroCal Labs
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {t('auth.earlyScreening')}
          </p>

          {/* Color pill indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {['#11b4d7', '#f4dd15', '#f38033'].map(c => (
              <div
                key={c}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: c, boxShadow: `0 0 8px ${c}80` }}
              />
            ))}
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t('auth.supportDescription')}
          </p>

          {/* Three features */}
          <div
            className="mt-8 grid grid-cols-3 gap-3 pt-6"
            style={{ borderTop: '1px solid var(--border-base)' }}
          >
            {[
              { icon: <Brain className="w-5 h-5" />,      label: 'Dépistage',  color: '#11b4d7' },
              { icon: <Sparkles className="w-5 h-5" />,   label: 'Jeux DYS',   color: '#f4dd15' },
              { icon: <GraduationCap className="w-5 h-5" />, label: 'Suivi',   color: '#f38033' },
            ].map(f => (
              <div key={f.label} className="flex flex-col items-center gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${f.color}15`, color: f.color }}
                >
                  {f.icon}
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
