import { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('ecosnap_token')
      if (token) {
        try {
          const { data } = await API.get('/auth/me')
          setUser(data.user)
        } catch (err) {
          localStorage.removeItem('ecosnap_token')
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password })
    localStorage.setItem('ecosnap_token', data.session.access_token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('ecosnap_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
