import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { asyncAddThread } from '../states/threads/action';
import useTranslation from '../hooks/useTranslation';

function NewThreadPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const authUser = useSelector((state) => state.authUser);
  const language = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authUser) {
      navigate('/login');
    }
  }, [authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !body.trim()) {
      setErrorMsg(language === 'id' ? 'Judul dan Konten wajib diisi.' : 'Title and Body are required.');
      return;
    }

    try {
      await dispatch(asyncAddThread({ title, body, category })).unwrap();
      navigate('/');
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Back to feed */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('backToThreads')}</span>
      </Link>

      {/* Form Card */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-[var(--card-border)] shadow-xl relative overflow-hidden transition-colors">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-extrabold text-[var(--text-color)]">{t('createNewThread')}</h1>
          <p className="text-[var(--text-muted)] text-xs md:text-sm mt-1">{t('createThreadSubtitle')}</p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-4 text-sm rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-550 dark:text-rose-450 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              {t('title')}
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-[var(--input-border)] rounded-xl bg-[var(--input-bg)] placeholder-[var(--text-muted)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-505 transition-all text-sm"
              placeholder={language === 'id' ? 'Apa yang ingin Anda diskusikan?' : 'What would you like to discuss?'}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              {t('category')} {language === 'id' ? '(Opsional)' : '(Optional)'}
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-[var(--input-border)] rounded-xl bg-[var(--input-bg)] placeholder-[var(--text-muted)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-505 transition-all text-sm"
              placeholder={t('categoryPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              {language === 'id' ? 'Isi Konten' : 'Content Body'}
            </label>
            <textarea
              id="body"
              required
              rows="8"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-[var(--input-border)] rounded-xl bg-[var(--input-bg)] placeholder-[var(--text-muted)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-505 transition-all text-sm resize-none"
              placeholder={language === 'id' ? 'Tulis isi diskusi Anda di sini...' : 'Write your discussion content here...'}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-550 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('publishThread')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewThreadPage;
