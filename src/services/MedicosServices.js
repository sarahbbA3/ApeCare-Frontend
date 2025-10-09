import axios from "axios";

const API_URL = "http://localhost:8080/api/medicos";

export const obtenerMedicos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearMedico = async (medico) => {
  const response = await axios.post(API_URL, medico);
  return response.data;
};

export const editarMedico = async (id, medico) => {
  const response = await axios.put(`${API_URL}/${id}`, medico);
  return response.data;
};

export const eliminarMedico = async (id, estadoId = 3) => {
  const response = await axios.put(`${API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};