import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';

import AssignUsers from './components/AssignUsers';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Preparation from './components/Preparation';
import PasswordReset from './components/PasswordReset/PasswordReset';

import { auth, generateUserDocument } from './components/Firebase/firebase';
import { setUser, selectUser } from './components/Firebase/firebaseSlice';

import { Box, Column, Heading } from 'gestalt';
import 'gestalt/dist/gestalt.css';

import './App.css';

const App = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const heading = (
    <Box display="flex" direction="row" paddingY={2} color={'lightGray'}>
    <Column span={10}>
      <Box padding={3}>
        <Heading size="lg">PDFTron Sign App</Heading>
      </Box>
    </Column>
    </Box>
  );

  useEffect(() => {
    auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const user = await generateUserDocument(userAuth);
        const { uid, displayName, email, photoURL } = user;
        dispatch(setUser({ uid, displayName, email, photoURL }));
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
      {heading}
      <Router>
        <SignIn path="/" />
        <SignUp path="signUp" />
        <PasswordReset path="passwordReset" />
      </Router>
    </div>
  );
};

export default App;
