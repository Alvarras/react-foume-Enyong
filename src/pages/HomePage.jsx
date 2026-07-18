import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Tag, Flame } from 'lucide-react';
import { asyncPopulateUsersAndThreads } from '../states/shared/action';
import ThreadItem from '../components/ThreadItem';
import { ThreadSkeleton } from '../components/Skeleton';
import useTranslation from '../hooks/useTranslation';

function HomePage() {
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.threads);
  const authUser = useSelector((state) => state.authUser);
  const t = useTranslation();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(asyncPopulateUsersAndThreads());
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  // Derive unique categories from threads list
  const categories = useMemo(() => {
    return Array.from(new Set(threads.map((t) => t.category).filter(Boolean)));
  }, [threads]);

  // Filter threads based on selected category tag
  const filteredThreads = useMemo(() => {
    if (!selectedCategory) return threads;
    return threads.filter((t) => t.category === selectedCategory);
  }, [threads, selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => (prev === category ? '' : category));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <section className="glass-card p-6 md:p-8 rounded-2xl border border-[var(--card-border)] relative overflow-hidden transition-all duration-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-color)] tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-indigo-500 animate-pulse" />
              {t('exploreConversations')}
            </h1>
            <p className="text-[var(--text-muted)] text-xs md:text-sm max-w-xl leading-relaxed">
              {t('welcomeSubtitle')}
            </p>
          </div>
          {authUser ? (
            <Link
              to="/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/10 hover:scale-[1.01] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createThread')}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-accent)] border border-[var(--card-border)] text-[var(--text-sub)] hover:text-[var(--text-color)] font-semibold text-xs transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>{t('loginToPost')}</span>
            </Link>
          )}
        </div>
      </section>

      {/* Category Tags filter */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-indigo-500" />
          {t('filterByCategory')}
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              !selectedCategory
                ? 'bg-indigo-600 border-transparent text-white shadow-sm shadow-indigo-600/10'
                : 'bg-[var(--bg-accent)] border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text-color)]'
            }`}
          >
            {t('allCategories')}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-indigo-600 border-transparent text-white shadow-sm shadow-indigo-600/10'
                  : 'bg-[var(--bg-accent)] border-[var(--card-border)] text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text-color)]'
              }`}
            >
              #{category}
            </button>
          ))}
        </div>
      </section>

      {/* Thread list feed */}
      <section className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[var(--text-color)]">{t('activeDiscussions')}</h2>
          <span className="text-xs text-[var(--text-muted)] font-semibold bg-[var(--bg-accent)] px-3 py-1 rounded-lg border border-[var(--card-border)]">
            {filteredThreads.length} {t('threadsCount')}
          </span>
        </div>

        {isLoading ? (
          <div className="grid gap-5">
            <ThreadSkeleton />
            <ThreadSkeleton />
            <ThreadSkeleton />
          </div>
        ) : filteredThreads.length > 0 ? (
          <div className="grid gap-5">
            {filteredThreads.map((thread) => (
              <ThreadItem key={thread.id} {...thread} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-2xl border border-dashed border-[var(--card-border)]">
            <p className="text-[var(--text-muted)] text-sm font-medium">{t('noThreads')}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
