import axios from "axios";

const REST_API_URL = "http://localhost:8080/api/marcas";

// Obtener todas las marcas activas
export const obtenerMarcas = async () => {
  const response = await axios.get(REST_API_URL);
  return response.data;
};

// Crear una nueva marca
export const crearMarca = async (marca) => {
  const response = await axios.post(REST_API_URL, marca);
  return response.data;
};

// Editar una marca existente
export const editarMarca = async (id, marca) => {
  const response = await axios.put(`${REST_API_URL}/${id}`, marca);
  return response.data;
};

// Eliminar (soft delete) una marca
export const eliminarMarca = async (id, estadoId = 3) => {
  const response = await axios.put(`${REST_API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};