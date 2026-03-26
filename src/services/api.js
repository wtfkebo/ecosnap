import axios from 'axios'

const API = axios.create({
  // Use VITE_API_URL if defined, otherwise default to local
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

// Automatically attach JWT from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecosnap_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
