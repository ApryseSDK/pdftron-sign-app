import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';

import AssignUsers from './components/AssignUsers';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import PrepareDocument from './components/PrepareDocument';
import PasswordReset from './components/PasswordReset/PasswordReset';

import { auth, generateUserDocument } from './components/Firebase/firebase';
import { setUser, selectUser } from './components/Firebase/firebaseSlice';

import { Box, Container, Heading } from 'gestalt';
import 'gestalt/dist/gestalt.css';

import './App.css';

const App = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const heading = (
    <Box padding={3}>
      <Container>
        <Box padding={3}>
          <Heading size="lg">PDFTron Sign App</Heading>
        </Box>
      </Container>
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
      {heading}
      <Router>
        <AssignUsers path="/" />
        <PrepareDocument path="/signDocument" />
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