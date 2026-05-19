import { useState, useCallback, useEffect } from "react"
import { encode, decode } from "@/utils/crypto"
import { teamService } from "@/services/team.service"

const ADMIN_AUTH_KEY = 'admin_auth_token'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem(ADMIN_AUTH_KEY)
    if (!token) {
      setIsAuthenticated(false)
      setIsLoading(false)
      return false
    }

    const decoded = decode(token)
    if (!decoded) {
      localStorage.removeItem(ADMIN_AUTH_KEY)
      setIsAuthenticated(false)
      setIsLoading(false)
      return false
    }

    setIsAuthenticated(true)
    setIsLoading(false)
    return true
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (password: string) => {
    const token = encode(password)
    localStorage.setItem(ADMIN_AUTH_KEY, token)

    try {
      await teamService.getTeams()
      setIsAuthenticated(true)
      return true
    } catch {
      localStorage.removeItem(ADMIN_AUTH_KEY)
      setIsAuthenticated(false)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY)
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  }
}
