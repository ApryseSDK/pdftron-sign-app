import React, { useState } from 'react';
import { Link } from '@reach/router';
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

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const createUserWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    setEmail('');
    setPassword('');
    setDisplayName('');
  };
  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;
    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    } else if (name === 'displayName') {
      setDisplayName(value);
    }
  };
  return (
    <div>
    <Box padding={3}>
      <Container>
        <Box padding={3}>
          {error !== null && <Toast text={error} />}
          <Heading size="md">Sign Up</Heading>
        </Box>
        <Box padding={2}>
          <TextField
            id="displayName"
            onChange={event => onChangeHandler(event)}
            placeholder="Enter your email"
            label="Name"
            value={displayName}
            type="text"
          />
        </Box>
        <Box padding={2}>
          <TextField
            id="email"
            onChange={event => onChangeHandler(event)}
            placeholder="Add email"
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
                createUserWithEmailAndPasswordHandler(event, email, password);
              }}
            text="Sign up"
            color="blue"
            inline
          />
        </Box>

        <Box padding={2}>
          <Text>or</Text>
        </Box>
        <Box padding={2}>
          <Button text="Sign in with Google" color="red" inline />
        </Box>
        <Box padding={2}>
          <Text>Already have an account?</Text>
        </Box>
        <Box padding={2}>
        <Link to="/" className="text-blue-500 hover:text-blue-600">
            Sign in here
          </Link>
        </Box>
      </Container>
    </Box>
  </div>
  );
};
export default SignUp;
