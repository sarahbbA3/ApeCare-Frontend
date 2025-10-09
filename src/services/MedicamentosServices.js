import axios from "axios";

const REST_API_URL = "http://localhost:8080/api/medicamentos";

// Obtener medicamentos activos
export const obtenerMedicamentos = async () => {
  const response = await axios.get(REST_API_URL);
  return response.data;
};

// Crear nuevo medicamento
export const crearMedicamento = async (medicamento) => {
  const response = await axios.post(REST_API_URL, medicamento);
  return response.data;
};

// Editar medicamento existente
export const editarMedicamento = async (id, medicamento) => {
  const response = await axios.put(`${REST_API_URL}/${id}`, medicamento);
  return response.data;
};

// Eliminar (soft delete) medicamento
export const eliminarMedicamento = async (id, estadoId = 3) => {
  const response = await axios.put(`${REST_API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};