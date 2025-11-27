import axios from "axios"

const API = "http://localhost:8080/api/tramos"

export const obtenerTramos = async () => {
  const response = await axios.get(API)
  return response.data
}

export const crearTramo = async (tramo) => {
  const response = await axios.post(API, tramo)
  return response.data
}

export const editarTramo = async (id, tramo) => {
  const response = await axios.put(`${API}/${id}`, tramo)
  return response.data
}

export const eliminarTramo = async (id, estadoId = 3) => {
  const response = await axios.put(`${API}/${id}/estado/${estadoId}`)
  return response.data
}