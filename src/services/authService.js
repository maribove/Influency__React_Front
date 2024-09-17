import { api, requestConfig } from "../utils/config";

// lógica de autenticação
// Register a user
const register = async (data) => {
const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/register", config)
      .then((res) => res.json())
      .catch((err) => err);

    if (res._id) {
      localStorage.setItem("user", JSON.stringify(res));
    }

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Logout do user
const logout = () => {
  localStorage.removeItem("user");
};

// Login do usuário
const login = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/login", config)
      .then((res) => res.json())
      .catch((err) => err);

  

    if (res._id) {
      localStorage.setItem("user", JSON.stringify(res));
    }

    return res;
  } catch (error) {
    console.log(error);
  }
};


// Solicitar redefinição de senha
const requestPasswordReset = async (email) => {
  const config = requestConfig("POST", { email });

  try {
    const response = await fetch(`${api}/users/forgot-password`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors);
    }

    return data;
  } catch (error) {
    throw error;
  }
};



const authService = {
  register,
  logout,
  login,
  requestPasswordReset,
};

export default authService;