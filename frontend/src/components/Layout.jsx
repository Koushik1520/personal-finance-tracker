import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Wallet, ArrowUpRight, ArrowDownLeft, PieChart, Target, FileText, User, LogOut, Menu, X, Bell, Sun, Moon, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../utils/api'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/expenses', icon: Wallet, label: 'Expenses' },
  { path: '/incomes', icon: ArrowDownLeft, label: 'Incomes' },
  { path: '/budgets', icon: PieChart, label: 'Budgets' },
  { path: '/savings-goals', icon: Target, label: 'Savings Goals' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function Layout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    api.get('/notifications/unread').then(res => setNotifications(res.data)).catch(() => {})
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-primary-600">FinanceTracker</h1>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.path === '/notifications' && notifications.length > 0 && (
                <span className="ml-auto bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No unread notifications</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div key={n.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <button onClick={() => { setShowNotifications(false); navigate('/notifications') }} className="w-full text-center text-sm text-primary-600 hover:text-primary-700 py-2">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user?.name}</span>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
