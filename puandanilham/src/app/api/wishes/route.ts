import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { wishesLimiter } from '@/lib/rateLimit'
import { headers } from 'next/headers'
import { sanitizeInput } from '@/lib/sanitize'
import type { Wish } from '@/lib/types'

export async function POST(request: Request) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown'
  
  if (!wishesLimiter(ip)) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Silakan coba sebentar lagi.' },
      { status: 429 }
    )
  }

  const supabase = await createClient()
  const body: Omit<Wish, 'id' | 'created_at'> = await request.json()

  const { name, message } = body

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Nama wajib diisi.' }, { status: 400 })
  }
  if (!message?.trim()) {
    return NextResponse.json({ error: 'Pesan ucapan wajib diisi.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('wishes')
    .insert({ name: sanitizeInput(name), message: sanitizeInput(message) })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
