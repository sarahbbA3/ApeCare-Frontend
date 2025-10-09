import { useEffect, useState } from "react";
import {
  obtenerMedicamentos,
  crearMedicamento,
  editarMedicamento,
  eliminarMedicamento,
} from "../../services/MedicamentosServices";
import { obtenerUbicaciones } from "../../services/UbicacionesServices";
import { obtenerTiposFarmaco } from "../../services/TipoFarmacosServices";
import { obtenerMarcas } from "../../services/MarcasServices";
import Layout from "../../components/common/Layout";

const Medicamentos = () => {
  const [listMedicamentos, setListMedicamentos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editandoMedicamento, setEditandoMedicamento] = useState(null);

  const [descripcion, setDescripcion] = useState("");
  const [dosis, setDosis] = useState("");
  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [tipoFarmacoId, setTipoFarmacoId] = useState("");
  const [ubicacionId, setUbicacionId] = useState("");
  const [marcaId, setMarcaId] = useState("");

  const [tiposFarmaco, setTiposFarmaco] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    cargarMedicamentos();
    cargarListas();
  }, []);

  const cargarMedicamentos = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerMedicamentos();
      setListMedicamentos(data || []);
    } catch (err) {
      console.error("Error: ", err);
      setError("Hubo un error cargando los datos");
    } finally {
      setCargando(false);
    }
  };

  const cargarListas = async () => {
    try {
      const [ubic, tipos, marcas] = await Promise.all([
        obtenerUbicaciones(),
        obtenerTiposFarmaco(),
        obtenerMarcas(),
      ]);
      setUbicaciones(ubic || []);
      setTiposFarmaco(tipos || []);
      setMarcas(marcas || []);
    } catch (err) {
      console.error("Error cargando listas:", err);
    }
  };

  const abrirModal = (med = null) => {
    setEditandoMedicamento(med);
    setDescripcion(med?.descripcion || "");
    setDosis(med?.dosis || "");
    setCantidadDisponible(med?.cantidadDisponible || 0);
    setFechaVencimiento(med?.fechaVencimiento || "");
    setTipoFarmacoId(med?.tipoFarmacoId || "");
    setUbicacionId(med?.ubicacionId || "");
    setMarcaId(med?.marcaId || "");
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditandoMedicamento(null);
    setDescripcion("");
    setDosis("");
    setCantidadDisponible(0);
    setFechaVencimiento("");
    setTipoFarmacoId("");
    setUbicacionId("");
    setMarcaId("");
  };

  const guardarMedicamento = async () => {
    const payload = {
      descripcion,
      dosis,
      cantidadDisponible,
      fechaVencimiento,
      tipoFarmacoId,
      ubicacionId,
      marcaId,
    };
    try {
      if (editandoMedicamento) {
        await editarMedicamento(editandoMedicamento.id, payload);
      } else {
        await crearMedicamento(payload);
      }
      cerrarModal();
      cargarMedicamentos();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Hubo un error al guardar el medicamento");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Estás segura que deseas eliminar este medicamento?")) return;
    try {
      await eliminarMedicamento(id);
      cargarMedicamentos();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar el medicamento");
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
      <div className="min-h-screen overflow-auto bg-white/90 text-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Medicamentos</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Medicamento
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
                  <th className="px-4 py-3 font-semibold text-slate-700">Descripción</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Dosis</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Cantidad</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Vencimiento</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listMedicamentos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                      No se encontraron medicamentos disponibles
                    </td>
                  </tr>
                ) : (
                  listMedicamentos.map((med) => (
                    <tr key={med.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3">{med.descripcion}</td>
                      <td className="px-4 py-3">{med.dosis}</td>
                      <td className="px-4 py-3">{med.cantidadDisponible}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatearFecha(med.fechaVencimiento)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirModal(med)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminar(med.id)}
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
                {editandoMedicamento ? "Editar Medicamento" : "Agregar Medicamento"}
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Descripción"
                />
                <input
                  type="text"
                  value={dosis}
                  onChange={(e) => setDosis(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Dosis"
                />
                <input
                  type="number"
                  value={cantidadDisponible}
                  onChange={(e) => setCantidadDisponible(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Cantidad disponible"
                />
                <input
                  type="date"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
                <select
                  value={tipoFarmacoId}
                  onChange={(e) => setTipoFarmacoId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Selecciona tipo de fármaco</option>
                  {tiposFarmaco.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                <select
                  value={ubicacionId}
                  onChange={(e) => setUbicacionId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Selecciona ubicación</option>
                  {ubicaciones.map((ubic) => (
                    <option key={ubic.id} value={ubic.id}>
                      Estante {ubic.estante} - Tramo {ubic.tramo} - Celda {ubic.celda}
                    </option>
                  ))}
                </select>
                <select
                  value={marcaId}
                  onChange={(e) => setMarcaId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Selecciona marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cerrarModal}
                  className="flex-1 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarMedicamento}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editandoMedicamento ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Medicamentos;