import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { asyncSetAuthUser } from '../states/authUser/action';
import useTranslation from '../hooks/useTranslation';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.authUser);
  const t = useTranslation();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg(t('pleaseFillFields'));
      return;
    }

    try {
      await dispatch(asyncSetAuthUser({ email, password })).unwrap();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] transition-colors">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl border border-[var(--card-border)] shadow-2xl relative overflow-hidden transition-colors">
        <div className="text-center relative z-10">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-2xl md:text-3xl font-extrabold text-[var(--text-color)]">
            {t('welcomeBack')}
          </h2>
          <p className="mt-2 text-xs md:text-sm text-[var(--text-muted)]">
            {t('joinConversation')}
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-4 text-sm rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 dark:text-rose-400 relative z-10 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="mt-6 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-[var(--input-border)] rounded-xl bg-[var(--input-bg)] placeholder-[var(--text-muted)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-[var(--input-border)] rounded-xl bg-[var(--input-bg)] placeholder-[var(--text-muted)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-505 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer animate-fade-in"
            >
              {t('signIn')}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-[var(--text-muted)] relative z-10">
          {t('dontHaveAccount')}{' '}
          <Link to="/register" className="font-semibold text-indigo-500 dark:text-indigo-400 hover:underline transition-colors">
            {t('registerHere')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
