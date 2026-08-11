'use client';

import { useState, useTransition } from 'react';
import type { RSVP, Attendance } from '@/lib/types';
import { deleteRSVP, updateRSVP } from '@/lib/actions';

export default function RSVPTable({ initialRsvps }: { initialRsvps: RSVP[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAttendance, setEditAttendance] = useState<Attendance>('hadir');
  const [editGuestCount, setEditGuestCount] = useState<number>(1);
  const [isPending, startTransition] = useTransition();

  const handleEditClick = (rsvp: RSVP) => {
    setEditingId(rsvp.id);
    setEditName(rsvp.name);
    setEditAttendance(rsvp.attendance);
    setEditGuestCount(rsvp.guest_count);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = (id: string) => {
    startTransition(async () => {
      await updateRSVP(id, editName, editAttendance, editGuestCount);
      setEditingId(null);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus RSVP ini?')) {
      startTransition(async () => {
        await deleteRSVP(id);
      });
    }
  };

  if (!initialRsvps || initialRsvps.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
        Belum ada RSVP.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Nama</th>
            <th className="p-3">Kehadiran</th>
            <th className="p-3">Jumlah Tamu</th>
            <th className="p-3">Waktu Pengiriman</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {initialRsvps.map((r) => {
            const isEditing = editingId === r.id;

            return (
              <tr key={r.id} className="border-t">
                {/* Nama */}
                <td className="p-3">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    r.name
                  )}
                </td>

                {/* Kehadiran */}
                <td className="p-3 capitalize">
                  {isEditing ? (
                    <select
                      value={editAttendance}
                      onChange={(e) => setEditAttendance(e.target.value as Attendance)}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="hadir">Hadir</option>
                      <option value="tidak_hadir">Tidak Hadir</option>
                    </select>
                  ) : (
                    r.attendance.replace('_', ' ')
                  )}
                </td>

                {/* Jumlah Tamu */}
                <td className="p-3">
                  {isEditing ? (
                    editAttendance === 'hadir' ? (
                      <select
                        value={editGuestCount}
                        onChange={(e) => setEditGuestCount(Number(e.target.value))}
                        className="border rounded px-2 py-1 w-full"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    ) : (
                      0
                    )
                  ) : (
                    r.guest_count
                  )}
                </td>

                {/* Waktu Kirim */}
                <td className="p-3 text-gray-400">
                  {new Date(r.created_at).toLocaleString('ms-MY')}
                </td>

                {/* Tindakan */}
                <td className="p-3 flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(r.id)}
                        disabled={isPending}
                        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs transition-colors"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isPending}
                        className="text-gray-600 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-xs transition-colors"
                      >
                        Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(r)}
                        disabled={isPending}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={isPending}
                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors"
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
