// photoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
  photos: [],
  photo: {},
  error: null,
  success: false,
  loading: false,
  message: null,
};
// publicar
export const publishPhoto = createAsyncThunk(
  "photo/publish",
  async (photo, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const data = await photoService.publishPhoto(photo, token);

      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao publicar vaga.");
    }
  }
);

// get 
export const getUserPhotos = createAsyncThunk(
  "photo/userphotos",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.getUserPhotos(id, token);



    return data;
  }
);

// deletar
export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.deletePhoto(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photoData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await photoService.updatePhoto(
      {
        title: photoData.title,
        desc: photoData.desc,
        local: photoData.local,
        situacao: photoData.situacao,
        date: photoData.date,
      },
      photoData.id,
      token
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }

);

// pesquisar
export const SearchPhoto = createAsyncThunk("photo/search", async (query, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;

  const data = await photoService.SearchPhoto(query, token);



  return data;
})

// Get all photos
export const getPhotos = createAsyncThunk("photo/getall", async () => {
  const data = await photoService.getPhotos();

  return data;
});


export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
        state.photos.unshift(state.photo);
        state.message = "Vaga publicada com sucesso!";

      })
      .addCase(publishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })

      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = state.photos.filter(
          (photo) => photo._id !== action.payload.id
        );
        state.message = "Vaga deletada!";
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })


      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        // encontrar a foto no array e atualizar suas propriedades
        const updatedPhotoIndex = state.photos.findIndex(photo => photo._id === action.payload.photo._id);
        if (updatedPhotoIndex !== -1) {
          state.photos[updatedPhotoIndex].title = action.payload.photo.title;
          state.photos[updatedPhotoIndex].desc = action.payload.photo.desc;
          state.photos[updatedPhotoIndex].local = action.payload.photo.local;
          state.photos[updatedPhotoIndex].situacao = action.payload.photo.situacao;
          state.photos[updatedPhotoIndex].date = action.payload.photo.date;
        }

        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })

      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })

      .addCase(SearchPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SearchPhoto.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      });



  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;