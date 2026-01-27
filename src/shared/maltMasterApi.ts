import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}
interface FailedQueueItem {
  resolve: (value: void) => void
  reject: (reason?: unknown) => void
}

let failedQueue: FailedQueueItem[] = []

const processQueue = (error?: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve()
  })

  failedQueue = []
}

let isRefreshing = false

export const maltMasterApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

maltMasterApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

maltMasterApi.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => maltMasterApi(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post<{
          accessToken: string
          refreshToken: string
        }>(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          refreshToken,
          userId,
        })

        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)

        processQueue()

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return maltMasterApi(originalRequest)
      } catch (err) {
        processQueue(err)
        localStorage.clear()
        window.location.href = '/sign-in'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
