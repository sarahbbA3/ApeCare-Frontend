import { useEffect, useState } from "react"
import {
  obtenerPacientes,
  crearPaciente,
  editarPaciente,
  eliminarPaciente,
} from "../../services/PacientesServices"
import { obtenerTipoPacientes } from "../../services/TipoPacientesServices"
import Layout from "../../components/common/Layout"

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([])
  const [tiposPaciente, setTiposPaciente] = useState([])
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    numeroCarnet: "",
    tipoPacienteId: "",
    edad: 0,
  })
  const [editandoPaciente, setEditandoPaciente] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarPacientes()
    cargarTiposPaciente()
  }, [])

  const cargarPacientes = async () => {
    setCargando(true)
    setError(null)
    try {
      const data = await obtenerPacientes()
      setPacientes(data || [])
    } catch (err) {
      console.error("Error al cargar pacientes:", err)
      setError("No se pudieron cargar los pacientes")
    } finally {
      setCargando(false)
    }
  }

  const cargarTiposPaciente = async () => {
    try {
      const data = await obtenerTipoPacientes()
      setTiposPaciente(data || [])
    } catch (err) {
      console.error("Error al cargar tipos de paciente:", err)
    }
  }

  const abrirModal = (paciente = null) => {
    setEditandoPaciente(paciente)
    setFormData({
      nombre: paciente?.nombre || "",
      cedula: paciente?.cedula || "",
      numeroCarnet: paciente?.numeroCarnet || "",
      tipoPacienteId: paciente?.tipoPacienteId?.toString() || "",
      edad: paciente?.edad || 0,
    })
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEditandoPaciente(null)
    setFormData({
      nombre: "",
      cedula: "",
      numeroCarnet: "",
      tipoPacienteId: "",
      edad: 0,
    })
  }

  const tipoSeleccionado = tiposPaciente.find(
    (t) => t.id === parseInt(formData.tipoPacienteId)
  )

  const guardarPaciente = async (e) => {
    e.preventDefault()
    if (formData.edad < 0) {
      alert("La edad no puede ser negativa")
      return
    }

    const payload = {
      nombre: formData.nombre,
      cedula: formData.cedula,
      numeroCarnet:
        tipoSeleccionado?.nombre?.toLowerCase() === "estudiante"
          ? formData.numeroCarnet
          : null,
      tipoPacienteId: formData.tipoPacienteId,
      edad: formData.edad,
    }

    try {
      if (editandoPaciente) {
        await editarPaciente(editandoPaciente.id, payload)
      } else {
        await crearPaciente(payload)
      }
      cerrarModal()
      cargarPacientes()
    } catch (err) {
      console.error("Error al guardar paciente:", err)
      alert("Hubo un error al guardar")
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este paciente?")) return
    try {
      await eliminarPaciente(id)
      cargarPacientes()
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
          <h2 className="text-2xl font-bold text-slate-800">Pacientes</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Paciente
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
                <th className="px-4 py-3 font-semibold text-slate-700">Cédula</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Carnet</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Edad</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Fecha de Registro</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Fecha de Actualizacion</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                    No hay pacientes registrados
                  </td>
                </tr>
              ) : (
                pacientes.map((p) => (
                  <tr key={p.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">{p.nombre}</td>
                    <td className="px-4 py-3">{p.cedula}</td>
                    <td className="px-4 py-3">{p.numeroCarnet || "-"}</td>
                    <td className="px-4 py-3">{p.edad}</td>
                    <td className="px-4 py-3 text-slate-600">{formatearFecha(p.fechaRegistro)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatearFecha(p.fechaActualizacion)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModal(p)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(p.id)}
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
                {editandoPaciente ? "Editar Paciente" : "Nuevo Paciente"}
              </h2>
              <p className="text-slate-600 mb-6">
                {editandoPaciente
                  ? "Modifica la información del paciente"
                  : "Agrega un nuevo paciente al sistema"}
              </p>

              <form onSubmit={guardarPaciente} className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">Cédula</label>
    <input
      type="text"
      value={formData.cedula}
      onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">Edad</label>
    <input
      type="number"
      min={0}
      value={formData.edad}
      onChange={(e) =>
        setFormData({ ...formData, edad: Math.max(0, Number(e.target.value)) })
      }
      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
      required
    />
  </div>
</div>

<div>
  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Paciente</label>
  <select
    value={formData.tipoPacienteId}
    onChange={(e) => setFormData({ ...formData, tipoPacienteId: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
    required
  >
    <option value="">Seleccionar tipo</option>
    {tiposPaciente.map((tipo) => (
      <option key={tipo.id} value={tipo.id}>
        {tipo.nombre}
      </option>
    ))}
  </select>
</div>

{tipoSeleccionado?.nombre?.toLowerCase() === "estudiante" && (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">Número de Carnet</label>
    <input
      type="text"
      value={formData.numeroCarnet}
      onChange={(e) => setFormData({ ...formData, numeroCarnet: e.target.value })}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
      required
    />
  </div>
)}

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
    {editandoPaciente ? "Actualizar" : "Guardar"}
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

export default Pacientes