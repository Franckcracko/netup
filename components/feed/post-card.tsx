import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreVertical } from 'lucide-react';
import { Post } from '../../types';
import { usePost } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatTimeAgo } from '../../utils/validation';
import CommentModal from './CommentModal';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const { likePost, addReaction } = usePost();
  const { user } = useAuth();

  const isLiked = user ? post.likes.includes(user.id) : false;
  const userReaction = user ? post.reactions[user.id] : null;

  const reactions = ['❤️', '👍', '😂', '😮', '😢', '😡'];

  const handleLike = () => {
    if (user) {
      likePost(post.id);
    }
  };

  const handleReaction = (reaction: string) => {
    if (user) {
      addReaction(post.id, reaction);
      setShowReactions(false);
    }
  };

  const getReactionCounts = () => {
    const counts: { [key: string]: number } = {};
    Object.values(post.reactions).forEach(reaction => {
      counts[reaction] = (counts[reaction] || 0) + 1;
    });
    return counts;
  };

  const reactionCounts = getReactionCounts();

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-4 transition-all hover:border-gray-600">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
            alt={post.author.fullName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="text-white font-medium">{post.author.fullName}</h3>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>@{post.author.username}</span>
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">{post.content}</p>
        {post.image && (
          <div className="mt-3">
            <img
              src={post.image}
              alt="Post content"
              className="w-full rounded-lg max-h-96 object-cover"
            />
          </div>
        )}
      </div>

      {/* Reaction Summary */}
      {(post.likes.length > 0 || Object.keys(post.reactions).length > 0) && (
        <div className="flex items-center justify-between text-gray-400 text-sm mb-3 pb-3 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            {Object.entries(reactionCounts).length > 0 && (
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-1">
                  {Object.keys(reactionCounts).slice(0, 3).map(reaction => (
                    <span key={reaction} className="text-lg">{reaction}</span>
                  ))}
                </div>
                <span>{Object.values(reactionCounts).reduce((a, b) => a + b, 0)}</span>
              </div>
            )}
            {post.likes.length > 0 && (
              <span>{post.likes.length} me gusta</span>
            )}
          </div>
          {post.comments.length > 0 && (
            <span>{post.comments.length} comentarios</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likes.length}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(true)}
            className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments.length}</span>
          </button>

          {/* Reaction Button */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className={`flex items-center space-x-2 transition-colors ${
                userReaction ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              <span className="text-lg">{userReaction || '😊'}</span>
            </button>
            
            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 bg-gray-700 rounded-lg p-2 flex space-x-1 shadow-lg border border-gray-600 z-10">
                {reactions.map(reaction => (
                  <button
                    key={reaction}
                    onClick={() => handleReaction(reaction)}
                    className="text-lg hover:scale-125 transition-transform p-1"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Share Button */}
        <button className="text-gray-400 hover:text-green-500 transition-colors">
          <Share className="w-5 h-5" />
        </button>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        post={post}
      />
    </div>
  );
};

export default PostCard;