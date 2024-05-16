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

// Get user photos
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

// Get photo
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
    console.log(error);
  }
};

// Like a photo
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

// Add a comment to a photo
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

// Get all photos
const getPosts = async () => {
  const config = requestConfig("GET");

  try {
    const res = await fetch(api + "/posts", config)
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
  like,
  comment,
  getPosts,
};

export default postService;