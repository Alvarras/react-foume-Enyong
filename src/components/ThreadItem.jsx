import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, ThumbsDown, Tag } from 'lucide-react';
import { postedAt } from '../utils/dateHelper';
import { asyncToggleUpvoteThread, asyncToggleDownvoteThread } from '../states/threads/action';
import useTranslation from '../hooks/useTranslation';

function ThreadItem({ id, title, body, category, createdAt, ownerId, upVotesBy, downVotesBy, totalComments }) {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);
  const users = useSelector((state) => state.users);
  const t = useTranslation();

  // Find owner details
  const owner = users.find((user) => user.id === ownerId);
  const ownerName = owner ? owner.name : 'Anonymous';
  const ownerAvatar = owner ? owner.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName)}&background=random`;

  const isUpvoted = authUser && upVotesBy.includes(authUser.id);
  const isDownvoted = authUser && downVotesBy.includes(authUser.id);

  const handleUpvote = (e) => {
    e.preventDefault();
    dispatch(asyncToggleUpvoteThread(id));
  };

  const handleDownvote = (e) => {
    e.preventDefault();
    dispatch(asyncToggleDownvoteThread(id));
  };

  // Strip HTML tags for clean description snippet
  const cleanBody = body.replace(/<\/?[^>]+(>|$)/g, '');
  const snippet = cleanBody.length > 160 ? `${cleanBody.substring(0, 160)}...` : cleanBody;

  return (
    <article className="glass-card glass-card-hover p-5 md:p-6 rounded-2xl flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={ownerAvatar}
              alt={ownerName}
              className="w-10 h-10 rounded-full border border-[var(--card-border)] object-cover"
            />
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-color)]">{ownerName}</h4>
              <p className="text-xs text-[var(--text-muted)]">{postedAt(createdAt)}</p>
            </div>
          </div>
          {category && (
            <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-[var(--pill-bg)] text-[var(--pill-text)] border border-[var(--card-border)] rounded-full">
              <Tag className="w-3 h-3" />
              {category}
            </span>
          )}
        </div>

        <Link to={`/threads/${id}`} className="group">
          <h3 className="text-lg md:text-xl font-bold text-[var(--text-color)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 leading-snug">
            {title}
          </h3>
        </Link>

        <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-3 leading-relaxed">
          {snippet}
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-[var(--divider-color)] text-xs text-[var(--text-muted)] font-medium">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUpvote}
            className={`flex items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer ${
              isUpvoted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400'
                : 'border-[var(--card-border)] hover:bg-[var(--bg-accent)] text-[var(--text-muted)] hover:text-[var(--text-color)]'
            }`}
            title="Upvote"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <span className={isUpvoted ? 'text-emerald-500 dark:text-emerald-400 font-bold' : ''}>
            {upVotesBy.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDownvote}
            className={`flex items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer ${
              isDownvoted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 dark:text-rose-450'
                : 'border-[var(--card-border)] hover:bg-[var(--bg-accent)] text-[var(--text-muted)] hover:text-[var(--text-color)]'
            }`}
            title="Downvote"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
          <span className={isDownvoted ? 'text-rose-500 dark:text-rose-455 font-bold' : ''}>
            {downVotesBy.length}
          </span>
        </div>

        <Link
          to={`/threads/${id}`}
          className="flex items-center gap-1.5 ml-auto hover:text-[var(--text-color)] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{totalComments} {t('comments')}</span>
        </Link>
      </div>
    </article>
  );
}

export default ThreadItem;
