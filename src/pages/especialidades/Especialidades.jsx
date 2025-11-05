import { useEffect, useState } from "react";
import {
  obtenerEspecialidades,
  crearEspecialidad,
  editarEspecialidad,
  eliminarEspecialidad,
} from "../../services/EspecialidadesServices";
import Layout from "../../components/common/Layout";

const Especialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = async () => {
    const data = await obtenerEspecialidades();
    setEspecialidades(data || []);
  };

  const abrirModal = (esp = null) => {
    setEditando(esp);
    setNombre(esp?.nombre || "");
    setDescripcion(esp?.descripcion || "");
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditando(null);
    setNombre("");
    setDescripcion("");
  };

  const guardarEspecialidad = async () => {
    const payload = { nombre, descripcion };
    try {
      if (editando) {
        await editarEspecialidad(editando.id, payload);
      } else {
        await crearEspecialidad(payload);
      }
      cerrarModal();
      cargarEspecialidades();
    } catch (err) {
      console.error("Error al guardar especialidad:", err);
      alert("Hubo un error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta especialidad?")) return;
    try {
      await eliminarEspecialidad(id);
      cargarEspecialidades();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar");
    }
  };

  const formatearFecha = (d) => d || "-";

  return (
    <Layout>
      <div className="min-h-screen bg-white/90 text-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Especialidades</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Especialidad
          </button>
        </div>

        <table className="min-w-full table-auto">
          <thead className="bg-slate-100">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Descripción</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Creado</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Actualizado</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {especialidades.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                  No hay especialidades registradas
                </td>
              </tr>
            ) : (
              especialidades.map((e) => (
                <tr key={e.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">{e.nombre}</td>
                  <td className="px-4 py-3">{e.descripcion}</td>
                  <td className="px-4 py-3">{formatearFecha(e.fechaCreacion)}</td>
                  <td className="px-4 py-3">{formatearFecha(e.fechaActualizacion)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModal(e)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(e.id)}
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editando ? "Editar Especialidad" : "Agregar Especialidad"}
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Nombre"
                />
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Descripción"
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={cerrarModal}
                    className="flex-1 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarEspecialidad}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editando ? "Actualizar" : "Guardar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Especialidades;