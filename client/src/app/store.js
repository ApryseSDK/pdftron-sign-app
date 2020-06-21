import { configureStore } from '@reduxjs/toolkit';
import firebaseReducer from '../components/Firebase/firebaseSlice';
import AssignReducer from '../components/Assign/AssignSlice';
import SignDocumentReducer from '../components/SignDocument/SignDocumentSlice';

export default configureStore({
  reducer: {
    firebase: firebaseReducer,
    assign: AssignReducer,
    signDoc: SignDocumentReducer
  },
});
