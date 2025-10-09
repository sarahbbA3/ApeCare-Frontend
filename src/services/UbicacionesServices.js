import axios from "axios";

const REST_API_URL = "http://localhost:8080/api/ubicaciones";

// Obtener ubicaciones activas
export const obtenerUbicaciones = async () => {
  const response = await axios.get(REST_API_URL);
  return response.data;
};

// Crear nueva ubicación
export const crearUbicacion = async (ubicacion) => {
  const response = await axios.post(REST_API_URL, ubicacion);
  return response.data;
};

// Editar ubicación existente
export const editarUbicacion = async (id, ubicacion) => {
  const response = await axios.put(`${REST_API_URL}/${id}`, ubicacion);
  return response.data;
};

// Eliminar (soft delete) ubicación
export const eliminarUbicacion = async (id, estadoId = 3) => {
  const response = await axios.put(`${REST_API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};

