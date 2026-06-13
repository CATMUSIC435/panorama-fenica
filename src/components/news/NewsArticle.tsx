import React from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { WPPost } from '../../hooks/useFetchNews';
import { playClick } from '../../utils/sound';

interface NewsArticleProps {
  post: WPPost;
  onBack: () => void;
  t: (key: string) => string;
}

export const NewsArticle: React.FC<NewsArticleProps> = ({ post, onBack, t }) => {
  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={() => { playClick(); onBack(); }}
        className="flex items-center gap-2 text-sm font-bold text-accent hover:text-accent-hover transition-colors px-4 py-2 bg-accent/10 rounded-full w-fit hover:bg-accent/20 mb-6 active:scale-95"
      >
        <ArrowLeft size={16} />
        {t('news.back')}
      </button>

      {post.jetpack_featured_media_url && (
        <img 
          src={post.jetpack_featured_media_url} 
          alt="Cover"
          loading="lazy"
          className="w-full h-80 object-cover rounded-3xl mb-8 shadow-sm"
        />
      )}

      <div className="flex items-center gap-2 text-sm text-secondary font-medium mb-4">
        <Calendar size={16} />
        <time>
          {new Date(post.date).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
          })}
        </time>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <h2 
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        <div 
          className="wp-content border-t border-black/10 pt-8"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>
    </div>
  );
};
