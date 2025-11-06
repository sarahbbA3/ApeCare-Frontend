import { useEffect, useState } from "react"
import {
  obtenerRoles,
  crearRol,
  editarRol,
  eliminarRol,
} from "../../services/RolesServices"
import Layout from "../../components/common/Layout"
import { useAuth } from "../../context/AuthContext" 

const Roles = () => {
  const { usuario } = useAuth()
  const esMedico = usuario?.rol === "MEDICO" // valido por rol

  if (esMedico) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-slate-600 text-lg">
          No tienes permisos para acceder a esta sección.
        </div>
      </Layout>
    )
  }

  const [roles, setRoles] = useState([])
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })
  const [editandoRol, setEditandoRol] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarRoles()
  }, [])

  const cargarRoles = async () => {
    setCargando(true)
    setError(null)
    try {
      const data = await obtenerRoles()
      setRoles(data || [])
    } catch (err) {
      console.error("Error al cargar roles:", err)
      setError("No se pudieron cargar los roles")
    } finally {
      setCargando(false)
    }
  }

  const abrirModal = (rol = null) => {
    setEditandoRol(rol)
    setFormData({
      nombre: rol?.nombre || "",
      descripcion: rol?.descripcion || "",
    })
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEditandoRol(null)
    setFormData({
      nombre: "",
      descripcion: "",
    })
  }

  const guardarRol = async (e) => {
    e.preventDefault()
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
    }

    try {
      if (editandoRol) {
        await editarRol(editandoRol.id, payload)
      } else {
        await crearRol(payload)
      }
      cerrarModal()
      cargarRoles()
    } catch (err) {
      console.error("Error al guardar rol:", err)
      alert("Hubo un error al guardar")
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este rol?")) return
    try {
      await eliminarRol(id)
      cargarRoles()
    } catch (err) {
      console.error("Error al eliminar:", err)
      alert("Hubo un error al eliminar")
    }
  }

  const formatearFecha = (d) => d || "-"

  return (
    <Layout>
      <div className="min-h-screen bg-white/90 text-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Roles</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Rol
          </button>
        </div>

        {cargando ? (
          <div className="py-6 text-center text-slate-500">Cargando...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Descripción</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Creación</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Actualización</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                    No hay roles registrados
                  </td>
                </tr>
              ) : (
                roles.map((r) => (
                  <tr key={r.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">{r.nombre}</td>
                    <td className="px-4 py-3">{r.descripcion}</td>
                    <td className="px-4 py-3 text-slate-600">{formatearFecha(r.fechaCreacion)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatearFecha(r.fechaActualizacion)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModal(r)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(r.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold mb-2">
                {editandoRol ? "Editar Rol" : "Nuevo Rol"}
              </h2>
              <p className="text-slate-600 mb-6">
                {editandoRol
                  ? "Modifica la información del rol"
                  : "Agrega un nuevo rol al sistema"}
              </p>

              <form onSubmit={guardarRol} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    {editandoRol ? "Actualizar" : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Roles