import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Wallet, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
            <Wallet className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Start tracking your finances</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input type="text" {...register('name', { required: 'Name is required' })} className="input-field" placeholder="John Doe" />
              {errors.name && <p className="text-danger-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="input-field" placeholder="you@example.com" />
              {errors.email && <p className="text-danger-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input type="tel" {...register('phone', { required: 'Phone is required' })} className="input-field" placeholder="+1 234 567 8900" />
              {errors.phone && <p className="text-danger-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} className="input-field pr-10" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-danger-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <input type="password" {...register('confirmPassword', { required: 'Please confirm your password' })} className="input-field" placeholder="Re-enter password" />
              {errors.confirmPassword && <p className="text-danger-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
