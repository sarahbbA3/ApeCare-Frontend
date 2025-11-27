import { useEffect, useState } from "react"
import {
  obtenerUbicaciones,
  crearUbicacion,
  editarUbicacion,
  eliminarUbicacion,
} from "../../services/UbicacionesServices"
import { obtenerCeldas } from "../../services/CeldasServices"
import { obtenerTiposFarmaco } from "../../services/TipoFarmacosServices"
import Layout from "../../components/common/Layout"

const Ubicaciones = () => {
  const [listUbicaciones, setListUbicaciones] = useState([])
  const [listCeldas, setListCeldas] = useState([])
  const [tiposFarmaco, setTiposFarmaco] = useState([])

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editandoUbicacion, setEditandoUbicacion] = useState(null)

  const [nombre, setNombre] = useState("")
  const [celdaId, setCeldaId] = useState("")
  const [tipoFarmacoId, setTipoFarmacoId] = useState("")

  useEffect(() => {
    cargarUbicaciones()
    cargarCeldas()
    cargarTiposFarmaco()
  }, [])

  const cargarUbicaciones = async () => {
    setCargando(true)
    try {
      const data = await obtenerUbicaciones()
      setListUbicaciones(data || [])
    } catch {
      setError("Error cargando ubicaciones")
    } finally {
      setCargando(false)
    }
  }

  const cargarCeldas = async () => {
    try {
      const data = await obtenerCeldas()
      setListCeldas(data || [])
    } catch {
      console.error("Error cargando celdas")
    }
  }

  const cargarTiposFarmaco = async () => {
    try {
      const data = await obtenerTiposFarmaco()
      setTiposFarmaco(data || [])
    } catch {
      console.error("Error cargando tipos de fármaco")
    }
  }

  const abrirModal = (ubic = null) => {
    setEditandoUbicacion(ubic)
    setNombre(ubic?.nombre || "")
    setCeldaId(ubic?.celdaId?.toString() || "")
    setTipoFarmacoId(ubic?.tipoFarmacoId?.toString() || "")
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEditandoUbicacion(null)
    setNombre("")
    setCeldaId("")
    setTipoFarmacoId("")
  }

  const guardarUbicacion = async () => {
    const payload = {
      nombre,
      celdaId: parseInt(celdaId),
      tipoFarmacoId: parseInt(tipoFarmacoId),
      estadoId: 1,
    }
    try {
      editandoUbicacion
        ? await editarUbicacion(editandoUbicacion.id, payload)
        : await crearUbicacion(payload)
      cerrarModal()
      cargarUbicaciones()
    } catch {
      alert("Error al guardar ubicación")
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta ubicación?")) return
    try {
      await eliminarUbicacion(id, 3)
      cargarUbicaciones()
    } catch {
      alert("Error al eliminar")
    }
  }

  const formatearFecha = (d) => d || "-"

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Ubicaciones</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Agregar Ubicación
          </button>
        </div>

        {cargando ? (
          <div className="py-8 text-center">Cargando...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded">{error}</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Tipo de Fármaco</th>
                <th className="px-4 py-3">Estante</th>
                <th className="px-4 py-3">Tramo</th>
                <th className="px-4 py-3">Celda</th>
                <th className="px-4 py-3">Creación</th>
                <th className="px-4 py-3">Actualización</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listUbicaciones.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6">
                    No hay ubicaciones registradas
                  </td>
                </tr>
              ) : (
                listUbicaciones.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-3">{u.nombre}</td>
                    <td className="px-4 py-3">{u.tipoFarmacoNombre}</td>
                    <td className="px-4 py-3">{u.estanteNombre}</td>
                    <td className="px-4 py-3">{u.tramoNombre}</td>
                    <td className="px-4 py-3">{u.celdaNombre}</td>
                    <td className="px-4 py-3">{formatearFecha(u.fechaCreacion)}</td>
                    <td className="px-4 py-3">{formatearFecha(u.fechaActualizacion)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => abrirModal(u)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(u.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editandoUbicacion ? "Editar Ubicación" : "Agregar Ubicación"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Nombre de la Ubicación</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">Tipo de Fármaco</label>
                  <select
                    value={tipoFarmacoId}
                    onChange={(e) => setTipoFarmacoId(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposFarmaco.map((t) => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Celda</label>
                  <select
                    value={celdaId}
                    onChange={(e) => setCeldaId(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Seleccionar celda</option>
                    {listCeldas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {`${c.estanteNombre || "-"} → ${c.tramoNombre || "-"} → ${c.nombre}`}
                      </option>
                    ))}

                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cerrarModal}
                  className="flex-1 bg-slate-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarUbicacion}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editandoUbicacion ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Ubicaciones
