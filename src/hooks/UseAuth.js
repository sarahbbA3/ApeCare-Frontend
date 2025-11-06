import { useState } from "react"

export const useAuth = () => {
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem("usuario")
    return stored ? JSON.parse(stored) : null
  })

  const isAuthenticated = !!usuario

  const logout = () => {
    localStorage.removeItem("usuario")
    setUsuario(null)
    window.location.href = "/login"
  }

  return { usuario, isAuthenticated, logout }
}