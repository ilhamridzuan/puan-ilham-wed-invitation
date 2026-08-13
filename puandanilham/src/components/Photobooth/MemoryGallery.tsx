'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type PhotoboothEntry = {
  id: string;
  sender_name: string;
  message: string;
  photo_url: string;
  created_at: string;
};

export default function MemoryGallery() {
  const [entries, setEntries] = useState<PhotoboothEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 10;

  const fetchEntries = async (pageIndex: number) => {
    try {
      const supabase = createClient();
      const from = pageIndex * limit;
      const to = from + limit - 1;
      
      const { data, error } = await supabase
        .from('photobooth_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      
      if (data) {
        if (pageIndex === 0) {
          setEntries(data);
        } else {
          setEntries((prev) => [...prev, ...data]);
        }
        
        if (data.length < limit) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEntries(0);
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEntries(nextPage);
  };

  if (loading && entries.length === 0) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {entries.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Belum ada kenangan. Jadilah yang pertama!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
              <div className="relative w-full aspect-[4/5] bg-gray-100">
                <img 
                  src={entry.photo_url} 
                  alt={`Dari ${entry.sender_name}`} 
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-medium text-amber-900 text-sm md:text-base line-clamp-1">{entry.sender_name}</h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1 flex-grow line-clamp-3">{entry.message}</p>
                <span className="text-[10px] text-gray-400 mt-3">
                  {new Date(entry.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && entries.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-white border border-amber-600 text-amber-700 hover:bg-amber-50 rounded-full font-medium transition-colors disabled:opacity-50"
          >
            {loadingMore ? 'Memuat...' : 'Muat Lagi'}
          </button>
        </div>
      )}
    </div>
  );
}
