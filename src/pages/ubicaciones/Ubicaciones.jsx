import { useEffect, useState } from "react";
import {
  obtenerUbicaciones,
  crearUbicacion,
  editarUbicacion,
  eliminarUbicacion,
} from "../../services/UbicacionesServices";
import Layout from "../../components/common/Layout";

const Ubicaciones = () => {
  const [listUbicaciones, setListUbicaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoUbicacion, setEditandoUbicacion] = useState(null);

  const [estante, setEstante] = useState("");
  const [tramo, setTramo] = useState("");
  const [celda, setCelda] = useState("");

  useEffect(() => {
    cargarUbicaciones();
  }, []);

  const cargarUbicaciones = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerUbicaciones();
      setListUbicaciones(data || []);
    } catch (err) {
      console.error("Error: ", err);
      setError("Hubo un error cargando los datos");
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (d) => d || "-";

  const abrirModal = (ubicacion = null) => {
    setEditandoUbicacion(ubicacion);
    setEstante(ubicacion?.estante || "");
    setTramo(ubicacion?.tramo || "");
    setCelda(ubicacion?.celda || "");
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditandoUbicacion(null);
    setEstante("");
    setTramo("");
    setCelda("");
  };

  const guardarUbicacion = async () => {
    const payload = {
      estante,
      tramo,
      celda,
      estadoId: 1,
    };
    try {
      if (editandoUbicacion) {
        await editarUbicacion(editandoUbicacion.id, payload);
      } else {
        await crearUbicacion(payload);
      }
      cerrarModal();
      cargarUbicaciones();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Hubo un error al guardar la ubicación");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Estás segura que deseas eliminar esta ubicación?")) return;
    try {
      await eliminarUbicacion(id);
      cargarUbicaciones();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar la ubicación");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen overflow-auto bg-white/90 text-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Ubicaciones</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Ubicación
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
                  <th className="px-4 py-3 font-semibold text-slate-700">Estante</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Tramo</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Celda</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Fecha de Creación</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Fecha de Actualización</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listUbicaciones.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-500">
                      No se encontraron ubicaciones disponibles
                    </td>
                  </tr>
                ) : (
                  listUbicaciones.map((ubic) => (
                    <tr key={ubic.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{ubic.estante}</td>
                      <td className="px-4 py-3">{ubic.tramo}</td>
                      <td className="px-4 py-3">{ubic.celda}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatearFecha(ubic.fechaCreacion)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatearFecha(ubic.fechaActualizacion)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirModal(ubic)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminar(ubic.id)}
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editandoUbicacion ? "Editar Ubicación" : "Agregar Ubicación"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estante</label>
                  <input
                    type="text"
                    value={estante}
                    onChange={(e) => setEstante(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Estante"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tramo</label>
                  <input
                    type="text"
                    value={tramo}
                    onChange={(e) => setTramo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tramo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Celda</label>
                  <input
                    type="text"
                    value={celda}
                    onChange={(e) => setCelda(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Celda"
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
  onClick={guardarUbicacion}
  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
>
  {editandoUbicacion ? "Actualizar" : "Guardar"}
</button>
</div>
</div>
</div>
)}
</div>
</Layout>
);
};

export default Ubicaciones;
