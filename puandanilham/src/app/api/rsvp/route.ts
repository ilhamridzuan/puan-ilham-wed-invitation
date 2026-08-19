import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rsvpLimiter } from '@/lib/rateLimit'
import { headers } from 'next/headers'
import { sanitizeInput } from '@/lib/sanitize'
import type { RSVP } from '@/lib/types'

export async function POST(request: Request) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown'
  
  if (!rsvpLimiter(ip)) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Silakan coba sebentar lagi.' },
      { status: 429 }
    )
  }

  const supabase = await createClient()
  const body: Omit<RSVP, 'id' | 'created_at'> = await request.json()

  const { name, attendance, guest_count } = body

  // Server-side validation
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Nama wajib diisi.' }, { status: 400 })
  }
  if (!['hadir', 'tidak_hadir'].includes(attendance)) {
    return NextResponse.json({ error: 'Status kehadiran tidak valid.' }, { status: 400 })
  }
  if (!Number.isInteger(guest_count) || guest_count < 1 || guest_count > 10) {
    return NextResponse.json(
      { error: 'Jumlah tamu harus antara 1 dan 10.' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('rsvps')
    .insert({ name: sanitizeInput(name), attendance, guest_count })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
