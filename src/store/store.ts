import { configureStore } from '@reduxjs/toolkit';
import apiKeyReducer from './apiKeySlice';

const store = configureStore({
  reducer: {
    apiKey: apiKeyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
