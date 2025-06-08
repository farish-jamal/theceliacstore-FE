import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LanguageState {
  code: string;
  label: string;
}

const initialState: LanguageState = {
  code: 'en',
  label: 'English',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<LanguageState>) {
      state.code = action.payload.code;
      state.label = action.payload.label;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const languageReducer = languageSlice.reducer;
