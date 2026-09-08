import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { Wallet, Mail } from 'lucide-react'

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/forgot-password', { email: data.email })
      toast.success('Password reset link sent to your email!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
            <Wallet className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Enter your email and we'll send you a reset link</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="input-field pl-10" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-danger-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <Link to="/login" className="text-primary-600 hover:text-primary-700">Back to login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
