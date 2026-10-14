"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

// Role constants
export const ROLES = {
  SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  DEPUTY_ADMIN: "ROLE_DEPUTY_ADMIN",
  CONTRACT_TYPE_CREATOR: "ROLE_CONTRACT_TYPE_CREATOR",
  LEASE_CREATOR: "ROLE_LEASE_CREATOR",
  DEPLOYER: "ROLE_DEPLOYER",
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on mount
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  const getUserRoles = () => {
    if (!user) return []
    // Support either `user.roles` (array) or `user.role` (string)
    if (Array.isArray(user.roles)) return user.roles.filter(Boolean)
    if (typeof user.role === "string" && user.role) return [user.role]
    return []
  }

  const hasRole = (role) => {
    const roles = getUserRoles()
    return roles.includes(role)
  }

  const hasAnyRole = (roles) => {
    if (!Array.isArray(roles) || roles.length === 0) return false
    const userRoles = getUserRoles()
    return roles.some((r) => userRoles.includes(r))
  }

  const isDeployer = () => hasRole(ROLES.DEPLOYER)

  const isAdmin = () => {
    const roles = getUserRoles()
    return roles.includes(ROLES.SUPER_ADMIN) || roles.includes(ROLES.DEPUTY_ADMIN)
  }

  const isUser = () => {
    const roles = getUserRoles()
    return roles.includes(ROLES.DEPLOYER) && !isAdmin()
  }

  const canCreateContracts = () => {
    const roles = getUserRoles()
    return roles.includes(ROLES.SUPER_ADMIN) || roles.includes(ROLES.LEASE_CREATOR)
  }

  const canCreateContractTypes = () => {
    const roles = getUserRoles()
    return roles.includes(ROLES.SUPER_ADMIN) || roles.includes(ROLES.CONTRACT_TYPE_CREATOR)
  }

  const canApproveContracts = () => {
    const roles = getUserRoles()
    return roles.includes(ROLES.SUPER_ADMIN) || roles.includes(ROLES.DEPUTY_ADMIN)
  }

  const canViewReports = () => {
    const roles = getUserRoles()
    return roles.includes(ROLES.SUPER_ADMIN) || roles.includes(ROLES.DEPLOYER) || roles.includes(ROLES.LEASE_CREATOR)
  }

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isDeployer,
    isAdmin,
    isUser,
    canCreateContracts,
    canCreateContractTypes,
    canApproveContracts,
    canViewReports,
    getUserRoles,
    ROLES,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
