import axios from "axios";

const API_URL = "http://localhost:8080/api/visitas";

export const obtenerVisitas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearVisita = async (visita) => {
  const response = await axios.post(API_URL, visita);
  return response.data;
};

export const editarVisita = async (id, visita) => {
  const response = await axios.put(`${API_URL}/${id}`, visita);
  return response.data;
};

export const eliminarVisita = async (id, estadoId = 3) => {
  const response = await axios.put(`${API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};