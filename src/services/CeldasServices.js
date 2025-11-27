import axios from "axios"

const API = "http://localhost:8080/api/celdas"

export const obtenerCeldas = async () => {
  const response = await axios.get(API)
  return response.data
}

export const crearCelda = async (celda) => {
  const response = await axios.post(API, celda)
  return response.data
}

export const editarCelda = async (id, celda) => {
  const response = await axios.put(`${API}/${id}`, celda)
  return response.data
}

export const eliminarCelda = async (id, estadoId = 3) => {
  const response = await axios.put(`${API}/${id}/estado/${estadoId}`)
  return response.data
}