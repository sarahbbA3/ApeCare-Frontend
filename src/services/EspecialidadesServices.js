import axios from "axios";

const API_URL = "http://localhost:8080/api/especialidades";

export const obtenerEspecialidades = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearEspecialidad = async (especialidad) => {
  const response = await axios.post(API_URL, especialidad);
  return response.data;
};

export const editarEspecialidad = async (id, especialidad) => {
  const response = await axios.put(`${API_URL}/${id}`, especialidad);
  return response.data;
};

export const eliminarEspecialidad = async (id, estadoId = 3) => {
  const response = await axios.put(`${API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};