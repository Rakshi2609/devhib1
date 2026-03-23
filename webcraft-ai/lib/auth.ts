import { cookies } from 'next/headers'

export function getLoggedInUsername(): string | null {
  const cookieStore = cookies()
  const username = cookieStore.get('webcraft_user')?.value?.trim().toLowerCase() || ''
  return username || null
}
