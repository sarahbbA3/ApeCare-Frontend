import { useEffect, useState } from "react"
import { obtenerCeldas, crearCelda, editarCelda, eliminarCelda } from "../../services/CeldasServices"
import { obtenerTramos } from "../../services/TramosServices"
import Layout from "../../components/common/Layout"

const Celdas = () => {
  const [listCeldas, setListCeldas] = useState([])
  const [listTramos, setListTramos] = useState([])
  const [formData, setFormData] = useState({ nombre: "", tramoId: "", estadoId: 1 })
  const [editandoCelda, setEditandoCelda] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    cargarCeldas()
    cargarTramos()
  }, [])

  const cargarCeldas = async () => {
    const data = await obtenerCeldas()
    setListCeldas(data || [])
  }

  const cargarTramos = async () => {
    const data = await obtenerTramos()
    setListTramos(data || [])
  }

  const abrirModal = (celda = null) => {
    setEditandoCelda(celda)
    setFormData({
      nombre: celda?.nombre || "",
      tramoId: celda?.tramoId?.toString() || "",
      estadoId: celda?.estadoId || 1,
    })
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEditandoCelda(null)
    setFormData({ nombre: "", tramoId: "", estadoId: 1 })
  }

  const guardarCelda = async (e) => {
    e.preventDefault()
    try {
      editandoCelda
        ? await editarCelda(editandoCelda.id, formData)
        : await crearCelda(formData)
      cerrarModal()
      cargarCeldas()
    } catch {
      alert("Error al guardar la celda")
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta celda?")) return
    try {
      await eliminarCelda(id, 3)
      cargarCeldas()
    } catch {
      alert("Error al eliminar")
    }
  }

  const formatearFecha = (d) => d || "-"

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Celdas</h2>
          <button onClick={() => abrirModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Agregar Celda</button>
        </div>

        <table className="min-w-full table-auto">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Tramo</th>
              <th className="px-4 py-3">Estante</th>
              <th className="px-4 py-3">Creación</th>
              <th className="px-4 py-3">Actualización</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listCeldas.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-6">No hay celdas registradas</td></tr>
            ) : (
              listCeldas.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3">{c.nombre}</td>
                  <td className="px-4 py-3">{c.tramoNombre}</td>
                  <td className="px-4 py-3">{c.estanteNombre}</td>
                  <td className="px-4 py-3">{formatearFecha(c.fechaCreacion)}</td>
                  <td className="px-4 py-3">{formatearFecha(c.fechaActualizacion)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => abrirModal(c)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Editar</button>
                    <button onClick={() => eliminar(c.id)} className="bg-red-500 text-white px-3 py-1 rounded">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">{editandoCelda ? "Editar Celda" : "Agregar Celda"}</h3>
              <form onSubmit={guardarCelda} className="space-y-4">
                <div>
                  <label className="block mb-1">Nombre</label>
                  <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Tramo</label>
                  <select value={formData.tramoId} onChange={(e) => setFormData({ ...formData, tramoId: e.target.value })} required className="w-full border px-3 py-2 rounded">
                    <option value="">Seleccionar tramo</option>
                    {listTramos.map((t) => (
                      <option key={t.id} value={t.id}>
                        {`${t.estanteNombre || "-"} → ${t.nombre}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={cerrarModal} className="flex-1 bg-slate-500 text-white px-4 py-2 rounded">Cancelar</button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">{editandoCelda ? "Actualizar" : "Guardar"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Celdas