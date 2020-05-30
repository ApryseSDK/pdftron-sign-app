import React from 'react';
import { Router } from '@reach/router';

import Profile from './components/Profile/Profile';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import PasswordReset from './components/PasswordReset/PasswordReset';

import './App.css';

const App = () => {
  const user = null;
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
