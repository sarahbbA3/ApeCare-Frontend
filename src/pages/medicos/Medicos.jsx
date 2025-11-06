import { useEffect, useState } from "react"
import {
  obtenerMedicos,
  crearMedico,
  editarMedico,
  eliminarMedico,
} from "../../services/MedicosServices"
import { obtenerEspecialidades } from "../../services/EspecialidadesServices"
import { obtenerTandas } from "../../services/TandaLaboresServices"
import { obtenerUsuarios } from "../../services/UsuariosServices"
import Layout from "../../components/common/Layout"

const Medicos = () => {
  const [medicos, setMedicos] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [tandas, setTandas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([])

  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    especialidadId: "",
    tandaLaborId: "",
    usuarioId: "",
  })

  const [editando, setEditando] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async (medicoEnEdicion = null) => {
  const [m, e, t, u] = await Promise.all([
    obtenerMedicos(),
    obtenerEspecialidades(),
    obtenerTandas(),
    obtenerUsuarios(),
  ])
  setMedicos(m || [])
  setEspecialidades(e || [])
  setTandas(t || [])
  setUsuarios(u || [])

  const usados = m.map((medico) => medico.usuarioId)
  let disponibles = u.filter((usuario) => !usados.includes(usuario.id))

  // ✅ incluir el usuario actual si estamos editando
  if (medicoEnEdicion?.usuarioId) {
    const usuarioActual = u.find((u) => u.id === medicoEnEdicion.usuarioId)
    if (usuarioActual && !disponibles.some((d) => d.id === usuarioActual.id)) {
      disponibles = [usuarioActual, ...disponibles]
    }
  }

  setUsuariosDisponibles(disponibles || [])
}

  const abrirModal = (medico = null) => {
  setEditando(medico)
  setFormData({
    nombre: medico?.nombre || "",
    cedula: medico?.cedula || "",
    especialidadId: medico?.especialidadId || "",
    tandaLaborId: medico?.tandaLaborId || "",
    usuarioId: medico?.usuarioId || "",
  })
  setIsModalOpen(true)
  cargarDatos(medico) // ✅ pasa el médico directamente
}

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEditando(null)
    setFormData({
      nombre: "",
      cedula: "",
      especialidadId: "",
      tandaLaborId: "",
      usuarioId: "",
    })
  }

  const guardarMedico = async () => {
    try {
      if (editando) {
        await editarMedico(editando.id, formData)
      } else {
        await crearMedico(formData)
      }
      cerrarModal()
      cargarDatos()
    } catch (err) {
      console.error("Error al guardar médico:", err)
      alert("Hubo un error al guardar")
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este médico?")) return
    try {
      await eliminarMedico(id)
      cargarDatos()
    } catch (err) {
      console.error("Error al eliminar:", err)
      alert("Hubo un error al eliminar")
    }
  }

  const formatearFecha = (d) => d || "-"

  const obtenerNombreEspecialidad = (id) =>
    especialidades.find((e) => e.id === id)?.nombre || "-"

  const obtenerNombreTanda = (id) =>
    tandas.find((t) => t.id === id)?.nombre || "-"

  return (
    <Layout>
      <div className="min-h-screen bg-white/90 text-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Médicos</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Médico
          </button>
        </div>

        <table className="min-w-full table-auto">
          <thead className="bg-slate-100">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Cédula</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Especialidad</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Tanda</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Fecha de Creación</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Fecha de Actualización</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicos.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                  No hay médicos registrados
                </td>
              </tr>
            ) : (
              medicos.map((m) => (
                <tr key={m.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">{m.nombre}</td>
                  <td className="px-4 py-3">{m.cedula}</td>
                  <td className="px-4 py-3">{obtenerNombreEspecialidad(m.especialidadId)}</td>
                  <td className="px-4 py-3">{obtenerNombreTanda(m.tandaLaborId)}</td>
                  <td className="px-4 py-3">{formatearFecha(m.fechaCreacion)}</td>
                  <td className="px-4 py-3">{formatearFecha(m.fechaActualizacion)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModal(m)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(m.id)}
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

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 relative">
              <button
                onClick={cerrarModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {editando ? "Editar Médico" : "Nuevo Médico"}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {editando
                  ? "Modifica la información del médico"
                  : "Agrega un nuevo médico al sistema"}
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  guardarMedico()
                }}
                className="grid gap-6"
              >
                <div className="grid gap-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                    Nombre Completo
                  </label>
                  <input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Dr. Roberto Fernández"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="especialidadId" className="text-sm font-medium text-gray-700">
                      Especialidad
                    </label>
                    <select
                      id="especialidadId"
                      value={formData.especialidadId}
                      onChange={(e) => setFormData({ ...formData, especialidadId: e.target.value })}
                      required
className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
>
  <option value="">Seleccionar especialidad</option>
  {especialidades.map((e) => (
    <option key={e.id} value={e.id}>
      {e.nombre}
    </option>
  ))}
</select>
</div>

<div className="grid gap-2">
  <label htmlFor="cedula" className="text-sm font-medium text-gray-700">
    Cédula
  </label>
  <input
    id="cedula"
    value={formData.cedula}
    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
    placeholder="001-1234567-8"
    required
    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
  />
</div>

<div className="grid gap-2">
  <label htmlFor="tandaLaborId" className="text-sm font-medium text-gray-700">
    Tanda Laboral
  </label>
  <select
    id="tandaLaborId"
    value={formData.tandaLaborId}
    onChange={(e) => setFormData({ ...formData, tandaLaborId: e.target.value })}
    required
    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
  >
    <option value="">Seleccionar tanda</option>
    {tandas.map((t) => (
      <option key={t.id} value={t.id}>
        {t.nombre}
      </option>
    ))}
  </select>
</div>

<div className="grid gap-2">
  <label htmlFor="usuarioId" className="text-sm font-medium text-gray-700">
    Usuario vinculado
  </label>
  <select
    id="usuarioId"
    value={formData.usuarioId}
    onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
    required
    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
  >
    <option value="">Seleccionar usuario</option>
    {usuariosDisponibles.map((u) => (
      <option key={u.id} value={u.id}>
        {u.nombre} ({u.correo})
      </option>
    ))}
  </select>
</div>

</div> {}

<div className="flex justify-end gap-3 pt-4">
  <button
    type="button"
    onClick={cerrarModal}
    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
  >
    Cancelar
  </button>
  <button
    type="submit"
    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
  >
    {editando ? "Actualizar" : "Guardar"}
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

export default Medicos