import React, { useState } from 'react';
import { Link } from '@reach/router';
import { auth, signInWithGoogle } from '../../firebase';
import {
  Box,
  Button,
  Toast,
  Container,
  Text,
  TextField,
  Heading,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
  };

  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;

    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    }
  };

  return (
    <div>
      <Box padding={3}>
        <Container>
          <Box padding={3}>
            {error !== null && <Toast text={error} />}
            <Heading size="md">Sign in</Heading>
          </Box>
          <Box padding={2}>
            <TextField
              id="email"
              onChange={event => onChangeHandler(event)}
              placeholder="Enter your email"
              label="Email"
              value={email}
              type="email"
            />
          </Box>
          <Box padding={2}>
            <TextField
              id="password"
              onChange={event => onChangeHandler(event)}
              placeholder="Enter your password"
              label="Password"
              value={password}
              type="password"
            />
          </Box>
          <Box padding={2}>
            <Button
              onClick={event => {
                signInWithEmailAndPasswordHandler(event, email, password);
              }}
              text="Sign in"
              color="blue"
              inline
            />
          </Box>

          <Box padding={2}>
            <Text>or</Text>
          </Box>
          <Box padding={2}>
            <Button onClick={signInWithGoogle} text="Sign in with Google" color="red" inline />
          </Box>
          <Box padding={2}>
            <Text>Don't have an account?</Text>
          </Box>
          <Box padding={2}>
            <Link to="signUp" className="text-blue-500 hover:text-blue-600">
              Sign up here
            </Link>
          </Box>
          <Box padding={2}>
            <Link
              to="passwordReset"
              className="text-blue-500 hover:text-blue-600"
            >
              Forgot Password?
            </Link>
          </Box>
        </Container>
      </Box>
    </div>
  );
};
export default SignIn;
