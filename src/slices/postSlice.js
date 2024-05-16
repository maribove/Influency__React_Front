import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../services/postService";

const initialState = {
  posts: [],
  post: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};


// Publish an user's photo
export const publishPost = createAsyncThunk(
  "post/publish",
  async (post, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await postService.publishPost(post, token);

    console.log(data.errors);
    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Get user photos
// get 
export const getUserPosts = createAsyncThunk(
  "post/userposts",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await postService.getUserPosts(id, token);

    

    return data;
  }
);





// Get photo
export const getPost = createAsyncThunk("post/getpost", async (id) => {
  const data = await postService.getPost(id);

  return data;
});

// Delete a photo
export const deletePost = createAsyncThunk(
  "post/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await postService.deletePost(id, token);

    console.log(data.errors);
    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Update a photo
export const updatePost = createAsyncThunk(
  "post/update",
  async (postData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await postService.updatePost(
      { publicacao: postData.publicacao },
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

// Like a photo
export const like = createAsyncThunk("post/like", async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;

  const data = await postService.like(id, token);

  // Check for errors
  if (data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0]);
  }

  return data;
});

// Add comment to a photo
export const comment = createAsyncThunk(
  "post/comment",
  async (postData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await postService.comment(
      { comment: postData.comment },
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

// Get all photos
export const getPosts = createAsyncThunk("post/getall", async () => {
  const data = await postService.getPosts();

  return data;
});



export const postSlice = createSlice({
  name: "posts",
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
        state.success = true;
        state.error = null;
        state.post = action.payload;
        state.message = "Post publicado com sucesso!";
      })
      .addCase(publishPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.post = null;
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
      .addCase(getPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.success = true;
        state.error = null;
        state.post = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.posts = state.posts.filter((post) => {
          return post._id !== action.payload.id;
        });

        state.message = action.payload.message;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.post = null;
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.posts.map((post) => {
          if (post._id === action.payload.post._id) {
            return (post.publicacao = action.payload.post.publicacao);
          }
          return post;
        });

        state.message = action.payload.message;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.post = null;
      })
      .addCase(like.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        if (state.post.likes) {
          state.post.likes.push(action.payload.userId);
        }

        state.posts.map((post) => {
          if (post._id === action.payload.postId) {
            return post.likes.push(action.payload.userId);
          }
          return post;
        });

        state.message = action.payload.message;
      })
      .addCase(like.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(comment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.post.comments.push(action.payload.comment);

        state.message = action.payload.message;
      })
      .addCase(comment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.success = true;
        state.error = null;
        state.posts = action.payload;
      })
     
  },
});

export const { resetMessage } = postSlice.actions;
export default postSlice.reducer;