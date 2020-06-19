import { createSlice } from '@reduxjs/toolkit';

export const AssignSlice = createSlice({
  name: 'assign',
  initialState: {
    signees: [],
  },
  reducers: {
    addSignee: (state, action) => {
      state.signees = [...state.signees, { key: action.payload.key, name: action.payload.name, email: action.payload.email } ];
    },
  },
});

export const { addSignee } = AssignSlice.actions;

export const selectAssignees = state => state.assign.signees;

export default AssignSlice.reducer;
