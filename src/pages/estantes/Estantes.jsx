import { useEffect, useState } from "react"
import { obtenerEstantes, crearEstante, editarEstante, eliminarEstante } from "../../services/EstantesServices"
import Layout from "../../components/common/Layout"

const Estantes = () => {
  const [listEstantes, setListEstantes] = useState([])
  const [formData, setFormData] = useState({ nombre: "", estadoId: 1 })
  const [editandoEstante, setEditandoEstante] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => { cargarEstantes() }, [])

  const cargarEstantes = async () => {
    const data = await obtenerEstantes()
    setListEstantes(data || [])
  }

  const abrirModal = (estante = null) => {
    setEditandoEstante(estante)
    setFormData({ nombre: estante?.nombre || "", estadoId: estante?.estadoId || 1 })
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEditandoEstante(null)
    setFormData({ nombre: "", estadoId: 1 })
  }

  const guardarEstante = async (e) => {
    e.preventDefault()
    editandoEstante
      ? await editarEstante(editandoEstante.id, formData)
      : await crearEstante(formData)
    cerrarModal()
    cargarEstantes()
  }

  const eliminar = async (id) => {
    if (window.confirm("¿Eliminar este estante?")) {
      await eliminarEstante(id, 3)
      cargarEstantes()
    }
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Estantes</h2>
          <button onClick={() => abrirModal()} className="bg-blue-600 text-white px-4 py-2 rounded">Agregar</button>
        </div>

        <table className="min-w-full table-auto">
          <thead><tr><th>Nombre</th><th>Creación</th><th>Actualización</th><th>Acciones</th></tr></thead>
          <tbody>
            {listEstantes.map((e) => (
              <tr key={e.id} className="border-t">
                <td>{e.nombre}</td>
                <td>{e.fechaCreacion}</td>
                <td>{e.fechaActualizacion}</td>
                <td>
                  <button onClick={() => abrirModal(e)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Editar</button>
                  <button onClick={() => eliminar(e.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">{editandoEstante ? "Editar Estante" : "Agregar Estante"}</h3>
              <form onSubmit={guardarEstante} className="space-y-4">
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required className="w-full border px-3 py-2 rounded" placeholder="Nombre del estante" />
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={cerrarModal} className="flex-1 bg-slate-500 text-white px-4 py-2 rounded">Cancelar</button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">{editandoEstante ? "Actualizar" : "Guardar"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Estantes