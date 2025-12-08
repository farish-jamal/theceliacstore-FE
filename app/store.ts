import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './slices/authSlice';
import { snackbarReducer } from './slices/snackbarSlice';
import { languageReducer } from './slices/languageSlice';
import guestCartReducer from './slices/guestCartSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
  language: languageReducer,
  guestCart: guestCartReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'guestCart'], // Persist auth and guest cart
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
