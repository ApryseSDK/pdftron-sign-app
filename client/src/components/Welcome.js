import React, { useEffect } from 'react';
import Profile from './Profile/Profile';
import { navigate } from '@reach/router';
import { useDispatch } from 'react-redux';
import SignList from './Lists/SignList';
import SignedList from './Lists/SignedList';
import { resetDocToView } from './ViewDocument/ViewDocumentSlice';
import { resetDocToSign } from './SignDocument/SignDocumentSlice';
import { Box, Button, Container, Heading } from 'gestalt';
import 'gestalt/dist/gestalt.css';


const ProfilePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetDocToView());
    dispatch(resetDocToSign());
  }, [dispatch]);

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
        <Box padding={3}>
          <SignedList />
        </Box>
      </Container>
    </div>
  );
};
export default ProfilePage;
