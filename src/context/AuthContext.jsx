import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("usuario")
    if (stored) {
      setUsuario(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    localStorage.setItem("usuario", JSON.stringify(data))
    setUsuario(data)
  }

  const logout = () => {
    localStorage.removeItem("usuario")
    setUsuario(null)
  }

  const isAuthenticated = !!usuario

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)