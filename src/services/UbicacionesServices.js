import axios from "axios"

const API = "http://localhost:8080/api/ubicaciones"

export const obtenerUbicaciones = async () => {
  const response = await axios.get(API)
  return response.data
}

export const crearUbicacion = async (ubicacion) => {
  const response = await axios.post(API, ubicacion)
  return response.data
}

export const editarUbicacion = async (id, ubicacion) => {
  const response = await axios.put(`${API}/${id}`, ubicacion)
  return response.data
}

export const eliminarUbicacion = async (id, estadoId = 3) => {
  const response = await axios.put(`${API}/${id}/estado/${estadoId}`)
  return response.data
}