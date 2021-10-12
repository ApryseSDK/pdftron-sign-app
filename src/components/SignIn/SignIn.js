import React, { useEffect, useState } from 'react';
import { Link, navigate } from '@reach/router';
import { auth, signInWithGoogle } from '../../firebase/firebase';
import { useDispatch } from 'react-redux';
import { setDocToSign } from '../SignDocument/SignDocumentSlice';
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

  const dispatch = useDispatch();

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      setError('Error signing in with password and email!');
      console.error('Error signing in with password and email', error);
    });
  };

  useEffect(() => {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      const email = window.prompt('Please provide your email for confirmation');
      auth
        .signInWithEmailLink(email, window.location.href)
        .then((result) => {
          const searchParams = new URLSearchParams(window.location.href);
          let docRef = '';
          let docId = ''
          searchParams.forEach((key, value) => {
            console.log(value);
            if (value.includes('docRef')) {
              docRef = `docToSign${key.split('docToSign')[1]}`;
            }
            console.log(docRef);
            if (value === 'docId') {
              docId = key;
            }
          });
          dispatch(setDocToSign({ docRef, docId }));
          navigate(`/signDocument`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div>
      <Box padding={3}>
        <Container>
          <Box padding={3}>
            {error !== null && <Toast text={error} />}
            <Heading size='md'>Sign in</Heading>
          </Box>
          <Box padding={2}>
            <TextField
              id='email'
              onChange={(event) => setEmail(event.value)}
              placeholder='Enter your email'
              label='Email'
              value={email}
              type='email'
            />
          </Box>
          <Box padding={2}>
            <TextField
              id='password'
              onChange={(event) => setPassword(event.value)}
              placeholder='Enter your password'
              label='Password'
              value={password}
              type='password'
            />
          </Box>
          <Box padding={2}>
            <Button
              onClick={(event) => {
                signInWithEmailAndPasswordHandler(event, email, password);
                navigate('/');
              }}
              text='Sign in'
              color='blue'
              inline
            />
          </Box>

          <Box padding={2}>
            <Text>or</Text>
          </Box>
          <Box padding={2}>
            <Button
              onClick={signInWithGoogle}
              text='Sign in with Google'
              color='red'
              inline
            />
          </Box>
          <Box padding={2}>
            <Text>Don't have an account?</Text>
          </Box>
          <Box padding={2}>
            <Link to='signUp' className='text-blue-500 hover:text-blue-600'>
              Sign up here
            </Link>
          </Box>
          <Box padding={2}>
            <Link
              to='passwordReset'
              className='text-blue-500 hover:text-blue-600'
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
