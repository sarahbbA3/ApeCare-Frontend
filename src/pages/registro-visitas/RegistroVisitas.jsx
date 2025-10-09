import { useEffect, useState } from "react";
import {
  obtenerVisitas,
  crearVisita,
  editarVisita,
  eliminarVisita,
} from "../../services/RegistroVisitasServices";
import { obtenerPacientes } from "../../services/PacientesServices";
import { obtenerMedicos } from "../../services/MedicosServices";
import { obtenerSintomas } from "../../services/SintomasServices";
import { obtenerMedicamentos } from "../../services/MedicamentosServices";
import Layout from "../../components/common/Layout";

const RegistroVisitas = () => {
  const [visitas, setVisitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [sintomas, setSintomas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);

  const [fechaVisita, setFechaVisita] = useState("");
  const [horaVisita, setHoraVisita] = useState("");
  const [recomendaciones, setRecomendaciones] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [sintomasIds, setSintomasIds] = useState([]);
  const [medicamentosIds, setMedicamentosIds] = useState([]);
  const [editando, setEditando] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [v, p, m, s, meds] = await Promise.all([
      obtenerVisitas(),
      obtenerPacientes(),
      obtenerMedicos(),
      obtenerSintomas(),
      obtenerMedicamentos(),
    ]);
    setVisitas(v || []);
    setPacientes(p || []);
    setMedicos(m || []);
    setSintomas(s || []);
    setMedicamentos(meds || []);
  };

  const abrirModal = (visita = null) => {
    setEditando(visita);
    setFechaVisita(visita?.fechaVisita || "");
    setHoraVisita(visita?.horaVisita || "");
    setRecomendaciones(visita?.recomendaciones || "");
    setPacienteId(visita?.pacienteId || "");
    setMedicoId(visita?.medicoId || "");
    setSintomasIds(visita?.sintomasIds || []);
    setMedicamentosIds(visita?.medicamentosIds || []);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditando(null);
    setFechaVisita("");
    setHoraVisita("");
    setRecomendaciones("");
    setPacienteId("");
    setMedicoId("");
    setSintomasIds([]);
    setMedicamentosIds([]);
  };

  const guardarVisita = async () => {
    const payload = {
      fechaVisita,
      horaVisita,
      recomendaciones,
      pacienteId,
      medicoId,
      sintomasIds,
      medicamentosIds,
    };
    try {
      if (editando) {
        await editarVisita(editando.id, payload);
      } else {
        await crearVisita(payload);
      }
      cerrarModal();
      cargarDatos();
    } catch (err) {
      console.error("Error al guardar visita:", err);
      alert("Hubo un error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta visita?")) return;
    try {
      await eliminarVisita(id);
      cargarDatos();
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

  const obtenerNombrePaciente = (id) => {
    const paciente = pacientes.find((p) => p.id === parseInt(id));
    return paciente ? paciente.nombre : `Paciente ${id}`;
  };

  const obtenerNombreMedico = (id) => {
    const medico = medicos.find((m) => m.id === parseInt(id));
    return medico ? medico.nombre : `Médico ${id}`;
  };

  const obtenerNombresSintomas = (ids) => {
    return ids
      .map(id => {
        const s = sintomas.find(sintoma => sintoma.id === parseInt(id));
        return s ? s.nombre : `Síntoma ${id}`;
      })
      .join(", ");
  };

  const obtenerNombresMedicamentos = (ids) => {
    return ids
      .map(id => {
        const m = medicamentos.find(med => med.id === parseInt(id));
        return m ? m.descripcion : `Medicamento ${id}`;
      })
      .join(", ");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white/90 text-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Registro de Visitas</h2>
          <button
            onClick={() => abrirModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Agregar Visita
          </button>
        </div>

        <table className="min-w-full table-auto">
          <thead className="bg-slate-100">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold text-slate-700">Fecha</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Hora</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Paciente</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Médico</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Síntomas</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Medicamentos</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visitas.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                  No hay visitas registradas
                </td>
              </tr>
            ) : (
              visitas.map((v) => (
                <tr key={v.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">{formatearFecha(v.fechaVisita)}</td>
                  <td className="px-4 py-3">{v.horaVisita}</td>
                  <td className="px-4 py-3">{obtenerNombrePaciente(v.pacienteId)}</td>
                  <td className="px-4 py-3">{obtenerNombreMedico(v.medicoId)}</td>
                  <td className="px-4 py-3">{obtenerNombresSintomas(v.sintomasIds)}</td>
                  <td className="px-4 py-3">{obtenerNombresMedicamentos(v.medicamentosIds)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModal(v)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(v.id)}
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
                {editando ? "Editar Visita" : "Agregar Visita"}
              </h3>

              <div className="space-y-4">
                <input
                  type="date"
                  value={fechaVisita}
                  onChange={(e) => setFechaVisita(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />

                <input
                  type="time"
                  value={horaVisita}
                  onChange={(e) => setHoraVisita(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />

                <textarea
                  value={recomendaciones}
                  onChange={(e) => setRecomendaciones(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Recomendaciones"
                />

                <select
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Selecciona paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                <select
                  value={medicoId}
                  onChange={(e) => setMedicoId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Selecciona médico</option>
                  {medicos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>

                <label className="block font-medium text-slate-700">Síntomas</label>
                <select
                  multiple
                  value={sintomasIds}
                  onChange={(e) =>
                    setSintomasIds(Array.from(e.target.selectedOptions, opt => opt.value))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {sintomas.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>

                <label className="block font-medium text-slate-700">Medicamentos</label>
                <select
                  multiple
                  value={medicamentosIds}
                  onChange={(e) =>
                    setMedicamentosIds(Array.from(e.target.selectedOptions, opt => opt.value))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {medicamentos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.descripcion}
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
                    onClick={guardarVisita}
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

export default RegistroVisitas;