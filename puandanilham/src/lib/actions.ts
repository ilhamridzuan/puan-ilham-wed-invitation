'use server';

import { createClient } from '@/lib/supabase/server';
import { Attendance } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function submitRSVP(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const attendance = formData.get('attendance') as Attendance;
  const guestCount = parseInt(formData.get('guestCount') as string, 10);
  const message = formData.get('message') as string;

  if (!name || name.trim() === '') {
    return { status: 'error', message: 'Silakan masukkan nama anda.' };
  }

  if (attendance === 'hadir' && (isNaN(guestCount) || guestCount < 1 || guestCount > 10)) {
    return {
      status: 'error',
      message: 'Jumlah tamu harus antara 1 dan 10.',
    };
  }

  const supabase = await createClient();

  // Insert RSVP
  const { error: rsvpError } = await supabase.from('rsvps').insert({
    name: name.trim(),
    attendance,
    guest_count: attendance === 'hadir' ? guestCount : 0,
  });

  if (rsvpError) {
    console.error('RSVP Insert Error:', rsvpError);
    return {
      status: 'error',
      message: 'Terjadi kesalahan saat mengirim RSVP. Silakan coba lagi.',
    };
  }

  // Insert Wish if provided
  if (message && message.trim() !== '') {
    const { error: wishError } = await supabase.from('wishes').insert({
      name: name.trim(),
      message: message.trim(),
    });
    
    if (wishError) {
      console.error('Wish Insert Error:', wishError);
      // We don't fail the RSVP if the wish fails, but we could log it.
    }
  }

  // Revalidate admin page to reflect new RSVP
  revalidatePath('/admin');
  
  return { status: 'success', message: 'RSVP berhasil dikirim!' };
}

export async function deleteRSVP(id: string) {
  const supabase = await createClient();
  
  // Verify Admin Access
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase.from('rsvps').delete().eq('id', id);
  if (error) {
    console.error('Delete RSVP Error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function updateRSVP(id: string, name: string, attendance: Attendance, guest_count: number) {
  const supabase = await createClient();
  
  // Verify Admin Access
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase.from('rsvps').update({
    name,
    attendance,
    guest_count: attendance === 'hadir' ? guest_count : 0
  }).eq('id', id);

  if (error) {
    console.error('Update RSVP Error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function deleteWish(id: string) {
  const supabase = await createClient();
  
  // Verify Admin Access
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase.from('wishes').delete().eq('id', id);
  if (error) {
    console.error('Delete Wish Error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
