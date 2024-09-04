import { api, requestConfig } from "../utils/config";

// Publish an user's photo
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


// Delete a photo
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

// Update a photo
const updatePost = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + "/posts/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log("Erro ao atualizar post:", error);
  }
};

export const getAllPosts = async (token) => {
  const config = requestConfig("GET", null, token);
            console.log("getAll Posts ")
  try {
    const response = await fetch(api + "/posts/", config);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Erro ao buscar publicações", error);
    throw error; // Lança o erro para o thunk manipular
  }
};

//pega post de acordo com interesses
export const getPostsByInterests = async (token) => {
  const config =  requestConfig("GET", null, token);

  console.log("getPostsByInterest ")

  try {
    const response = await fetch(api + "/posts/", config);

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Erro ao buscar publicações por interesses", error);
    throw error;
  }
};



// Like a post
const like = async (id, token) => {
  const config = requestConfig("PUT", null, token);

  try {
    const res = await fetch(api + "/posts/like/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// Add a comment to a post
const comment = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + "/posts/comment/" + id, config)
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
  deletePost,
  updatePost,
  getAllPosts,
  getPostsByInterests,
  like,
  comment,

};

export default postService;


