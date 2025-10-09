"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Pill,
  Tag,
  MapPin,
  Home,
  Menu,
  X,
  HeartPulse,
  Activity,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/tipo-farmaco", label: "Tipo de Fármaco", icon: Pill },
  { href: "/marca", label: "Marca", icon: Tag },
  { href: "/ubicacion", label: "Ubicación", icon: MapPin },
  { href: "/sintoma", label: "Síntomas", icon: HeartPulse },
  {
    label: "Gestión Clínica",
    submenu: [
      { href: "/medicamento", label: "Medicamentos", icon: Pill },
      { href: "/tipo-paciente", label: "Tipo de Paciente", icon: Tag },
      { href: "/paciente", label: "Pacientes", icon: HeartPulse },
      { href: "/tanda-labor", label: "Tanda Labor", icon: Activity },
      { href: "/especialidad", label: "Especialidades", icon: Tag },
      { href: "/medico", label: "Médicos", icon: HeartPulse },
      { href: "/registro-visita", label: "Registro de Visitas", icon: Activity },
    ],
  },
]

export function Navigation() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">ApeCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => {
              if (item.submenu) {
                return (
                  <div className="relative group" key={item.label}>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/80">
                      {item.label}
                    </button>
                    <div className="absolute left-0 mt-2 hidden w-64 rounded-md border bg-white shadow-lg group-hover:block z-50">
                      {item.submenu.map((sub) => {
                        const Icon = sub.icon
                        const isActive = location.pathname === sub.href
                        return (
                          <Link
                            key={sub.href}
                            to={sub.href}
                            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {sub.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              }

              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
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
              {navItems.map((item) => {
                if (item.submenu) {
                  return (
                    <details key={item.label} className="px-3 py-2">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700">
                        {item.label}
                      </summary>
                      <div className="mt-2 flex flex-col gap-1">
                        {item.submenu.map((sub) => {
                          const Icon = sub.icon
                          const isActive = location.pathname === sub.href
                          return (
                            <Link
                              key={sub.href}
                              to={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                                isActive
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {sub.label}
                            </Link>
                          )
                        })}
                      </div>
                    </details>
                  )
                }

                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}