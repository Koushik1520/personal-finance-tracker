import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          })
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('refreshToken', res.data.refreshToken)
          originalRequest.headers.Authorization = `Bearer ${res.data.token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default api
