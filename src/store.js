import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice'
import photoReducer from './slices/photoSlice';
import postReducer from './slices/postSlice';
import calendarReducer from './slices/calendarSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        photo: photoReducer,
        post: postReducer,
    },
})