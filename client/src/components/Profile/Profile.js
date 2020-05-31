import React from 'react';
import { Box, Button, Text, Avatar, Card, Container, Heading } from 'gestalt';
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
          <Heading size="md">Profile</Heading>
        </Box>
        <Box maxWidth={236} padding={2} column={12}>
          <Card image={<Avatar name="James Jones" src={photoURL} />}>
            <Text align="center" weight="bold">
              <Box paddingX={3} paddingY={2}>
                {displayName}
              </Box>
            </Text>
            <Text align="center">
              <Box paddingX={3} paddingY={2}>
                {email}
              </Box>
            </Text>
            <Button
              onClick={() => {
                auth.signOut();
                dispatch(setUser(null));
              }}
              accessibilityLabel="Sign out of your account"
              color="red"
              text="Sign out"
            />
          </Card>
        </Box>
      </Container>
    </Box>
  );
};
export default ProfilePage;
