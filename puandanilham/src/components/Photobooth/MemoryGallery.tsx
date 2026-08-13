'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type PhotoboothEntry = {
  id: string;
  sender_name: string;
  message: string;
  photo_url: string;
  frame_id: string;
  created_at: string;
};



export default function MemoryGallery() {
  const [entries, setEntries] = useState<PhotoboothEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 9; // multiples of 3 for clean rows

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#384D95]"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {entries.length === 0 ? (
        <p className="text-center text-[#384D95] font-serif italic py-12">
          Belum ada kenangan. Jadilah yang pertama!
        </p>
      ) : (
        /* CSS columns masonry — naturally stacks strips of varying heights */
        <div className="columns-2 gap-2 w-full">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="break-inside-avoid mb-2 w-full overflow-hidden rounded-sm"
            >
              <img
                src={entry.photo_url}
                alt={`Dari ${entry.sender_name}`}
                loading="lazy"
                className="w-full h-auto object-contain block"
              />
            </div>
          ))}
        </div>
      )}

      {hasMore && entries.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-white/20 border border-[#384D95]/30 text-[#384D95] hover:bg-white/40 rounded-full font-serif text-[14px] transition-colors disabled:opacity-50 backdrop-blur-sm"
          >
            {loadingMore ? 'Memuat...' : 'Muat Lagi'}
          </button>
        </div>
      )}
    </div>
  );
}


