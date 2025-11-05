import { useEffect, useMemo, useState } from "react"
import {
  obtenerVisitas,
  crearVisita,
  editarVisita,
  eliminarVisita,
} from "../../services/RegistroVisitasServices"
import { obtenerPacientes } from "../../services/PacientesServices"
import { obtenerMedicos } from "../../services/MedicosServices"
import { obtenerSintomas } from "../../services/SintomasServices"
import { obtenerMedicamentos } from "../../services/MedicamentosServices"
import Layout from "../../components/common/Layout"

const RegistroVisitas = () => {
  const [visitas, setVisitas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [sintomas, setSintomas] = useState([])
  const [medicamentos, setMedicamentos] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState({
    fechaVisita: "",
    horaVisita: "",
    recomendaciones: "",
    pacienteId: "",
    medicoId: "",
    sintomasIds: [],
    medicamentosIds: [],
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filterPaciente, setFilterPaciente] = useState("all")
  const [filterMedico, setFilterMedico] = useState("all")
  const [filterSintoma, setFilterSintoma] = useState("all")
  const [filterFecha, setFilterFecha] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const [v, p, m, s, meds] = await Promise.all([
      obtenerVisitas(),
      obtenerPacientes(),
      obtenerMedicos(),
      obtenerSintomas(),
      obtenerMedicamentos(),
    ])
    setVisitas(v || [])
    setPacientes(p || [])
    setMedicos(m || [])
    setSintomas(s || [])
    setMedicamentos(meds || [])
  }

  const abrirModal = (visita = null) => {
    setEditando(visita)
    setFormData(
      visita
        ? {
            fechaVisita: visita.fechaVisita || "",
            horaVisita: visita.horaVisita || "",
            recomendaciones: visita.recomendaciones || "",
            pacienteId: visita.pacienteId?.toString() || "",
            medicoId: visita.medicoId?.toString() || "",
            sintomasIds: visita.sintomasIds?.map(String) || [],
            medicamentosIds: visita.medicamentosIds?.map(String) || [],
          }
        : {
            fechaVisita: "",
            horaVisita: "",
            recomendaciones: "",
            pacienteId: "",
            medicoId: "",
            sintomasIds: [],
            medicamentosIds: [],
          }
    )
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEditando(null)
    setFormData({
      fechaVisita: "",
      horaVisita: "",
      recomendaciones: "",
      pacienteId: "",
      medicoId: "",
      sintomasIds: [],
      medicamentosIds: [],
    })
  }

  const guardarVisita = async (payload) => {
    const data = {
      ...payload,
      sintomasIds: payload.sintomasIds.map(Number),
      medicamentosIds: payload.medicamentosIds.map(Number),
    }
    try {
      if (editando) {
        await editarVisita(editando.id, data)
      } else {
        await crearVisita(data)
      }
      cerrarModal()
      cargarDatos()
    } catch (err) {
      console.error("Error al guardar visita:", err)
      alert("Hubo un error al guardar")
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta visita?")) return
    try {
      await eliminarVisita(id)
      cargarDatos()
    } catch (err) {
      console.error("Error al eliminar:", err)
      alert("Hubo un error al eliminar")
    }
  }

  const formatearFecha = (d) => d || "-"

  const obtenerNombrePaciente = (id) => {
    const paciente = pacientes.find((p) => p.id === parseInt(id))
    return paciente ? paciente.nombre : `Paciente ${id}`
  }

  const obtenerNombreMedico = (id) => {
    const medico = medicos.find((m) => m.id === parseInt(id))
    return medico ? medico.nombre : `Médico ${id}`
  }

  const obtenerNombresSintomas = (ids) => {
    return ids
      .map((id) => {
        const s = sintomas.find((sintoma) => sintoma.id === parseInt(id))
        return s ? s.nombre : `Síntoma ${id}`
      })
      .join(", ")
  }

  const obtenerNombresMedicamentos = (ids) => {
    return ids
      .map((id) => {
        const m = medicamentos.find((med) => med.id === parseInt(id))
        return m ? m.descripcion : `Medicamento ${id}`
      })
      .join(", ")
  }

  const visitasFiltradas = useMemo(() => {
    return visitas.filter((v) => {
      const matchesSearch =
        searchTerm === "" ||
        obtenerNombrePaciente(v.pacienteId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        obtenerNombreMedico(v.medicoId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        obtenerNombresSintomas(v.sintomasIds).toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.recomendaciones?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPaciente = filterPaciente === "all" || v.pacienteId.toString() === filterPaciente
      const matchesMedico = filterMedico === "all" || v.medicoId.toString() === filterMedico
      const matchesSintoma = filterSintoma === "all" || v.sintomasIds.map(String).includes(filterSintoma)
      const matchesFecha = filterFecha === "" || v.fechaVisita === filterFecha

      return matchesSearch && matchesPaciente && matchesMedico && matchesSintoma && matchesFecha
    })
  }, [visitas, searchTerm, filterPaciente, filterMedico, filterSintoma, filterFecha])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 text-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Registro de Visitas</h2>
          </div>

          {/* Filtros */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <input
                type="text"
                placeholder="Buscar por paciente, médico, síntomas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:max-w-md px-4 py-2 border border-slate-300 rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-100"
                >
                  Filtros
                </button>
                <button
                  onClick={() => abrirModal()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Nueva Visita
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
                  <select
                    value={filterPaciente}
                    onChange={(e) => setFilterPaciente(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="all">Todos</option>
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Médico</label>
                  <select
                    value={filterMedico}
                    onChange={(e) => setFilterMedico(e.target.value)}
                    className="w-full px-3 py-2
                    border border-slate-300 rounded-lg"
                  >
                    <option value="all">Todos</option>
                    {medicos.map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Síntoma</label>
                  <select
                    value={filterSintoma}
                    onChange={(e) => setFilterSintoma(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="all">Todos</option>
                    {sintomas.map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={filterFecha}
                    onChange={(e) => setFilterFecha(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tabla */}
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-slate-700">Fecha</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Hora</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Paciente</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Médico</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Síntomas</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Medicamentos</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Fecha de Registro</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Fecha de Actualización</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-slate-500">
                    No hay visitas registradas
                  </td>
                </tr>
              ) : (
                visitasFiltradas.map((v) => (
                  <tr key={v.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">{formatearFecha(v.fechaVisita)}</td>
                    <td className="px-4 py-3">{v.horaVisita}</td>
                    <td className="px-4 py-3">{obtenerNombrePaciente(v.pacienteId)}</td>
                    <td className="px-4 py-3">{obtenerNombreMedico(v.medicoId)}</td>
                    <td className="px-4 py-3">{obtenerNombresSintomas(v.sintomasIds)}</td>
                    <td className="px-4 py-3">{obtenerNombresMedicamentos(v.medicamentosIds)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatearFecha(v.fechaCreacion)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatearFecha(v.fechaActualizacion)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModal(v)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(v.id)}
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
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-xl p-6 overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-semibold mb-4">
                {editando ? "Editar Visita" : "Nueva Visita"}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  guardarVisita(formData)
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                    <input
                      type="date"
                      value={formData.fechaVisita}
                      onChange={(e) => setFormData({ ...formData, fechaVisita: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                    <input
                      type="time"
                      value={formData.horaVisita}
                      onChange={(e) => setFormData({ ...formData, horaVisita: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Recomendaciones</label>
                  <textarea
                    value={formData.recomendaciones}
                    onChange={(e) => setFormData({ ...formData, recomendaciones: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Recomendaciones médicas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
                  <select
                    value={formData.pacienteId}
                    onChange={(e) => setFormData({ ...formData, pacienteId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    required
                  >
                    <option value="">Selecciona paciente</option>
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Médico</label>
                  <select
                    value={formData.medicoId}
                    onChange={(e) => setFormData({ ...formData, medicoId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    required
                  >
                    <option value="">Selecciona médico</option>
                    {medicos.map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Síntomas</label>
                  <select
                    multiple
                    value={formData.sintomasIds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sintomasIds: Array.from(e.target.selectedOptions, (opt) => opt.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {sintomas.map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Medicamentos</label>
                  <select
                    multiple
                    value={formData.medicamentosIds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medicamentosIds: Array.from(e.target.selectedOptions, (opt) => opt.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {medicamentos.map((m) => (
                      <option key={m.id} value={m.id}>{m.descripcion}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="flex-1 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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

export default RegistroVisitas
