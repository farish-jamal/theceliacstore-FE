import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SnackbarState = {
  open: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  position?:
    | "bottom-center"
    | "top-center"
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left";
  title?: string;
  subtitle?: string;
  onClick?: () => void;
};

const initialState: SnackbarState = {
  open: false,
  message: "",
  type: "info",
  position: "top-right",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar(
      state,
      action: PayloadAction<{
        message: string;
        type?: SnackbarState["type"];
        position?: SnackbarState["position"];
        title?: string;
        subtitle?: string;
        onClick?: () => void;
      }>
    ) {
      state.open = true;
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.position = action.payload.position || "top-right";
      state.title = action.payload.title;
      state.subtitle = action.payload.subtitle;
      state.onClick = action.payload.onClick;
    },
    hideSnackbar(state) {
      state.open = false;
      state.message = "";
      state.title = undefined;
      state.subtitle = undefined;
      state.onClick = undefined;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export const snackbarReducer = snackbarSlice.reducer;
