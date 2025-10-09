import { useEffect, useState } from "react";
import {
  obtenerPacientes,
  crearPaciente,
  editarPaciente,
  eliminarPaciente,
} from "../../services/PacientesServices";
import { obtenerTipoPacientes } from "../../services/TipoPacientesServices";
import Layout from "../../components/common/Layout";

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [tiposPaciente, setTiposPaciente] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [numeroCarnet, setNumeroCarnet] = useState("");
  const [tipoPacienteId, setTipoPacienteId] = useState("");
  const [editandoPaciente, setEditandoPaciente] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarPacientes();
    cargarTiposPaciente();
  }, []);

  const cargarPacientes = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerPacientes();
      setPacientes(data || []);
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
      setError("No se pudieron cargar los pacientes");
    } finally {
      setCargando(false);
    }
  };

  const cargarTiposPaciente = async () => {
    try {
      const data = await obtenerTipoPacientes();
      setTiposPaciente(data || []);
    } catch (err) {
      console.error("Error al cargar tipos de paciente:", err);
    }
  };

  const abrirModal = (paciente = null) => {
    setEditandoPaciente(paciente);
    setNombre(paciente?.nombre || "");
    setCedula(paciente?.cedula || "");
    setNumeroCarnet(paciente?.numeroCarnet || "");
    setTipoPacienteId(paciente?.tipoPacienteId || "");
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditandoPaciente(null);
    setNombre("");
    setCedula("");
    setNumeroCarnet("");
    setTipoPacienteId("");
  };

  const tipoSeleccionado = () =>
    tiposPaciente.find((t) => t.id === parseInt(tipoPacienteId));

  const guardarPaciente = async () => {
    const payload = {
      nombre,
      cedula,
      numeroCarnet:
        tipoSeleccionado()?.nombre?.toLowerCase() === "estudiante"
          ? numeroCarnet
          : null,
      tipoPacienteId,
    };
    try {
      if (editandoPaciente) {
        await editarPaciente(editandoPaciente.id, payload);
      } else {
        await crearPaciente(payload);
      }
      cerrarModal();
      cargarPacientes();
    } catch (err) {
      console.error("Error al guardar paciente:", err);
      alert("Hubo un error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este paciente?")) return;
    try {
      await eliminarPaciente(id);
      cargarPacientes();
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
          <h2 className="text-2xl font-bold text-slate-800">Pacientes</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Paciente
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
                <th className="px-4 py-3 font-semibold text-slate-700">Cédula</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Carnet</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Fecha</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                    No hay pacientes registrados
                  </td>
                </tr>
              ) : (
                pacientes.map((p) => (
                  <tr key={p.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">{p.nombre}</td>
                    <td className="px-4 py-3">{p.cedula}</td>
                    <td className="px-4 py-3">{p.numeroCarnet || "-"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatearFecha(p.fechaRegistro)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModal(p)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(p.id)}
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
                {editandoPaciente ? "Editar Paciente" : "Agregar Paciente"}
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Nombre completo"
                />
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Cédula"
                />
                <select
                  value={tipoPacienteId}
                  onChange={(e) => setTipoPacienteId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Selecciona tipo de paciente</option>
                  {tiposPaciente.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
                {tipoSeleccionado()?.nombre?.toLowerCase() === "estudiante" && (
                  <input
                    type="text"
                    value={numeroCarnet}
                    onChange={(e) => setNumeroCarnet(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Número de carnet"
                  />
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={cerrarModal}
                  className="flex-1 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarPaciente}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editandoPaciente ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Pacientes;
