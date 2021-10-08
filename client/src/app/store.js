import { configureStore } from '@reduxjs/toolkit';
import firebaseReducer from '../firebase/firebaseSlice';
import AssignReducer from '../components/Assign/AssignSlice';
import SignDocumentReducer from '../components/SignDocument/SignDocumentSlice';
import ViewDocumentReducer from '../components/ViewDocument/ViewDocumentSlice';

export default configureStore({
  reducer: {
    firebase: firebaseReducer,
    assign: AssignReducer,
    signDoc: SignDocumentReducer,
    viewDoc: ViewDocumentReducer,
  },
});
