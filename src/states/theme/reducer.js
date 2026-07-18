import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: 'dark',
  reducers: {
    toggleTheme: (state) => (state === 'dark' ? 'light' : 'dark'),
    setTheme: (state, action) => action.payload,
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
