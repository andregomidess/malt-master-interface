import axios from 'axios'

export const maltMasterApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

maltMasterApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

maltMasterApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  },
)
