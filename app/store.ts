import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { snackbarReducer } from './slices/snackbarSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    snackbar: snackbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
