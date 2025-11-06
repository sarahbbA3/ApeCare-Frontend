import { useEffect, useState } from "react"
import {
  obtenerUsuarios,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
} from "../../services/UsuariosServices"
import { obtenerRoles } from "../../services/RolesServices"
import Layout from "../../components/common/Layout"
import { useAuth } from "../../context/AuthContext" 

const Usuarios = () => {
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

  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [formData, setFormData] = useState({
    correo: "",
    nombre: "",
    contrasena: "",
    rolId: "",
  })
  const [editandoUsuario, setEditandoUsuario] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarUsuarios()
    cargarRoles()
  }, [])

  const cargarUsuarios = async () => {
    setCargando(true)
    setError(null)
    try {
      const data = await obtenerUsuarios()
      setUsuarios(data || [])
    } catch (err) {
      console.error("Error al cargar usuarios:", err)
      setError("No se pudieron cargar los usuarios")
    } finally {
      setCargando(false)
    }
  }

  const cargarRoles = async () => {
    try {
      const data = await obtenerRoles()
      setRoles(data || [])
    } catch (err) {
      console.error("Error al cargar roles:", err)
    }
  }

  const abrirModal = (usuario = null) => {
    setEditandoUsuario(usuario)
    setFormData({
      correo: usuario?.correo || "",
      nombre: usuario?.nombre || "",
      contrasena: usuario?.contrasena || "",
      rolId: usuario?.rolId?.toString() || "",
    })
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEditandoUsuario(null)
    setFormData({
      correo: "",
      nombre: "",
      contrasena: "",
      rolId: "",
    })
  }

  const guardarUsuario = async (e) => {
    e.preventDefault()
    const payload = {
      correo: formData.correo,
      nombre: formData.nombre,
      contrasena: formData.contrasena,
      rolId: formData.rolId,
      estadoId: 1,
    }

    try {
      if (editandoUsuario) {
        await editarUsuario(editandoUsuario.id, payload)
      } else {
        await crearUsuario(payload)
      }
      cerrarModal()
      cargarUsuarios()
    } catch (err) {
      console.error("Error al guardar usuario:", err)
      alert("Hubo un error al guardar")
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return
    try {
      await eliminarUsuario(id)
      cargarUsuarios()
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
          <h2 className="text-2xl font-bold text-slate-800">Usuarios</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Usuario
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
                <th className="px-4 py-3 font-semibold text-slate-700">Correo</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Rol</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Creación</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Actualización</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">{u.correo}</td>
                    <td className="px-4 py-3">{u.nombre}</td>
                    <td className="px-4 py-3">{roles.find(r => r.id === u.rolId)?.nombre || "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatearFecha(u.fechaCreacion)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatearFecha(u.fechaActualizacion)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModal(u)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(u.id)}
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
                {editandoUsuario ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <p className="text-slate-600 mb-6">
                {editandoUsuario
                  ? "Modifica la información del usuario"
                  : "Agrega un nuevo usuario al sistema"}
              </p>

              <form onSubmit={guardarUsuario} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Correo</label>
                  <input
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>

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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={formData.contrasena}
                    onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
  required
/>
</div>

<div>
  <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
  <select
    value={formData.rolId}
    onChange={(e) => setFormData({ ...formData, rolId: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
    required
  >
    <option value="">Seleccionar rol</option>
    {roles.map((rol) => (
      <option key={rol.id} value={rol.id}>
        {rol.nombre}
      </option>
    ))}
  </select>
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
    {editandoUsuario ? "Actualizar" : "Guardar"}
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

export default Usuarios