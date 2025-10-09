import axios from "axios";

const REST_API_URL = "http://localhost:8080/api/pacientes";

// Obtener pacientes activos
export const obtenerPacientes = async () => {
  const response = await axios.get(REST_API_URL);
  return response.data;
};

// Crear nuevo paciente
export const crearPaciente = async (paciente) => {
  const response = await axios.post(REST_API_URL, paciente);
  return response.data;
};

// Editar paciente existente
export const editarPaciente = async (id, paciente) => {
  const response = await axios.put(`${REST_API_URL}/${id}`, paciente);
  return response.data;
};

// Eliminar (soft delete) paciente
export const eliminarPaciente = async (id, estadoId = 3) => {
  const response = await axios.put(`${REST_API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};