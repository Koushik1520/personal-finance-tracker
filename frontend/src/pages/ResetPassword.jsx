import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { Wallet, Eye, EyeOff } from 'lucide-react'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

  const password = watch('newPassword')

  const onSubmit = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      await api.post('/auth/reset-password', { token, newPassword: data.newPassword })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invalid Reset Link</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">The reset link is invalid or expired.</p>
          <a href="/forgot-password" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">Request a new link</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
            <Wallet className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Enter your new password below</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} {...register('newPassword', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} className="input-field pr-10" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-danger-500 text-sm mt-1">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <input type="password" {...register('confirmPassword', { required: 'Please confirm your password' })} className="input-field" placeholder="Re-enter password" />
              {errors.confirmPassword && <p className="text-danger-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
