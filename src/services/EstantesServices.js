import axios from "axios"

const API = "http://localhost:8080/api/estantes"

export const obtenerEstantes = async () => {
  const response = await axios.get(API)
  return response.data
}

export const crearEstante = async (estante) => {
  const response = await axios.post(API, estante)
  return response.data
}

export const editarEstante = async (id, estante) => {
  const response = await axios.put(`${API}/${id}`, estante)
  return response.data
}

export const eliminarEstante = async (id, estadoId = 3) => {
  const response = await axios.put(`${API}/${id}/estado/${estadoId}`)
  return response.data
}