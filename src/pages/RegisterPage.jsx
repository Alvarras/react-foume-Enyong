import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { asyncRegisterUser } from '../states/users/action';
import useTranslation from '../hooks/useTranslation';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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
    setSuccessMsg('');

    if (!name || !email || !password) {
      setErrorMsg(t('pleaseFillFields'));
      return;
    }
    if (password.length < 6) {
      setErrorMsg(language === 'id' ? 'Kata sandi harus minimal 6 karakter.' : 'Password must be at least 6 characters long.');
      return;
    }

    try {
      await dispatch(asyncRegisterUser({ name, email, password })).unwrap();
      setSuccessMsg(t('registeredSuccess'));
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  // Access current language to support dynamic conditional messages
  const language = useSelector((state) => state.language);

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] transition-colors">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl border border-[var(--card-border)] shadow-2xl relative overflow-hidden transition-colors">
        <div className="text-center relative z-10">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-505 dark:text-indigo-400">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-2xl md:text-3xl font-extrabold text-[var(--text-color)]">
            {t('createAccount')}
          </h2>
          <p className="mt-2 text-xs md:text-sm text-[var(--text-muted)]">
            {t('joinCommunity')}
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-4 text-sm rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-550 dark:text-rose-450 relative z-10 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-4 text-sm rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-550 dark:text-emerald-450 relative z-10 animate-pulse">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form className="mt-6 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullname" className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {t('fullName')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="fullname"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-[var(--input-border)] rounded-xl bg-[var(--input-bg)] placeholder-[var(--text-muted)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-[var(--input-border)] rounded-xl bg-[var(--input-bg)] placeholder-[var(--text-muted)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
                  placeholder="•••••••• (min 6 chars)"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-550 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {t('createAccount')}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-[var(--text-muted)] relative z-10">
          {t('alreadyHaveAccount')}{' '}
          <Link to="/login" className="font-semibold text-indigo-500 dark:text-indigo-400 hover:underline transition-colors">
            {t('loginHere')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
