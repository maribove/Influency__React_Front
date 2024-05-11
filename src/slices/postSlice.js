// postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import postService from "../services/postService";

const initialState = {
  posts: [],
  post: {},
  error: null,
  success: false,
  loading: false,
  message: null,
 
};
// publicar
export const publishPost = createAsyncThunk(
  "post/publish",
  async (post, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const data = await postService.publishPost(post, token);

      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao publicar.");
    }
  }
);
// get 
export const getUserPosts = createAsyncThunk(
  "post/userposts",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await postService.getUserPosts(id, token);

    

    return data;
  }
);

// deletar
export const deletePost = createAsyncThunk(
  "post/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await postService.deletePost(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const updatePost = createAsyncThunk(
  "post/update",
  async (postData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await postService.updatePost(
      {
        publicacao: postData.publicacao,
        
      },
      postData.id,
      token
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }

);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // state.posts.unshift(action.payload); // Adiciona o novo post no início do array
        state.publicacao = ""; // Limpa o campo de publicação
        state.message = "Post publicado com sucesso!";
        
      })
      
      .addCase(publishPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.posts = action.payload;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload.id
        );
        state.message = "Post deletado!";
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.post = {};
      })

      
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      
        // encontrar a foto no array e atualizar suas propriedades
        const updatedPostIndex = state.posts.findIndex(post => post._id === action.payload.post._id);
        if (updatedPostIndex !== -1) {
          state.posts[updatedPostIndex].publicacao = action.payload.post.publicacao;
         
        }
      
        state.message = action.payload.message;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.post = {};
      })


  },
});

export const { resetMessage } = postSlice.actions;
export default postSlice.reducer;