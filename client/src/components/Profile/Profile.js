import React from 'react';
import {
  Box,
  Button,
  Text,
  Avatar,
  Row,
  Stack,
  Column,
  Heading,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { auth } from '../Firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUser } from '../Firebase/firebaseSlice';
import { navigate } from '@reach/router';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { displayName, photoURL, email } = user;

  return (
    <Box display="flex" direction="row" paddingY={2} color={'lightGray'}>
      <Column span={10}>
        <Box padding={3}>
          <Heading size="lg">PDFTron Sign App</Heading>
        </Box>
      </Column>
      <Column span={2}>
        <Box padding={3}>
          <Row>
            <Box padding={1}>
              <Avatar name={displayName} size="md" src={photoURL} />
            </Box>
            <Stack>
              <Text weight="bold">{displayName}</Text>
              <Text>{email}</Text>
            </Stack>
            <Box padding={1}>
              <Button
                onClick={() => {
                  auth.signOut();
                  dispatch(setUser(null));
                  navigate('/');
                }}
                accessibilityLabel="Sign out of your account"
                text="Sign out"
              />
            </Box>
          </Row>
        </Box>
      </Column>
    </Box>
  );
};
export default ProfilePage;
