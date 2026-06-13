import React from 'react';
import { Calendar, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { WPPost } from '../../hooks/useFetchNews';
import { playClick, playPop } from '../../utils/sound';

interface NewsGridProps {
  posts: WPPost[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPostSelect: (post: WPPost) => void;
  t: (key: string) => string;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ 
  posts, 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPostSelect, 
  t 
}) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {posts.map((news) => {
          const dateObj = new Date(news.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          });

          return (
            <article 
              key={news.id} 
              onClick={() => { playPop(); onPostSelect(news); }}
              className="glass-card glass-card-hover rounded-[2.5rem] overflow-hidden group flex flex-col p-0 cursor-pointer border-white/20 active:scale-[0.98]"
            >
              <div className="relative h-48 overflow-hidden bg-white/20">
                {news.jetpack_featured_media_url ? (
                  <img 
                    src={news.jetpack_featured_media_url} 
                    alt="Cover"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30 text-sm font-medium">
                    {t('news.no_image')}
                  </div>
                )}
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] font-bold px-3 py-1.5 bg-white/70 backdrop-blur-xl text-primary rounded-full shadow-sm uppercase tracking-wider border border-white/50">
                    {t('news.label')}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-primary/60 font-medium mb-3">
                  <Calendar size={14} />
                  <time>{formattedDate}</time>
                </div>
                <h4 
                  className="text-[17px] font-bold text-primary mb-4 group-hover:text-accent transition-colors line-clamp-2 leading-snug"
                  dangerouslySetInnerHTML={{ __html: news.title.rendered }}
                />
                <div className="flex items-center gap-2 text-sm font-bold text-accent group/btn hover:text-accent-hover transition-colors mt-auto w-fit">
                  {t('news.read_more')}
                  <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination UI - visionOS Style */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center sticky bottom-0 z-10 pb-2">
          <div className="glass-panel rounded-full p-1.5 flex items-center gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <button 
              disabled={currentPage === 1}
              onClick={() => { playClick(); onPageChange(Math.max(1, currentPage - 1)); }}
              className="p-2.5 rounded-full hover:bg-white/60 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-primary active:scale-90"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => { playClick(); onPageChange(pageNum); }}
                  className={`w-9 h-9 rounded-full text-sm font-bold transition-all flex items-center justify-center active:scale-90 ${
                    currentPage === pageNum 
                      ? 'bg-accent text-white shadow-md' 
                      : 'text-primary hover:bg-white/60'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button 
              disabled={currentPage === totalPages}
              onClick={() => { playClick(); onPageChange(Math.min(totalPages, currentPage + 1)); }}
              className="p-2.5 rounded-full hover:bg-white/60 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-primary active:scale-90"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
