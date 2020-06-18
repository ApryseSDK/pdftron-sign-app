import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';

import AssignUsers from './components/AssignUsers';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Preparation from './components/Preparation';
import Header from './components/Header';
import PasswordReset from './components/PasswordReset/PasswordReset';

import { auth, generateUserDocument, searchForDocumentToSign } from './components/Firebase/firebase';
import { setUser, selectUser } from './components/Firebase/firebaseSlice';

import { Box, Column, Heading } from 'gestalt';
import 'gestalt/dist/gestalt.css';

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
        searchForDocumentToSign(email);
      }
    });
  }, [auth]);

  return user ? (
    <div>
      <Router>
        <AssignUsers path="/" />
        <Preparation path="/prepareDocument" />
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
