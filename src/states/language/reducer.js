import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: 'en',
  reducers: {
    toggleLanguage: (state) => (state === 'en' ? 'id' : 'en'),
    setLanguage: (state, action) => action.payload,
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
