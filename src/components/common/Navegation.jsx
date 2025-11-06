"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import {
  Pill,
  Tag,
  MapPin,
  Home,
  Menu,
  X,
  HeartPulse,
  Activity,
  Stethoscope,
  UserCircle,
  Clock,
  Briefcase,
  ClipboardList,
  ChevronDown,
  Users,
  UserStar,
  UserPen,
  LogOut,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/tipo-farmaco", label: "Tipo de Fármaco", icon: Pill },
  { href: "/marca", label: "Marca", icon: Tag },
  { href: "/ubicacion", label: "Ubicación", icon: MapPin },
  { href: "/sintoma", label: "Síntomas", icon: HeartPulse },
  {
    label: "Gestión Clínica",
    icon: Stethoscope,
    submenu: [
      { href: "/medicamento", label: "Medicamentos", icon: Pill },
      { href: "/tipo-paciente", label: "Tipo de Paciente", icon: UserCircle },
      { href: "/paciente", label: "Pacientes", icon: Users },
      { href: "/tanda-labor", label: "Tanda Labor", icon: Clock },
      { href: "/especialidad", label: "Especialidades", icon: Briefcase },
      { href: "/medico", label: "Médicos", icon: Stethoscope },
      { href: "/registro-visita", label: "Registro de Visitas", icon: ClipboardList },
      { href: "/rol", label: "Roles", icon: UserStar },
      { href: "/usuario", label: "Usuarios", icon: UserPen },
    ],
  },
]

export function Navigation() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const { usuario, logout } = useAuth()
  const esMedico = usuario?.rol === "MEDICO"

  // ✅ Filtrar submenu si es médico
  const filteredNavItems = navItems.map((item) => {
    if (item.submenu && esMedico) {
      const submenuFiltrado = item.submenu.filter(
        (sub) => sub.href !== "/rol" && sub.href !== "/usuario"
      )
      return { ...item, submenu: submenuFiltrado }
    }
    return item
  })

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">ApeCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive =
                location.pathname === item.href ||
                (item.submenu && item.submenu.some((sub) => location.pathname === sub.href))

              if (item.submenu) {
                return (
                  <div
                    key={item.label}
                    className="relative group"
                    onMouseEnter={() => setSubmenuOpen(true)}
                    onMouseLeave={() => setSubmenuOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 ml-1 transition-transform ${
                          submenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {submenuOpen && (
                      <div className="absolute left-0 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-xl z-50 animate-fade-in">
                        {item.submenu.map((sub) => {
                          const SubIcon = sub.icon
                          const isSubActive = location.pathname === sub.href
                          return (
                            <Link
                              key={sub.href}
                              to={sub.href}
                              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                                isSubActive
                                  ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-l-4 border-transparent"
                              }`}
                            >
                              <SubIcon className="h-4 w-4" />
                              {sub.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}

            {/* 🔒 Botón Cerrar sesión (desktop) */}
            <button
              type="button"
              onClick={logout}
              className="ml-2 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  location.pathname === item.href ||
                  (item.submenu && item.submenu.some((sub) => location.pathname === sub.href))

                if (item.submenu) {
                  return (
                    <details key={item.label} className="px-3 py-2 group">
                      <summary className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                        <Icon className="h-4 w-4" />
                        {item.label}
                        <ChevronDown className="h-4 w-4 ml-auto group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-2 flex flex-col gap-1">
                        {item.submenu.map((sub) => {
                          const SubIcon = sub.icon
                          const isSubActive = location.pathname === sub.href
                          return (
                            <Link
                              key={sub.href}
                              to={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                isSubActive
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                            >
                              <SubIcon className="h-4 w-4" />
                              {sub.label}
                            </Link>
                          )
                        })}
                      </div>
                    </details>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                      }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}

            {/* 🔒 Botón Cerrar sesión (mobile) */}
            <button
              type="button"
              onClick={logout}
              className="mt-2 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  </nav>
)
}