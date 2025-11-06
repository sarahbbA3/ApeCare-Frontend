import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pill, Lock, Mail, AlertCircle } from "lucide-react"
import { login as loginService } from "../services/AuthService"
import { useAuth } from "../context/AuthContext" 
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth() 

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const usuario = await loginService(email, password)
      login(usuario) 
      navigate("/")   
    } catch (err) {
      setError(typeof err === "string" ? err : "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-100 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 border">
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Pill className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold">Bienvenido a ApeCare</h1>
          <p className="text-gray-500 text-sm">Ingresa tus credenciales para acceder</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="tucorreo@apecare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md pl-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md pl-10 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  )
}