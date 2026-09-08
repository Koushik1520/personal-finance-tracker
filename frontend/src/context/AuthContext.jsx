import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/profile')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('refreshToken', res.data.refreshToken)
    setUser({ name: res.data.name, email: res.data.email, role: res.data.role })
    return res.data
  }

  const register = async (data) => {
    const res = await api.post('/auth/register', data)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('refreshToken', res.data.refreshToken)
    setUser({ name: res.data.name, email: res.data.email, role: res.data.role })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const updateProfile = async (data) => {
    const res = await api.put('/profile', data)
    setUser(res.data)
    if (res.data.theme) {
      localStorage.setItem('theme', res.data.theme)
      document.documentElement.classList.toggle('dark', res.data.theme === 'dark')
    }
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
