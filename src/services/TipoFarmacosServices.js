import axios from "axios";

const REST_API_URL = "http://localhost:8080/api/tipos-farmaco";

export const obtenerTiposFarmaco = async () => {
  const response = await axios.get(REST_API_URL);
  return response.data;
};

export const crearTipoFarmaco = async (tipo) => {
  const response = await axios.post(REST_API_URL, tipo);
  return response.data;
};

export const editarTipoFarmaco = async (id, tipo) => {
  const response = await axios.put(`${REST_API_URL}/${id}`, tipo);
  return response.data;
};

export const eliminarTipoFarmaco = async (id, estadoId = 3) => {
  const response = await axios.put(`${REST_API_URL}/${id}/estado/${estadoId}`);
  return response.data;
};