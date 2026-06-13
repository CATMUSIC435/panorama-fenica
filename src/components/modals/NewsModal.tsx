import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useFetchNews, WPPost } from '../../hooks/useFetchNews';
import { useTranslation } from 'react-i18next';
import { NewsSkeleton } from '../news/NewsSkeleton';
import { NewsArticle } from '../news/NewsArticle';
import { NewsGrid } from '../news/NewsGrid';

export const NewsModal: React.FC = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<WPPost | null>(null);
  const { posts, totalPages, isLoading, error } = useFetchNews(currentPage, 6);

  return (
    <Modal title={t('news.title')} maxWidth="max-w-6xl">
      <div className="flex flex-col min-h-[600px] relative">
        {error && !selectedPost && (
          <div className="text-red-500 bg-red-100/50 p-4 rounded-[2rem] glass-panel text-center">
            {t('news.error')}: {error}
          </div>
        )}
        
        {/* Full Article View */}
        {selectedPost ? (
          <NewsArticle 
            post={selectedPost} 
            onBack={() => setSelectedPost(null)} 
            t={t} 
          />
        ) : (
          /* Grid View */
          <>
            {isLoading ? (
              <NewsSkeleton />
            ) : (
              <NewsGrid 
                posts={posts}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onPostSelect={setSelectedPost}
                t={t}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
