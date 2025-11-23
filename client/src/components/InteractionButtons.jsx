import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

const InteractionButtons = ({
    likes = 0,
    comments = 0,
    isLiked = false,
    onLike,
    onComment,
    size = 'normal' // 'normal' | 'small'
}) => {
    return (
        <ul className={`interaction-container ${size}`}>
            {/* Like Button */}
            <li
                className={`interaction-btn like ${isLiked ? 'active' : ''}`}
                onClick={onLike}
                role="button"
                tabIndex="0"
                aria-label="Like"
            >
                <span className="icon" aria-hidden="true">
                    <Heart
                        size={size === 'small' ? 20 : 28}
                        fill={isLiked ? 'white' : 'none'}
                        strokeWidth={2}
                    />
                </span>
                <span className="title">{likes} Likes</span>
            </li>

            {/* Comment Button */}
            <li
                className="interaction-btn comment"
                onClick={onComment} // Only if onComment is provided
                role="button"
                tabIndex="0"
                aria-label="Comment"
            >
                <span className="icon" aria-hidden="true">
                    <MessageCircle
                        size={size === 'small' ? 20 : 28}
                        strokeWidth={2}
                    />
                </span>
                <span className="title">{comments} Comments</span>
            </li>
        </ul>
    );
};

export default InteractionButtons;
