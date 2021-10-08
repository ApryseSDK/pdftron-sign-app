import { createSlice } from '@reduxjs/toolkit';

export const ViewDocumentSlice = createSlice({
  name: 'viewDoc',
  initialState: {
    docToView: null,
  },
  reducers: {
    setDocToView: (state, action) => {
      state.docToView = action.payload;
    },
    resetDocToView: (state, action) => {
      state.docToView = null;
    }
  },
});

export const { setDocToView, resetDocToView } = ViewDocumentSlice.actions;

export const selectDocToView = state => state.viewDoc.docToView;

export default ViewDocumentSlice.reducer;
