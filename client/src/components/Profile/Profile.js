import React from 'react';
import {
  Box,
  Button,
  Text,
  Avatar,
  Row,
  Stack,
  Container,
  Heading,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { auth } from '../Firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUser } from '../Firebase/firebaseSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { displayName, photoURL, email } = user;

  return (
    <Box padding={3}>
      <Container>
        <Box padding={3}>
          <Row gap={1}>
            <Avatar name={displayName} size="md" src={photoURL} />
            <Stack>
              <Text weight="bold">{displayName}</Text>
              <Text>{email}</Text>
            </Stack>
            <Button
              onClick={() => {
                auth.signOut();
                dispatch(setUser(null));
              }}
              accessibilityLabel="Sign out of your account"
              color="red"
              text="Sign out"
            />
          </Row>
        </Box>
      </Container>
    </Box>
  );
};
export default ProfilePage;
