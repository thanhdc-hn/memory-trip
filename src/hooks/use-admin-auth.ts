import { useState, useCallback, useEffect } from "react"
import storage from "@/utils/storage"

const EXPIRE_ADMIN = 60 // minutes
const AUTH_KEY = "admin_auth_expire"

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  const checkAuth = useCallback(() => {
    const expire = storage.get<string>(AUTH_KEY)
    if (!expire) {
      setIsAuthenticated(false)
      return false
    }

    const now = new Date().getTime()
    if (now > parseInt(expire)) {
      storage.remove(AUTH_KEY)
      setIsAuthenticated(false)
      return false
    }

    setIsAuthenticated(true)
    return true
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = (password: string) => {
    const ADMIN_PASSWORD = import.meta.env.VITE_SUPABASE_ADMIN_PASSWORD

    if (password === ADMIN_PASSWORD) {
      const expireTime = new Date().getTime() + EXPIRE_ADMIN * 30 * 1000
      storage.set(AUTH_KEY, expireTime.toString())
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    storage.remove(AUTH_KEY)
    setIsAuthenticated(false)
  }

  const getTimeRemaining = () => {
    const expire = storage.get<string>(AUTH_KEY)
    if (!expire) return 0
    return Math.max(0, parseInt(expire) - new Date().getTime())
  }

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth,
    getTimeRemaining
  }
}
