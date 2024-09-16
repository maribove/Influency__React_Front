import { api, requestConfig } from "../utils/config";

// Get user details
const profile = async (data, token) => {
  const config = requestConfig("GET", data, token); // token na configuração

  try {
    const res = await fetch(api + "/users/profile", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Update user details
const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token, true);

  try {
    const res = await fetch(api + "/users/", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// // Get user details
const getUserDetails = async (id, token) => {
  if (!id) {
    throw new Error("ID do usuário não fornecido");
  }

  const config = requestConfig("GET", null, token); // token na configuração

  try{
    const res = await fetch(api + "/users/"+ id , config);

    if (!res.ok) {
      throw new Error(`Erro HTTP! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Erro ao buscar detalhes do usuário:", error);
    throw error;
  }
};

// pesquisar
const SearchUser= async (query, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/users/search?q=" + query, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const userService = {
  profile,
  updateProfile,
  getUserDetails,
  SearchUser,
};

export default userService;