import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import calendarService from "../services/calendarService";

const initialState = {
  events: [],
  event: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Criar evento
export const createEvent = createAsyncThunk(
  "calendar/create",
  async (eventData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const data = await calendarService.createEvent(eventData, token);

      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao criar evento.");
    }
  }
);

// Buscar eventos do usuário
export const getUserEvents = createAsyncThunk(
  "calendar/userevents",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const data = await calendarService.getUserEvents(token);

      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao buscar eventos.");
    }
  }
);

// Buscar evento específico
export const getEvent = createAsyncThunk(
  "calendar/getevent",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const data = await calendarService.getEvent(id, token);

      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao buscar evento.");
    }
  }
);

// Atualizar evento
export const updateEvent = createAsyncThunk(
  "calendar/update",
  async (eventData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const data = await calendarService.updateEvent(
        eventData,
        eventData.id,
        token
      );

      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao atualizar evento.");
    }
  }
);

// Deletar evento
export const deleteEvent = createAsyncThunk(
  "calendar/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const data = await calendarService.deleteEvent(id, token);

      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao deletar evento.");
    }
  }
);

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.event = action.payload;
        state.events.unshift(state.event);
        state.message = "Evento criado com sucesso!";
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.event = null;
      })
      // Get User Events
      .addCase(getUserEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.events = action.payload;
      })
      .addCase(getUserEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Single Event
      .addCase(getEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.event = action.payload;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.events = state.events.map((event) => {
          if (event._id === action.payload._id) {
            return action.payload;
          }
          return event;
        });
        state.message = "Evento atualizado com sucesso!";
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.events = state.events.filter(
          (event) => event._id !== action.payload.id
        );
        state.message = action.payload.message;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage } = calendarSlice.actions;
export default calendarSlice.reducer;
