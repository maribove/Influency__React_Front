import { api, requestConfig } from "../utils/config";

// publicar
const publishPost = async (data, token) => {
  const config = requestConfig("POST", data, token, true);

  try {
    const res = await fetch(api + "/posts", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Get postagens do usuário
const getUserPosts = async (id, token) => {
  const config = requestConfig("GET", null, token);
  
  try {
      const res = await fetch(api + "/posts/user/" + id, config)
          .then((res) => res.json())
          .catch((err) => err);

      return res;
  } catch (error) {
      console.log(error);
  }
};

// Get postagem por ID
const getPost = async (id) => {
  const config = requestConfig("GET");

  try {
    const res = await fetch(api + "/posts/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Deletar postagem
const deletePost = async (id, token) => {
  const config = requestConfig("DELETE", "", token);

  try {
    const res = await fetch(api + "/posts/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Editar postagem
const updatePost = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + "/posts/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const postService = {
  publishPost,
  getUserPosts,
  getPost,
  deletePost,
  updatePost,
};

export default postService;
