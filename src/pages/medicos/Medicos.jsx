import { useEffect, useState } from "react";
import {
  obtenerMedicos,
  crearMedico,
  editarMedico,
  eliminarMedico,
} from "../../services/MedicosServices";
import { obtenerEspecialidades } from "../../services/EspecialidadesServices";
import { obtenerTandas } from "../../services/TandaLaboresServices";
import Layout from "../../components/common/Layout";

const Medicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [tandas, setTandas] = useState([]);

  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [especialidadId, setEspecialidadId] = useState("");
  const [tandaLaborId, setTandaLaborId] = useState("");
  const [editando, setEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [m, e, t] = await Promise.all([
      obtenerMedicos(),
      obtenerEspecialidades(),
      obtenerTandas(),
    ]);
    setMedicos(m || []);
    setEspecialidades(e || []);
    setTandas(t || []);
  };

  const abrirModal = (medico = null) => {
    setEditando(medico);
    setNombre(medico?.nombre || "");
    setCedula(medico?.cedula || "");
    setEspecialidadId(medico?.especialidadId || "");
    setTandaLaborId(medico?.tandaLaborId || "");
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditando(null);
    setNombre("");
    setCedula("");
    setEspecialidadId("");
    setTandaLaborId("");
  };

  const guardarMedico = async () => {
    const payload = { nombre, cedula, especialidadId, tandaLaborId };
    try {
      if (editando) {
        await editarMedico(editando.id, payload);
      } else {
        await crearMedico(payload);
      }
      cerrarModal();
      cargarDatos();
    } catch (err) {
      console.error("Error al guardar médico:", err);
      alert("Hubo un error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este médico?")) return;
    try {
      await eliminarMedico(id);
      cargarDatos();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white/90 text-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Médicos</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Médico
          </button>
        </div>

        <table className="min-w-full table-auto">
          <thead className="bg-slate-100">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Cédula</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Especialidad</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Tanda</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicos.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                  No hay médicos registrados
                </td>
              </tr>
            ) : (
              medicos.map((m) => (
                <tr key={m.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">{m.nombre}</td>
                  <td className="px-4 py-3">{m.cedula}</td>
                  <td className="px-4 py-3">{m.especialidadId}</td>
                  <td className="px-4 py-3">{m.tandaLaborId}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModal(m)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(m.id)}
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
                {editando ? "Editar Médico" : "Agregar Médico"}
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Nombre"
                />
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Cédula"
                />
                <select
                  value={especialidadId}
                  onChange={(e) => setEspecialidadId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Selecciona especialidad</option>
                  {especialidades.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
                <select
                  value={tandaLaborId}
                  onChange={(e) => setTandaLaborId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Selecciona tanda laboral</option>
                  {tandas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={cerrarModal}
                    className="flex-1 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarMedico}
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

export default Medicos;