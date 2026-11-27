"use client";
import { Provider } from "react-redux";
import { store } from "../store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const persistor = persistStore(store);

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  // Google sign-in provider now lives on /login only, so its script stops loading on every page.
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
