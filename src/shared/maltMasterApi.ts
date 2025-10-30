import axios from 'axios'

export const maltMasterApi = axios.create({
  baseURL: process.env.VITE_API_URL,
})

maltMasterApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      return (window.location.href = `/sign-in`)
    }
    throw error
  },
)
