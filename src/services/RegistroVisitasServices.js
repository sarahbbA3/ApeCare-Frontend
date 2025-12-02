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

export const descargarReporteVisita = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/reporte/pdf`, {
      responseType: "blob", // 👈 esto es clave
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reporte_visita_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error al descargar el reporte:", error);
    alert("No se pudo descargar el reporte");
  }
};

export const descargarReporteVisitasFiltradas = async ({ medicoId, pacienteId, fecha }) => {
  try {
    const params = new URLSearchParams();
    if (medicoId) params.append("medicoId", medicoId);
    if (pacienteId) params.append("pacienteId", pacienteId);
    if (fecha) params.append("fecha", fecha);

    const response = await axios.get(`${API_URL}/reporte/pdf?${params.toString()}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reporte_visitas_filtradas.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error al descargar reporte filtrado:", error);
    alert("No se pudo generar el reporte");
  }
};