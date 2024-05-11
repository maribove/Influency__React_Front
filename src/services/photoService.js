import { api, requestConfig } from "../utils/config";

// publicar
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

// Get vaga usuario 
const getUserPhotos = async (id, token) => {
  const config = requestConfig("GET", null, token)
  
  try {
      const res = await fetch(api + "/photos/user/" + id, config)
          .then((res) => res.json())
          .catch((err) => err)

          return res
  } catch (error) {
      console.log(error)
  }

}

// Get 
const getPhoto = async (id) => {
  const config = requestConfig("GET");

  try {
    const res = await fetch(api + "/photos/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Deletar 
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

// EDITAR 
const updatePhoto = async(data,id, token) =>{
  const config = requestConfig("PUT", data, token)

  try {
    const res = await fetch (api + "/photos/" + id, config)
    .then((res) => res.json())
    .catch((err) => err)
    return res;
  } catch (error) {
    console.log(error)
    
  }
}



const photoService = {
  publishPhoto,
  getUserPhotos,
  getPhoto,
  deletePhoto,
  updatePhoto
  
};

export default photoService;