import React from 'react';
import {
  Box,
  Button,
  Container,
  Column,
  Heading,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { auth } from './Firebase/firebase';
import { useSelector } from 'react-redux';
import { selectUser, setUser } from './Firebase/firebaseSlice';
import Profile from './Profile/Profile';
import { navigate } from '@reach/router';

const ProfilePage = () => {
  const user = useSelector(selectUser);
  const { displayName, photoURL, email } = user;

  return (
    <div>
      <Profile />
        <Container>
          <Box display="flex" direction="row" flex="grow">
          <Column span={6}>
            <Box padding={3}>
              <Heading size="md">{`Sign Documents`}</Heading>
            </Box>
          </Column>
          <Column span={6}>
            <Box padding={3}>
              <Heading size="md">{`Prepare Document`}</Heading>
            </Box>
            <Box padding={2}>
              <Button
                onClick={event => {
                  navigate(`/assignUsers`);
                }}
                text="Prepare Document for Signing"
                color="blue"
                inline
              />
            </Box>
          </Column>
          </Box>
        </Container>
    </div>
  );
};
export default ProfilePage;
