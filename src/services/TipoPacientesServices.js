import axios from "axios";

const REST_API_URL = "http://localhost:8080/api/tipos-paciente";

// Obtener tipos de paciente activos
export const obtenerTipoPacientes = async () => {
  const response = await axios.get(REST_API_URL);
  return response.data;
};

// Crear nuevo tipo de paciente
export const crearTipoPaciente = async (tipo) => {
  const response = await axios.post(REST_API_URL, tipo);
  return response.data;
};

// Editar tipo de paciente existente
export const editarTipoPaciente = async (id, tipo) => {
  const response = await axios.put(`${REST_API_URL}/${id}`, tipo);
  return response.data;
};

// Eliminar (soft delete) tipo de paciente
export const eliminarTipoPaciente = async (id, estadoId = 3) => {
  const response = await axios.put(`${REST_API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};