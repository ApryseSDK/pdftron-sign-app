import React from 'react';
import Profile from './Profile/Profile';
import { navigate } from '@reach/router';
import SignList from './SignList';
import { Box, Button, Container, Heading } from 'gestalt';
import 'gestalt/dist/gestalt.css';

const ProfilePage = () => {

  return (
    <div>
      <Profile />
      <Container>
        <Box padding={3}>
          <Heading size="md">{`Sign Documents`}</Heading>
        </Box>
        <Box padding={3}>
          <SignList />
        </Box>
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
        <Box padding={3}>
          <Heading size="md">{`Review Signed Documents`}</Heading>
        </Box>
      </Container>
    </div>
  );
};
export default ProfilePage;
