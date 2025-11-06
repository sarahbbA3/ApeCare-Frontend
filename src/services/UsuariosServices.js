import axios from "axios";

const REST_API_URL = "http://localhost:8080/api/usuarios";

// Obtener usuarios activos
export const obtenerUsuarios = async () => {
  const response = await axios.get(REST_API_URL);
  return response.data;
};

// Crear nuevo usuario
export const crearUsuario = async (usuario) => {
  const response = await axios.post(REST_API_URL, usuario);
  return response.data;
};

// Editar usuario existente
export const editarUsuario = async (id, usuario) => {
  const response = await axios.put(`${REST_API_URL}/${id}`, usuario);
  return response.data;
};

// Eliminar (soft delete) usuario
export const eliminarUsuario = async (id, estadoId = 3) => {
  const response = await axios.put(`${REST_API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};