import { useState, useEffect } from 'react';

export interface WPPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  link: string;
  jetpack_featured_media_url: string;
}

const newsCache: Record<string, { posts: WPPost[], totalPages: number }> = {};

interface FetchNewsResult {
  posts: WPPost[];
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

export const useFetchNews = (page: number, perPage: number = 6): FetchNewsResult => {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `${page}-${perPage}`;

    const fetchPosts = async () => {
      // Return cached data immediately if available
      if (newsCache[cacheKey]) {
        setPosts(newsCache[cacheKey].posts);
        setTotalPages(newsCache[cacheKey].totalPages);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Optimize WP payload by requesting only specific fields
        const fields = 'id,date,title,excerpt,content,link,jetpack_featured_media_url';
        const response = await fetch(`https://fenica.vn/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}&_fields=${fields}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        let fetchedTotalPages = 1;
        // Read the total pages from header
        const totalPagesHeader = response.headers.get('x-wp-totalpages');
        if (totalPagesHeader) {
          fetchedTotalPages = parseInt(totalPagesHeader, 10);
          setTotalPages(fetchedTotalPages);
        }

        const data: WPPost[] = await response.json();
        setPosts(data);
        
        // Save to cache
        newsCache[cacheKey] = { posts: data, totalPages: fetchedTotalPages };
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, perPage]);

  return { posts, totalPages, isLoading, error };
};
