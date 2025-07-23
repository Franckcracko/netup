'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
// import PostCard from './PostCard';

export const FeedScreen = () => {
  const [activeTab, setActiveTab] = useState<'public' | 'friends'>('public');
  const filteredPosts = []
  // const filteredPosts = useMemo(() => {
  //   if (activeTab === 'public') {
  //     return posts;
  //   } else {
  //     const friendIds = friends.map(f => f.id);
  //     const userPostsIncluded = user ? [user.id, ...friendIds] : friendIds;
  //     return posts.filter(post => userPostsIncluded.includes(post.userId));
  //   }
  // }, [posts, activeTab, friends, user]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Feed Tabs */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6 overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setActiveTab('public')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'public'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Posts Públicos
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'friends'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            Posts de Amigos
          </button>
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
          <p className="text-gray-400 text-lg mb-2">
            {activeTab === 'public' 
              ? 'No hay posts públicos aún' 
              : 'No hay posts de amigos'
            }
          </p>
          <p className="text-gray-500 text-sm">
            {activeTab === 'public'
              ? '¡Sé el primero en compartir algo!'
              : 'Conecta con amigos para ver sus posts aquí'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))} */}
        </div>
      )}
    </div>
  );
};
