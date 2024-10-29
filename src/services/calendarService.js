import { api, requestConfig } from "../utils/config";

// Criar novo evento
const createEvent = async (data, token) => {
  // Defina o tipo de configuração como JSON, não FormData
  const config = requestConfig("POST", data, token); 

  console.log("Data enviada para o backend:", data);

  try {
    const res = await fetch(`${api}/events`, config);
    const jsonResponse = await res.json();
    if (!res.ok) throw new Error(`Erro ${res.status}: ${jsonResponse.message}`);
    return jsonResponse;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

// Buscar todos os eventos do usuário
const getUserEvents = async (token) => {
  const config = requestConfig("GET", null, token);
  try {
    const res = await fetch(`${api}/events`, config);
    const jsonResponse = await res.json();
    return jsonResponse;
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    throw error;
  }
};

// Buscar evento específico
const getEvents = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/events/" , config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Atualizar evento
const updateEvent = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + "/events/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Deletar evento
const deleteEvent = async (id, token) => {
  const config = requestConfig("DELETE", null, token);

  try {
    const res = await fetch(api + "/events/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const calendarService = {
  createEvent,
  getUserEvents,
  getEvents,
  updateEvent,
  deleteEvent,
};

export default calendarService;