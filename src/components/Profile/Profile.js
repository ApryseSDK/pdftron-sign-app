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
import { auth } from '../../firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUser } from '../../firebase/firebaseSlice';
import { resetSignee } from '../Assign/AssignSlice';
import { navigate, Link } from '@reach/router';
import './Profile.css';


const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { displayName, photoURL, email } = user;

  return (
    <Box display="flex" direction="row" paddingY={2} color={'lightGray'}>
      <Column span={9}>
        <Box padding={3}>
          <Link to="/" className='profileLink'><Heading size="lg">PDFTron Sign App</Heading></Link>
        </Box>
      </Column>
      <Column span={3}>
        <Box padding={1}>
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
                  dispatch(resetSignee())
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
