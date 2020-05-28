import React from 'react';
import { Router } from '@reach/router';

//import Profile from './components/Profile/Profile';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
//import PasswordReset from './components/PasswordReset/PasswordReset';

import './App.css';

const App = () => {
  const user = null;
  return (
    <Router>
      <SignIn path="/" />
      <SignUp path="signUp" />
    </Router>
  );
  // return user ? (
  //   <Profile />
  // ) : (
  //   <Router>
  //     <div className="App">
  //       <SignUp path="signUp" />
  //       <SignIn path="/" />
  //       <PasswordReset path="passwordReset" />
  //     </div>
  //   </Router>
  // );
};

export default App;
