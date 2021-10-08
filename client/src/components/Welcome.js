import React, { useEffect, useState } from 'react';
import Profile from './Profile/Profile';
import { navigate } from '@reach/router';
import { useDispatch } from 'react-redux';
import SignList from './Lists/SignList';
import SignedList from './Lists/SignedList';
import { resetDocToView } from './ViewDocument/ViewDocumentSlice';
import { resetDocToSign } from './SignDocument/SignDocumentSlice';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Status,
  Tag,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';


const ProfilePage = () => {
  const dispatch = useDispatch();
  const [numPendingDocsToSign, /* setNumPendingDocsToSign */] = useState(0);
  const [numOfDocsSigned,  /* setNumOfDocsSigned */] = useState(0);

  useEffect(() => {
    dispatch(resetDocToView());
    dispatch(resetDocToSign());
  }, [dispatch]);

  return (
    <div>
      <Profile />
      <Container>
        <Box padding={3}>
          <Flex alignItems="center" gap={2}>
            <Heading size="md">
              {`Sign Documents`}
            </Heading>
            {
              /**
               * @todo 2021-10-08
               * 1. Find a better component compared to `Tag` for displaying the
               * number?
               * 2. @andrey Need API to conditionally render the number in the
               * `Tag` and the correct Status
               */
            }
            <Tag disabled text={`${numPendingDocsToSign}`}></Tag>
            {
              (!numPendingDocsToSign && <Status type="ok" title="No Pending Documents"/>)
              || (numPendingDocsToSign && <Status type="inProgress" title="Pending Documents"/>)
            }
          </Flex>
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
          <Flex alignItems="center" gap={2}>
            <Heading size="md">{`Review Signed Documents`}</Heading>
            {
              /**
               * @todo 2021-10-08
               * 1. Find a better component compared to `Tag` for displaying the
               * number?
               */
            }
            <Tag disabled text={`${numOfDocsSigned}`}></Tag>
          </Flex>
        </Box>
        <Box padding={3}>
          <SignedList />
        </Box>
      </Container>
    </div>
  );
};
export default ProfilePage;
