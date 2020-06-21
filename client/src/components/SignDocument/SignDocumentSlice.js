import { createSlice } from '@reduxjs/toolkit';

export const SignDocumentSlice = createSlice({
  name: 'signDocument',
  initialState: {
    docToSign: null,
  },
  reducers: {
    setDocToSign: (state, action) => {
      state.docToSign = action.payload;
    },
    resetDocToSign: (state, action) => {
      state.docToSign = null;
    }
  },
});

export const { setDocToSign, resetDocToSign } = SignDocumentSlice.actions;

export const selectDocToSign = state => state.signDocument.docToSign;

export default SignDocumentSlice.reducer;
