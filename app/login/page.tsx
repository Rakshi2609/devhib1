import Login from '@/components/auth/Login'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading login...</div>}>
      <Login />
    </Suspense>
  )
}
