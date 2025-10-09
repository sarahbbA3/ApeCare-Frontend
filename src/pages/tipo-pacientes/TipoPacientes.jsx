import { useEffect, useState } from "react";
import {
  obtenerTipoPacientes,
  crearTipoPaciente,
  editarTipoPaciente,
  eliminarTipoPaciente,
} from "../../services/TipoPacientesServices";
import Layout from "../../components/common/Layout";

const TipoPacientes = () => {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoTipo, setEditandoTipo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerTipoPacientes();
      setTipos(data || []);
    } catch (err) {
      console.error("Error al cargar tipos de paciente:", err);
      setError("No se pudieron cargar los tipos de paciente");
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = (tipo = null) => {
    setEditandoTipo(tipo);
    setNombre(tipo?.nombre || "");
    setDescripcion(tipo?.descripcion || "");
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditandoTipo(null);
    setNombre("");
    setDescripcion("");
  };

  const guardarTipo = async () => {
    const payload = { nombre, descripcion };
    try {
      if (editandoTipo) {
        await editarTipoPaciente(editandoTipo.id, payload);
      } else {
        await crearTipoPaciente(payload);
      }
      cerrarModal();
      cargarTipos();
    } catch (err) {
      console.error("Error al guardar tipo de paciente:", err);
      alert("Hubo un error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este tipo de paciente?")) return;
    try {
      await eliminarTipoPaciente(id);
      cargarTipos();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar");
    }
  };

  const formatearFecha = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white/90 text-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Tipos de Paciente</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Tipo
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
                <th className="px-4 py-3 font-semibold text-slate-700">Fecha</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tipos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                    No hay tipos registrados
                  </td>
                </tr>
              ) : (
                tipos.map((tipo) => (
                  <tr key={tipo.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">{tipo.nombre}</td>
                    <td className="px-4 py-3">{tipo.descripcion}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatearFecha(tipo.fechaCreacion)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModal(tipo)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(tipo.id)}
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editandoTipo ? "Editar Tipo de Paciente" : "Agregar Tipo de Paciente"}
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
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cerrarModal}
                  className="flex-1 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarTipo}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editandoTipo ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TipoPacientes;