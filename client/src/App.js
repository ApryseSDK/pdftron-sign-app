import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { auth } from './components/Firebase/firebase';
import Profile from './components/Profile/Profile';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import PasswordReset from './components/PasswordReset/PasswordReset';

import { useSelector, useDispatch } from 'react-redux';
import { setUser, selectUser } from './components/Firebase/firebaseSlice';

import './App.css';

const App = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(userAuth => {
      console.log('Auth changed');
      console.log(userAuth);
      if(userAuth) {
        const { uid, displayName, email, photoURL } = userAuth;
        dispatch(setUser({ uid, displayName, email, photoURL }));
      }
    });
  }, [auth]);

  return user ? (
    <Profile />
  ) : (
    <Router>
      <SignIn path="/" />
      <SignUp path="signUp" />
      <PasswordReset path="passwordReset" />
    </Router>
  );
};

export default App;
