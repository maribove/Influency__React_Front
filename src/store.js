import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import photoReducer from './slices/photoSlice';
import postReducer from './slices/postSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        photo: photoReducer,
        post: postReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});