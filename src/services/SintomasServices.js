import axios from "axios";

const REST_API_URL = "http://localhost:8080/api/sintomas";

export const obtenerSintomas = async () => {
    const response = await axios.get(REST_API_URL);
    return response.data;
};

export const crearSintomas = async (sintoma) => {
    const response = await axios.post(REST_API_URL, sintoma);
    return response.data;
};

export const editarSintomas = async (id, sintoma) => {
    const response = await axios.put(`${REST_API_URL}/${id}`, sintoma);
    return response.data;
};

export const eliminarSintomas = async (id, estadoId = 3) => {
    const response = await axios.put(`${REST_API_URL}/${id}/estado/${estadoId}`);
    return response.data;
}
