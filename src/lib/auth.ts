import { createClient } from './supabase'

export type UserRole = 'TELECONTACT' | 'ATLANTASANAD'

export interface AppUser {
  id: string
  email: string
  role: UserRole
  name: string
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return {
    id: user.id,
    email: user.email!,
    role: (user.user_metadata?.role as UserRole) || 'ATLANTASANAD',
    name: user.user_metadata?.name || user.email!,
  }
}

export async function getRole(): Promise<UserRole> {
  const user = await getCurrentUser()
  return user?.role || 'ATLANTASANAD'
}
