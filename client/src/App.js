import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';

import AssignUsers from './components/AssignUsers';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Preparation from './components/Preparation';
import Sign from './components/Sign';
import View from './components/View';
import Header from './components/Header';
import PasswordReset from './components/PasswordReset/PasswordReset';
import Welcome from './components/Welcome';

import { auth, generateUserDocument } from './firebase/firebase';
import { setUser, selectUser } from './firebase/firebaseSlice';

import './App.css';

const App = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const user = await generateUserDocument(userAuth);
        const { uid, displayName, email, photoURL } = user;
        dispatch(setUser({ uid, displayName, email, photoURL }));
      }
    });
  }, [dispatch]);

  return user ? (
    <div>
      <Router>
        <Welcome path="/" />
        <AssignUsers path="/assignUsers" />
        <Preparation path="/prepareDocument" />
        <Sign path="/signDocument" />
        <View path="/viewDocument" />
      </Router>
    </div>
  ) : (
    <div>
      <Header />
      <Router>
        <SignIn path="/" />
        <SignUp path="signUp" />
        <PasswordReset path="passwordReset" />
      </Router>
    </div>
  );
};

export default App;
