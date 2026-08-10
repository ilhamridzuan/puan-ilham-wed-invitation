export type Attendance = 'hadir' | 'tidak_hadir'

export interface RSVP {
  id: string
  name: string
  attendance: Attendance
  guest_count: number
  created_at: string
}

export interface Wish {
  id: string
  name: string
  message: string
  created_at: string
}
