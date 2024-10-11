// slice de estado para lidar com a autenticação de usuários
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user ? user : null,
  error: false,
  success: false,
  loading: false,
};

// Register a user and sign in
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    const data = await authService.register(user);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    localStorage.setItem("token", data.token);


    return data;
  }
);

// Logout do usuário
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

// Sing in a user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  const data = await authService.login(user);

   // Check for errors
   if (data.errors) {
    return thunkAPI.rejectWithValue(data.errors[0]);
  }
  localStorage.setItem("token", data.token);

  return data;
});

// Solicitar redefinição de senha
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, thunkAPI) => {
    try {
      const response = await authService.requestPasswordReset(email);
      return response.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data ? error.response.data.errors[0] : "Erro inesperado"
      );
    }
  }
);

// Redefinir senha
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      const response = await authService.resetPassword(token, password);
      return response.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data ? error.response.data.errors[0] : "Erro inesperado"
      );
    }
  }
);


export const authSlice = createSlice({
  name: "auth",
  initialState,
  token: localStorage.getItem("token") || null,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },
  
  // reducers para atualizar o estado
  extraReducers: (builder) => {
    builder

    // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("token"); // Remove o token no logout
        state.loading = false;
        state.success = true;
        state.error = null;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      });
  },
});

export const { reset} = authSlice.actions;
export default authSlice.reducer;