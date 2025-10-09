import axios from "axios";

const API_URL = "http://localhost:8080/api/tandas";

// Listar tandas activas
export const obtenerTandas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Crear nueva tanda
export const crearTanda = async (tanda) => {
  const response = await axios.post(API_URL, tanda);
  return response.data;
};

// Editar tanda existente
export const editarTanda = async (id, tanda) => {
  const response = await axios.put(`${API_URL}/${id}`, tanda);
  return response.data;
};

// Eliminar (soft delete) tanda
export const eliminarTanda = async (id, estadoId = 3) => {
  const response = await axios.put(`${API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};