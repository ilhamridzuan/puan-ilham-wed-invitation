'use client';

import { useTransition } from 'react';
import type { Wish } from '@/lib/types';
import { deleteWish } from '@/lib/actions';

export default function WishesTable({ initialWishes }: { initialWishes: Wish[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus ucapan ini?')) {
      startTransition(async () => {
        await deleteWish(id);
      });
    }
  };

  if (!initialWishes || initialWishes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
        Belum ada ucapan.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Nama</th>
            <th className="p-3">Ucapan / Doa</th>
            <th className="p-3 whitespace-nowrap">Waktu Pengiriman</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {initialWishes.map((w) => (
            <tr key={w.id} className="border-t">
              <td className="p-3 font-medium">{w.name}</td>
              <td className="p-3 whitespace-pre-wrap">{w.message}</td>
              <td className="p-3 text-gray-400 whitespace-nowrap">
                {new Date(w.created_at).toLocaleString('id-ID')}
              </td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => handleDelete(w.id)}
                  disabled={isPending}
                  className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
