import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, CornerDownRight, Tag, ArrowLeft } from 'lucide-react';
import { asyncReceiveThreadDetail, asyncAddComment, asyncToggleUpvoteThreadDetail, asyncToggleDownvoteThreadDetail, clearThreadDetailActionCreator } from '../states/threadDetail/action';
import { postedAt } from '../utils/dateHelper';
import CommentItem from '../components/CommentItem';
import { ThreadDetailSkeleton } from '../components/Skeleton';
import DOMPurify from '../utils/dompurify';
import useTranslation from '../hooks/useTranslation';

function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const threadDetail = useSelector((state) => state.threadDetail);
  const authUser = useSelector((state) => state.authUser);

  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslation();

  useEffect(() => {
    const fetchDetail = async () => {
      await dispatch(asyncReceiveThreadDetail(id));
      setIsLoading(false);
    };
    fetchDetail();

    return () => {
      dispatch(clearThreadDetailActionCreator());
    };
  }, [id, dispatch]);

  const handleUpvote = () => {
    dispatch(asyncToggleUpvoteThreadDetail());
  };

  const handleDownvote = () => {
    dispatch(asyncToggleDownvoteThreadDetail());
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await dispatch(asyncAddComment({ threadId: id, content: commentText })).unwrap();
      setCommentText('');
    } catch (error) {
      console.error(error.message);
    }
  };

  if (isLoading || !threadDetail) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToThreads')}</span>
        </Link>
        <ThreadDetailSkeleton />
      </div>
    );
  }

  const isUpvoted = authUser && threadDetail.upVotesBy.includes(authUser.id);
  const isDownvoted = authUser && threadDetail.downVotesBy.includes(authUser.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Back to Feed */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors mb-2 cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('backToThreads')}</span>
      </Link>

      {/* Main Thread Detail Card */}
      <article className="glass-card p-6 md:p-8 rounded-2xl space-y-6 border border-[var(--card-border)] relative overflow-hidden transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={threadDetail.owner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(threadDetail.owner.name)}&background=random`}
              alt={threadDetail.owner.name}
              className="w-11 h-11 rounded-full border border-[var(--card-border)] object-cover"
            />
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-color)]">{threadDetail.owner.name}</h4>
              <p className="text-xs text-[var(--text-muted)]">{postedAt(threadDetail.createdAt)}</p>
            </div>
          </div>
          {threadDetail.category && (
            <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-[var(--pill-bg)] text-[var(--pill-text)] border border-[var(--card-border)] rounded-full">
              <Tag className="w-3 h-3" />
              {threadDetail.category}
            </span>
          )}
        </div>

        <h1 className="text-xl md:text-3xl font-extrabold text-[var(--text-color)] tracking-tight leading-snug">
          {threadDetail.title}
        </h1>

        {/* Safe HTML rendering */}
        <div
          className="text-sm md:text-base text-[var(--text-sub)] leading-relaxed space-y-4 break-words prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(threadDetail.body) }}
        />

        {/* Votes for Thread Detail */}
        <div className="flex items-center gap-4 pt-6 border-t border-[var(--divider-color)] text-xs text-[var(--text-muted)] font-medium">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUpvote}
              className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                isUpvoted
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400'
                  : 'border-[var(--card-border)] hover:bg-[var(--bg-accent)] text-[var(--text-muted)] hover:text-[var(--text-color)]'
              }`}
              title="Upvote thread"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <span className={isUpvoted ? 'text-emerald-500 dark:text-emerald-400 font-bold' : ''}>
              {threadDetail.upVotesBy.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownvote}
              className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                isDownvoted
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 dark:text-rose-450'
                  : 'border-[var(--card-border)] hover:bg-[var(--bg-accent)] text-[var(--text-muted)] hover:text-[var(--text-color)]'
              }`}
              title="Downvote thread"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
            <span className={isDownvoted ? 'text-rose-500 dark:text-rose-450 font-bold' : ''}>
              {threadDetail.downVotesBy.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto text-[var(--text-muted)]">
            <MessageSquare className="w-4 h-4" />
            <span>{threadDetail.comments.length} {t('comments')}</span>
          </div>
        </div>
      </article>

      {/* Comments section */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-[var(--text-color)] flex items-center gap-2">
          <CornerDownRight className="w-5 h-5 text-indigo-500" />
          {t('comments')} ({threadDetail.comments.length})
        </h3>

        {/* Comment input form */}
        {authUser ? (
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <textarea
              required
              rows="4"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-[var(--input-border)] rounded-2xl bg-[var(--input-bg)] placeholder-[var(--text-muted)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-505 transition-all text-sm resize-none"
              placeholder={t('writeComment')}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/10 hover:scale-[1.01] cursor-pointer"
              >
                {t('postComment')}
              </button>
            </div>
          </form>
        ) : (
          <div className="glass-card p-5 rounded-2xl border border-[var(--card-border)] text-center transition-colors">
            <p className="text-[var(--text-muted)] text-xs md:text-sm font-medium mb-3">
              {t('loginToComment')}
            </p>
            <Link
              to="/login"
              className="inline-flex px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
            >
              {t('login')}
            </Link>
          </div>
        )}

        {/* Comments Feed list */}
        {threadDetail.comments.length > 0 ? (
          <div className="glass-card p-6 rounded-2xl border border-[var(--card-border)] space-y-4 divide-y divide-[var(--divider-color)] transition-colors">
            {threadDetail.comments.map((comment) => (
              <CommentItem key={comment.id} {...comment} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center rounded-2xl border border-[var(--card-border)] transition-colors">
            <p className="text-[var(--text-muted)] text-xs md:text-sm font-medium">{t('noComments')}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ThreadDetailPage;
