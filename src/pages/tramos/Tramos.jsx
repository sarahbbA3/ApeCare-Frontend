import { useEffect, useState } from "react"
import { obtenerTramos, crearTramo, editarTramo, eliminarTramo } from "../../services/TramosServices"
import { obtenerEstantes } from "../../services/EstantesServices"
import Layout from "../../components/common/Layout"

const Tramos = () => {
  const [listTramos, setListTramos] = useState([])
  const [listEstantes, setListEstantes] = useState([])
  const [formData, setFormData] = useState({ nombre: "", estanteId: "", estadoId: 1 })
  const [editandoTramo, setEditandoTramo] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    cargarTramos()
    cargarEstantes()
  }, [])

  const cargarTramos = async () => {
    const data = await obtenerTramos()
    setListTramos(data || [])
  }

  const cargarEstantes = async () => {
    const data = await obtenerEstantes()
    setListEstantes(data || [])
  }

  const abrirModal = (tramo = null) => {
    setEditandoTramo(tramo)
    setFormData({
      nombre: tramo?.nombre || "",
      estanteId: tramo?.estanteId?.toString() || "",
      estadoId: tramo?.estadoId || 1,
    })
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEditandoTramo(null)
    setFormData({ nombre: "", estanteId: "", estadoId: 1 })
  }

  const guardarTramo = async (e) => {
    e.preventDefault()
    try {
      editandoTramo
        ? await editarTramo(editandoTramo.id, formData)
        : await crearTramo(formData)
      cerrarModal()
      cargarTramos()
    } catch {
      alert("Error al guardar el tramo")
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este tramo?")) return
    try {
      await eliminarTramo(id, 3)
      cargarTramos()
    } catch {
      alert("Error al eliminar")
    }
  }

  const formatearFecha = (d) => d || "-"

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tramos</h2>
          <button onClick={() => abrirModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Agregar Tramo</button>
        </div>

        <table className="min-w-full table-auto">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Estante</th>
              <th className="px-4 py-3">Creación</th>
              <th className="px-4 py-3">Actualización</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listTramos.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-6">No hay tramos registrados</td></tr>
            ) : (
              listTramos.map((t) => {
                const estante = listEstantes.find(e => e.id === t.estanteId)
                return (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-3">{t.nombre}</td>
                    <td className="px-4 py-3">{estante?.nombre || "-"}</td>
                    <td className="px-4 py-3">{formatearFecha(t.fechaCreacion)}</td>
                    <td className="px-4 py-3">{formatearFecha(t.fechaActualizacion)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => abrirModal(t)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Editar</button>
                      <button onClick={() => eliminar(t.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">{editandoTramo ? "Editar Tramo" : "Agregar Tramo"}</h3>
              <form onSubmit={guardarTramo} className="space-y-4">
                <div>
                  <label className="block mb-1">Nombre</label>
                  <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Estante</label>
                  <select value={formData.estanteId} onChange={(e) => setFormData({ ...formData, estanteId: e.target.value })} required className="w-full border px-3 py-2 rounded">
                    <option value="">Seleccionar estante</option>
                    {listEstantes.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={cerrarModal} className="flex-1 bg-slate-500 text-white px-4 py-2 rounded">Cancelar</button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">{editandoTramo ? "Actualizar" : "Guardar"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Tramos