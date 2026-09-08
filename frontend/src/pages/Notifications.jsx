import { useEffect, useState } from 'react'
import api from '../utils/api'
import { Bell, Check, CheckCheck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  const fetchNotifications = () => {
    setLoading(true)
    Promise.all([
      api.get('/notifications').catch(() => ({ data: [] })),
      api.get('/notifications/unread').catch(() => ({ data: [] }))
    ])
      .then(([allRes, unreadRes]) => {
        setNotifications(allRes.data)
        setUnread(unreadRes.data)
      })
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchNotifications() }, [])

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnread(prev => prev.filter(n => n.id !== id))
      toast.success('Marked as read')
    } catch (error) {
      toast.error('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await Promise.all(unread.map(n => api.put(`/notifications/${n.id}/read`)))
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnread([])
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'BUDGET_WARNING': return 'text-danger-600 bg-danger-50'
      case 'BUDGET_ALERT': return 'text-warning-600 bg-warning-50'
      case 'SAVINGS_MILESTONE': return 'text-success-600 bg-success-50'
      case 'SAVINGS_ALERT': return 'text-primary-600 bg-primary-50'
      case 'BILL_REMINDER': return 'text-warning-600 bg-warning-50'
      case 'REPORT': return 'text-primary-600 bg-primary-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const displayNotifications = activeTab === 'unread' ? unread : notifications

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with your financial alerts</p>
        </div>
        {unread.length > 0 && (
          <button onClick={markAllAsRead} className="btn-secondary flex items-center gap-2">
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          All ({notifications.length})
        </button>
        <button onClick={() => setActiveTab('unread')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'unread' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
          Unread ({unread.length})
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading notifications...</div>
        ) : displayNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayNotifications.map(notification => (
              <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${notification.isRead ? 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700' : 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'}`}>
                <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{notification.title}</h4>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <button onClick={() => markAsRead(notification.id)} className="p-1 text-gray-400 hover:text-primary-600 rounded flex-shrink-0" title="Mark as read">
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
