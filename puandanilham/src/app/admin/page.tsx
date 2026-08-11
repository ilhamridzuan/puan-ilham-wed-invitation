import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RSVPTable from './RSVPTable'
import WishesTable from './WishesTable'
import { logoutAdmin } from '@/lib/actions'

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

  const { data: wishes } = await supabase
    .from('wishes')
    .select('*')
    .order('created_at', { ascending: false })

  const total = rsvps?.length ?? 0
  const hadir = rsvps?.filter((r) => r.attendance === 'hadir').length ?? 0
  const tidakHadir = rsvps?.filter((r) => r.attendance === 'tidak_hadir').length ?? 0
  const totalTamu = rsvps?.reduce((sum, r) => sum + r.guest_count, 0) ?? 0

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard RSVP — Puan &amp; Ilham</h1>
        <form action={logoutAdmin}>
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Keluar
          </button>
        </form>
      </div>

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

      <div className="flex flex-col gap-8">
        {/* RSVP table */}
        <div>
          <h2 className="text-xl font-bold mb-4">Daftar Kehadiran (RSVP)</h2>
          <RSVPTable initialRsvps={rsvps || []} />
        </div>

        {/* Wishes table */}
        <div>
          <h2 className="text-xl font-bold mb-4">Daftar Ucapan &amp; Doa</h2>
          <WishesTable initialWishes={wishes || []} />
        </div>
      </div>
    </main>
  )
}
