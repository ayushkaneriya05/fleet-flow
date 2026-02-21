'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Truck, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'

// Basic UI component placeholders until we set up shadcn
// Since shadcn config is failing or pending, I'll use standard Tailwind for this page matching the reference.

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to login')
      }

      // Route based on role (Simple logic, can be expanded)
      router.push('/')
      router.refresh() // To re-evaluate middleware
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-neutral-200">
        <div className="bg-[#6324eb] p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">FleetFlow</h1>
          <p className="text-white/80 text-sm">Logistics Management Engine</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">Sign In to Command Center</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@fleetflow.test"
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-[#6324eb] focus:border-[#6324eb] sm:text-sm outline-none transition-colors"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-[#6324eb] focus:border-[#6324eb] sm:text-sm outline-none transition-colors"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#6324eb] hover:bg-[#521dc4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6324eb] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500 flex flex-col gap-2">
            <div>
              For demo: <span className="font-semibold text-neutral-800">admin@fleetflow.test</span> / <span className="font-semibold text-neutral-800">password123</span>
            </div>
            <div>
              Don't have an account? <Link href="/register" className="font-semibold text-[#6324eb] hover:underline">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
