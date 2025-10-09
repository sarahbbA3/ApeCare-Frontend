import { useEffect, useState } from "react";
import {
  obtenerMarcas,
  crearMarca,
  editarMarca,
  eliminarMarca,
} from "../../services/MarcasServices";
import Layout from "../../components/common/Layout";

const Marcas = () => {
  const [listMarcas, setListMarcas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoMarca, setEditandoMarca] = useState(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    cargarMarcas();
  }, []);

  const cargarMarcas = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerMarcas();
      setListMarcas(data || []);
    } catch (err) {
      console.error("Error: ", err);
      setError("Hubo un error cargando los datos");
    } finally {
      setCargando(false);
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

  const abrirModal = (marca = null) => {
    setEditandoMarca(marca);
    setNombre(marca?.nombre || "");
    setDescripcion(marca?.descripcion || "");
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditandoMarca(null);
    setNombre("");
    setDescripcion("");
  };

  const guardarMarca = async () => {
    const payload = {
      nombre,
      descripcion,
      estadoId: 1,
    };
    try {
      if (editandoMarca) {
        await editarMarca(editandoMarca.id, payload);
      } else {
        await crearMarca(payload);
      }
      cerrarModal();
      cargarMarcas();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Hubo un error al guardar la marca");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Estás segura que deseas eliminar esta marca?")) return;
    try {
      await eliminarMarca(id);
      cargarMarcas();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar la marca");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen overflow-auto bg-white/90 text-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Marcas Farmacéuticas</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Marca
          </button>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-slate-100">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Descripción</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Fecha de Creación</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listMarcas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                      No se encontraron marcas disponibles
                    </td>
                  </tr>
                ) : (
                  listMarcas.map((marca) => (
                    <tr key={marca.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{marca.nombre}</td>
                      <td className="px-4 py-3 max-w-md">
                        <div className="line-clamp-2">{marca.descripcion}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatearFecha(marca.fechaCreacion)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirModal(marca)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminar(marca.id)}
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
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editandoMarca ? "Editar Marca" : "Agregar Marca"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de la marca"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción de la marca"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cerrarModal}
                  className="flex-1 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarMarca}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editandoMarca ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Marcas;