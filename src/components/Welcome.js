import React from 'react';
import { Box, Button, Container, Column, Table, Text, Heading } from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { auth } from './Firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectDocs, setDocs } from './Firebase/firebaseSlice';
import { setDocToSign } from './SignDocument/SignDocumentSlice';
import Profile from './Profile/Profile';
import { navigate } from '@reach/router';

const ProfilePage = () => {
  const user = useSelector(selectUser);
  const docs = useSelector(selectDocs);

  const dispatch = useDispatch();

  const { displayName, photoURL, email } = user;

  return (
    <div>
      <Profile />
      <Container>
        <Box padding={3}>
          <Heading size="md">{`Sign Documents`}</Heading>
        </Box>
        <Box padding={3}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Text weight="bold">From</Text>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {docs.map(doc => (
                <Table.Row key={doc.docRef}>
                  <Table.Cell>
                    <Text>{doc.email}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={event => {
                        const { docRef, docId } = doc;
                        dispatch(setDocToSign({ docRef, docId }));
                        navigate(`/signDocument`);
                      }}
                      text="Sign"
                      color="blue"
                      inline
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
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
