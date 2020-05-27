import React, { useState } from 'react';
import { Link } from '@reach/router';
import { Box, Button, Toast, Container, Text, TextField, Heading } from 'gestalt';
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
            <TextField
              id="email"
              onChange={event => onChangeHandler(event)}
              placeholder="Add email"
              label="Email"
              value={email}
              type="email"
            />
            <TextField
              id="password"
              onChange={event => onChangeHandler(event)}
              placeholder="Enter your password"
              label="Password"
              value={password}
              type="password"
            />
            <Button
              onClick={event => {
                signInWithEmailAndPasswordHandler(event, email, password);
              }}
              text="Sign in"
              inline
            />
          </Box>
          <Box marginBottom={2}>
            <Text>or</Text>
            <Button text="Sign in with Google" inline />
            <Text>Don't have an account?</Text>
            <Link to="signUp" className="text-blue-500 hover:text-blue-600">
              Sign up here
            </Link>
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
