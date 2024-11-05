import { TbRuler } from "react-icons/tb";
import { api, requestConfig } from "../utils/config";

// Publish an user's photo
const publishPhoto = async (data, token) => {
  const config = requestConfig("POST", data, token, true);

  try {
    const res = await fetch(api + "/photos", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getUserPhotos = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/photos/user/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};


// Delete a photo
const deletePhoto = async (id, token) => {
  const config = requestConfig("DELETE", "", token);

  try {
    const res = await fetch(api + "/photos/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Update a photo
const updatePhoto = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + "/photos/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getPhotos = async (token) => {
  const config = requestConfig("GET", null, token);
  console.log("getPhotos vagas ")


  try {
    const response = await fetch(api + "/photos/", config);
    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    throw error;
  }
};

// pesquisar
const SearchPhoto = async (query, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/photos/search?q=" + query, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};


// Aplicar pra vaga
export const applyToJob = async (id, token) => {
  const config = requestConfig("POST", null, token); 

  try {
    const res = await fetch(api + "/photos/" + id + "/apply", config);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Erro ao aplicar para a vaga", error);
    throw error;
  }
};

// Cancelar inscrição
export const cancelApplication = async (id, token) => {
  const config = requestConfig("DELETE", "", token);

  try {
    const res = await fetch(api + "/photos/" + id + "/cancel", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log("Erro ao cancelar a inscrição", error);
    throw error;
  }
};

// influenciadores que aplicaram pra vaga
const getApplicants = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/photos/" + id + "/applicants", config);
    const data = await res.json();

    console.log("Data returned from API (getApplicants):", data); // LOG DA RESPOSTA

    if (!res.ok) {
      throw new Error(data.message || "Erro ao buscar aplicantes");
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar aplicantes:", error);
    throw error;
  }
};


const selectInfluencer = async (photoId, influencerId, token) => {
  const config = requestConfig("POST", null, token);
  
  const res = await fetch(
    api + `/photos/${photoId}/select/${influencerId}`,
    config
  );

  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(data.errors?.[0] || "Erro ao selecionar influenciador.");
  }
};



const photoService = {
  publishPhoto,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
  getPhotos,
  SearchPhoto,
  applyToJob,
  cancelApplication,
  getApplicants,
  selectInfluencer
};

export default photoService;