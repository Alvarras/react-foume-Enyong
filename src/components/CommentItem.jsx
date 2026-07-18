import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { postedAt } from '../utils/dateHelper';
import DOMPurify from '../utils/dompurify';
import { asyncToggleUpvoteComment, asyncToggleDownvoteComment } from '../states/threadDetail/action';

function CommentItem({ id, content, createdAt, owner, upVotesBy, downVotesBy }) {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);

  const isUpvoted = authUser && upVotesBy.includes(authUser.id);
  const isDownvoted = authUser && downVotesBy.includes(authUser.id);

  const handleUpvote = () => {
    dispatch(asyncToggleUpvoteComment(id));
  };

  const handleDownvote = () => {
    dispatch(asyncToggleDownvoteComment(id));
  };

  return (
    <div className="py-4 border-b border-[var(--divider-color)] last:border-0 flex gap-4 items-start transition-colors">
      <img
        src={owner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.name)}&background=random`}
        alt={owner.name}
        className="w-8 h-8 rounded-full border border-[var(--card-border)] object-cover mt-0.5"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs md:text-sm font-semibold text-[var(--text-color)]">{owner.name}</span>
            <span className="text-[10px] md:text-xs text-[var(--text-muted)] ml-2">{postedAt(createdAt)}</span>
          </div>
        </div>

        {/* Comment Content */}
        <div
          className="text-xs md:text-sm text-[var(--text-sub)] leading-relaxed break-words"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
        />

        {/* Comment Votes */}
        <div className="flex items-center gap-3 pt-2 text-[10px] md:text-xs text-[var(--text-muted)] font-medium">
          <div className="flex items-center gap-1">
            <button
              onClick={handleUpvote}
              className={`p-1 rounded transition-colors cursor-pointer ${
                isUpvoted
                  ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10'
                  : 'hover:text-[var(--text-color)] hover:bg-[var(--bg-accent)]'
              }`}
              title="Upvote comment"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <span className={isUpvoted ? 'text-emerald-500 dark:text-emerald-400 font-bold' : ''}>
              {upVotesBy.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleDownvote}
              className={`p-1 rounded transition-colors cursor-pointer ${
                isDownvoted
                  ? 'text-rose-500 dark:text-rose-400 bg-rose-500/10'
                  : 'hover:text-[var(--text-color)] hover:bg-[var(--bg-accent)]'
              }`}
              title="Downvote comment"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
            <span className={isDownvoted ? 'text-rose-500 dark:text-rose-400 font-bold' : ''}>
              {downVotesBy.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
