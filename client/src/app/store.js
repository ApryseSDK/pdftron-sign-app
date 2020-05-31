import { configureStore } from '@reduxjs/toolkit';
import firebaseReducer from '../components/Firebase/firebaseSlice';

export default configureStore({
  reducer: {
    firebase: firebaseReducer 
  },
});
