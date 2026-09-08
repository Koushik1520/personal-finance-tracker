import { useEffect, useState } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Palette, Bell, BellOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredCurrency: 'USD',
    emailNotifications: true,
    budgetAlerts: true,
    theme: 'light'
  })

  const fetchProfile = () => {
    setLoading(true)
    api.get('/profile')
      .then(res => {
        setProfile(res.data)
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          preferredCurrency: res.data.preferredCurrency || 'USD',
          emailNotifications: res.data.emailNotifications ?? true,
          budgetAlerts: res.data.budgetAlerts ?? true,
          theme: res.data.theme || 'light'
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProfile() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-[400px]">Loading profile...</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-600">{profile?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile?.email}</p>
              <span className="inline-block mt-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 text-xs rounded-full font-medium">{profile?.role}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Currency</label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select value={form.preferredCurrency} onChange={e => setForm({...form, preferredCurrency: e.target.value})} className="input-field pl-10">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Notification Settings</h4>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                {form.emailNotifications ? <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <BellOff className="w-5 h-5 text-gray-400" />}
                <span className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.emailNotifications} onChange={e => setForm({...form, emailNotifications: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Budget Alerts</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.budgetAlerts} onChange={e => setForm({...form, budgetAlerts: e.target.checked})} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Theme Preference</h4>
            <div className="flex gap-4">
              {['light', 'dark'].map(theme => (
                <button key={theme} type="button" onClick={() => setForm({...form, theme})} className={`flex-1 p-4 rounded-lg border-2 transition-colors ${form.theme === theme ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{theme} Mode</span>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
