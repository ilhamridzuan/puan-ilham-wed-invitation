import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (!claims) {
    redirect('/admin/login')
  }

  const { data: rsvps } = await supabase
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: false })

  const total = rsvps?.length ?? 0
  const hadir = rsvps?.filter((r) => r.attendance === 'hadir').length ?? 0
  const tidakHadir = rsvps?.filter((r) => r.attendance === 'tidak_hadir').length ?? 0
  const totalTamu = rsvps?.reduce((sum, r) => sum + r.guest_count, 0) ?? 0

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard RSVP — Puan &amp; Ilham</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total RSVP', value: total },
          { label: 'Hadir', value: hadir },
          { label: 'Tidak Hadir', value: tidakHadir },
          { label: 'Est. Tamu', value: totalTamu },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* RSVP table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Kehadiran</th>
              <th className="p-3">Jumlah Tamu</th>
              <th className="p-3">Waktu Kirim</th>
            </tr>
          </thead>
          <tbody>
            {rsvps?.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.name}</td>
                <td className="p-3 capitalize">{r.attendance.replace('_', ' ')}</td>
                <td className="p-3">{r.guest_count}</td>
                <td className="p-3 text-gray-400">
                  {new Date(r.created_at).toLocaleString('ms-MY')}
                </td>
              </tr>
            ))}
            {!rsvps?.length && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  Belum ada RSVP.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
