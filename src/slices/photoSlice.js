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
        contrato: photoData.contrato,
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
export const getPhotos = createAsyncThunk("photo/getall", async (_, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;

  try {
    return await photoService.getPhotos(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Aplicar pra vaga
export const applyToJob = createAsyncThunk(
  "photo/applyToJob",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await photoService.applyToJob(id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.errors[0]);
    }
  }
);

// Cancelar inscrição
export const cancelApplication = createAsyncThunk(
  "photo/cancelApplication",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await photoService.cancelApplication(id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.errors[0]);
    }
  }
);

// Get influenciadores que aplicaram
export const getApplicants = createAsyncThunk(
  "photo/getApplicants",
  async ({ id, token }, thunkAPI) => {
    try {
      const response = await photoService.getApplicants(id, token);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.errors[0]);
    }
  }
);

export const selectInfluencer = createAsyncThunk(
  "photo/select",
  async ({ photoId, influencerId, token }, thunkAPI) => {
    try {
      const response = await photoService.selectInfluencer(photoId, influencerId, token);
      return response;
    } catch (error) {
      // Get error message
      const message =
        error.response?.data?.errors?.[0] || "Erro ao selecionar influenciador.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);




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
          state.photos[updatedPhotoIndex].contrato = action.payload.photo.contrato;
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
        state.photos = action.payload;
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
      })
       // Aplicar a uma vaga
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancelar aplicação
      .addCase(cancelApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(cancelApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Obter aplicantes
      .addCase(getApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload;
        state.success = true;
      })
      .addCase(getApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      // selecionar inscrito
      builder.addCase(selectInfluencer.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(selectInfluencer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
      });
      builder.addCase(selectInfluencer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = null;
      });
    



  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;