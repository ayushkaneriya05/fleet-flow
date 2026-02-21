'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Truck, Lock, Mail, AlertCircle, Loader2, User, ShieldCheck } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCE_ANALYST']),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: 'FLEET_MANAGER' },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to register')
      }

      router.push('/')
      router.refresh()
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
          <p className="text-white/80 text-sm">Create an Account</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">Register new user</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-[#6324eb] focus:border-[#6324eb] sm:text-sm outline-none transition-colors"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-neutral-400" />
                </div>
                <select
                  {...register('role')}
                  className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-[#6324eb] focus:border-[#6324eb] sm:text-sm outline-none transition-colors bg-white"
                >
                  <option value="FLEET_MANAGER">Fleet Manager</option>
                  <option value="DISPATCHER">Dispatcher</option>
                  <option value="SAFETY_OFFICER">Safety Officer</option>
                  <option value="FINANCE_ANALYST">Finance Analyst</option>
                </select>
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#6324eb] hover:bg-[#521dc4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6324eb] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            Already have an account? <Link href="/login" className="font-semibold text-[#6324eb] hover:underline">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
