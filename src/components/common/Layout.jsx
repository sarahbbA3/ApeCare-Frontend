import React, { Suspense } from "react"
import { Navigation } from "./Navegation"

export default function Layout({ children }) {
  return (
    <div className="font-sans antialiased bg-gray-50 min-h-screen flex flex-col">
      <Suspense fallback={<div className="p-8 text-gray-500">Cargando...</div>}>
        <Navigation />
        <main className="flex-grow p-6">{children}</main>
      </Suspense>
      <footer className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} ApeCare. Todos los derechos reservados.
      </footer>
    </div>
  )
}
