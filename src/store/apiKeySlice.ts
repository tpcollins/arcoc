import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ApiKeyState {
  apiKey: string;
}

const initialState: ApiKeyState = {
  apiKey: '',
};

const apiKeySlice = createSlice({
  name: 'apiKey',
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
    },
    clearApiKey: (state) => {
      state.apiKey = '';
    },
  },
});

export const { setApiKey, clearApiKey } = apiKeySlice.actions;
export default apiKeySlice.reducer;
