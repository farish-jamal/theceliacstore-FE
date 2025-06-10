import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { snackbarReducer } from './slices/snackbarSlice';
import { languageReducer } from './slices/languageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    snackbar: snackbarReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
