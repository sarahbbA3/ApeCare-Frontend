import axios from "axios";

const REST_API_URL = "http://localhost:8080/api/roles";

// Obtener roles activos
export const obtenerRoles = async () => {
  const response = await axios.get(REST_API_URL);
  return response.data;
};

// Crear nuevo rol
export const crearRol = async (rol) => {
  const response = await axios.post(REST_API_URL, rol);
  return response.data;
};

// Editar rol existente
export const editarRol = async (id, rol) => {
  const response = await axios.put(`${REST_API_URL}/${id}`, rol);
  return response.data;
};

// Eliminar (soft delete) rol
export const eliminarRol = async (id, estadoId = 3) => {
  const response = await axios.put(`${REST_API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};