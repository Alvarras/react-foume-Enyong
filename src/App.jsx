import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { MessageSquare } from 'lucide-react';
import { asyncPreloadProcess } from './states/isPreload/action';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import NewThreadPage from './pages/NewThreadPage';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  const isPreload = useSelector((state) => state.isPreload);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (isPreload) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border-4 border-indigo-500/20 animate-ping" />
          <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 animate-pulse">
            <MessageSquare className="w-8 h-8" />
          </div>
        </div>
        <div className="space-y-1 text-center">
          <h2 className="text-white font-bold text-lg tracking-wide">TalkSpace</h2>
          <p className="text-slate-500 text-xs font-medium animate-pulse">Initializing forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] flex flex-col transition-colors duration-250">
      {/* Redux top progress loading bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-1 pointer-events-none">
        <LoadingBar className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 h-1 shadow-md shadow-indigo-500/50" />
      </div>

      <Navigation />

      <main className="flex-1 flex flex-col w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/threads/:id" element={<ThreadDetailPage />} />
          <Route path="/new" element={<NewThreadPage />} />
          <Route path="/leaderboards" element={<LeaderboardPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <footer className="w-full py-6 border-t border-[var(--card-border)] bg-[var(--card-bg)] text-center text-xs text-[var(--text-muted)] font-medium transition-colors">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center">
          <p>@rivqi.varras all right reserved Talk Forum 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
