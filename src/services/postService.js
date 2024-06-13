import { api, requestConfig } from "../utils/config";
import axios from 'axios';

// Publicar um post
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

// Obter posts de um usuário
const getUserPosts = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(api + "/posts/user/" + id, config);
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// Excluir um post
const deletePost = async (id, token) => {
  const config = requestConfig("DELETE", null, token);

  try {
    const res = await fetch(api + "/posts/" + id, config);
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// Atualizar um post
const updatePost = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + "/posts/" + id, config);
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const API_URL = 'http://localhost:5000/api/posts/';

// Obter todos os posts
const getPosts = async () => {
  // Obter o token do localStorage
  const token = localStorage.getItem('token'); // Certifique-se de que o token está armazenado no localStorage
  
  if (!token) {
    throw new Error('No token found'); // Trate a ausência do token
  }

  // Configuração dos cabeçalhos
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Curtir um post
const like = async (id, token) => {
  const config = requestConfig("PUT", null, token);

  try {
    const res = await fetch(api + "/posts/like/" + id, config);
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// Adicionar um comentário a um post
const comment = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + "/posts/comment/" + id, config);
    const json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const postService = {
  publishPost,
  getUserPosts,
  deletePost,
  updatePost,
  getPosts,
  like,
  comment,
};

export default postService;
