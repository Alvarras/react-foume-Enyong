import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { asyncUnsetAuthUser } from '../states/authUser/action';
import { toggleTheme as toggleThemeAction } from '../states/theme/reducer';
import { toggleLanguage as toggleLanguageAction } from '../states/language/reducer';
import useTranslation from '../hooks/useTranslation';
import { Home, Trophy, LogOut, LogIn, MessageSquare, Sun, Moon } from 'lucide-react';

function Navigation() {
  const authUser = useSelector((state) => state.authUser);
  const theme = useSelector((state) => state.theme);
  const language = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const t = useTranslation();

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  const toggleLanguage = () => {
    dispatch(toggleLanguageAction());
  };

  const handleLogout = () => {
    dispatch(asyncUnsetAuthUser());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-md transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-[var(--text-color)] hover:text-indigo-500 transition-colors">
          <MessageSquare className="w-6 h-6 text-indigo-500" />
          <span>Talk<span className="text-indigo-500">Space</span></span>
        </Link>

        <nav className="flex items-center gap-1.5 md:gap-4">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/')
                ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400'
                : 'text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-[var(--bg-accent)]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{t('threads')}</span>
          </Link>
          <Link
            to="/leaderboards"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/leaderboards')
                ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400'
                : 'text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-[var(--bg-accent)]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">{t('leaderboard')}</span>
          </Link>

          <div className="w-px h-6 bg-[var(--card-border)] mx-1 hidden sm:block"></div>

          {/* Language switcher */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-lg border border-[var(--card-border)] text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-[var(--bg-accent)] transition-all cursor-pointer uppercase"
            title={language === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
          >
            {language}
          </button>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-[var(--bg-accent)] transition-all cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {authUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2 py-1 bg-[var(--bg-accent)] rounded-full border border-[var(--card-border)]">
                <img
                  src={authUser.avatar}
                  alt={authUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-[var(--card-border)]"
                />
                <span className="text-xs font-semibold text-[var(--text-sub)] pr-1 max-w-[100px] truncate hidden md:block">
                  {authUser.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">{t('logout')}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/20"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('login')}</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
