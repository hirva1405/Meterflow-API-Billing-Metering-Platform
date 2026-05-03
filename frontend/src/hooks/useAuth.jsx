import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('mf_token')
    if (token) {
      authApi.me()
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('mf_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const r = await authApi.login({ email, password })
    localStorage.setItem('mf_token', r.data.access_token)
    const me = await authApi.me()
    setUser(me.data)
    return me.data
  }

  const register = async (email, password, full_name) => {
    await authApi.register({ email, password, full_name })
    return login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('mf_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
