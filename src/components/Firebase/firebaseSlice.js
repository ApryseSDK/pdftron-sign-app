import { createSlice } from '@reduxjs/toolkit';

export const firebaseSlice = createSlice({
  name: 'firebase',
  initialState: {
    user: null,
    docs: [],
    docsSigned: [],
  },
  reducers: {
    setUser: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.user = action.payload;
    },
    resetDocs: (state, action) => {
      state.docs = [];
    },
    setDocs: (state, action) => {
      state.docs = [...state.docs, { docRef: action.payload.docRef, email: action.payload.email, docId: action.payload.docId } ];
    },
    resetDocsSigned: (state, action) => {
      state.docs = [];
    },
    setDocsSigned: (state, action) => {
      state.docs = [...state.docsSigned, { docRef: action.payload.docRef, emails: action.payload.emails, docId: action.payload.docId } ];
    },
  },
});

export const { setUser, setDocs, resetDocs, resetDocsSigned, setDocsSigned } = firebaseSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectUser = state => state.firebase.user;
export const selectDocs = state => state.firebase.docs;
export const selectSignedDocs = state => state.firebase.docsSigned;

export default firebaseSlice.reducer;
