import { api, requestConfig } from "../utils/config";

// Criar novo evento
const createEvent = async (data, token) => {
  const config = requestConfig("POST", data, token);
  console.log("Creating event with data:", data);
  console.log("Request config:", config);

  try {
    const res = await fetch(api + "/events", config);
    
    // Log da resposta
    console.log("Response status:", res.status);
    const jsonRes = await res.json();
    console.log("Response data:", jsonRes);

    if (!res.ok) {
      throw new Error(jsonRes.message || "Erro ao criar evento");
    }

    return jsonRes;
  } catch (error) {
    console.error("Error in createEvent:", error);
    throw error;
  }
};

// Buscar todos os eventos do usuário
const getUserEvents = async (token) => {
  const config = requestConfig("GET", null, token);
  console.log("Fetching events with config:", config);

  try {
    const res = await fetch(api + "/events", config);
    console.log("Response status:", res.status);
    const jsonRes = await res.json();
    console.log("Fetched events:", jsonRes);

    if (!res.ok) {
      throw new Error(jsonRes.message || "Erro ao buscar eventos");
    }

    return jsonRes;
  } catch (error) {
    console.error("Error in getUserEvents:", error);
    throw error;
  }
};

// Atualizar evento
const updateEvent = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);
  console.log("Updating event with data:", data);
  console.log("Request config:", config);

  try {
    const res = await fetch(api + "/events/" + id, config);
    console.log("Response status:", res.status);
    const jsonRes = await res.json();
    console.log("Update response:", jsonRes);

    if (!res.ok) {
      throw new Error(jsonRes.message || "Erro ao atualizar evento");
    }

    return jsonRes;
  } catch (error) {
    console.error("Error in updateEvent:", error);
    throw error;
  }
};

// Deletar evento
const deleteEvent = async (id, token) => {
  const config = requestConfig("DELETE", null, token);
  console.log("Deleting event:", id);
  console.log("Request config:", config);

  try {
    const res = await fetch(api + "/events/" + id, config);
    console.log("Response status:", res.status);
    const jsonRes = await res.json();
    console.log("Delete response:", jsonRes);

    if (!res.ok) {
      throw new Error(jsonRes.message || "Erro ao deletar evento");
    }

    return jsonRes;
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    throw error;
  }
};

const calendarService = {
  createEvent,
  getUserEvents,
  updateEvent,
  deleteEvent,
};

export default calendarService;