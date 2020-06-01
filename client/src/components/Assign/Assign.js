import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import {
  Box,
  Button,
  Container,
  Heading,
  TextField,
  Table,
  Text,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { addSignee, selectAssignees } from './AssignSlice';

const Assign = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const assignees = useSelector(selectAssignees);
  const dispatch = useDispatch();

  const addUser = (name, email) => {
    const key = `${new Date().getTime()}${email}`;
    dispatch(addSignee({key, name, email}));
    setEmail('');
    setDisplayName('');
  };

  return (
    <div>
      <Box padding={3}>
        <Container>
          <Box padding={3}>
            <Heading size="md">Who needs to sign?</Heading>
          </Box>
          <Box padding={2}>
            <TextField
              id="displayName"
              onChange={event => setDisplayName(event.value)}
              placeholder="Enter your name"
              label="Name"
              value={displayName}
              type="text"
            />
          </Box>
          <Box padding={2}>
            <TextField
              id="email"
              onChange={event => setEmail(event.value)}
              placeholder="Enter your email"
              label="Email"
              value={email}
              type="email"
            />
          </Box>
          <Box padding={2}>
            <Button
              onClick={event => {
                addUser(displayName, email);
              }}
              text="Add user"
              color="blue"
              inline
            />
          </Box>
          <Box padding={2}>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <Text weight="bold">Name</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Email</Text>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {assignees.map(user => (
                  <Table.Row key={user.key}>
                    <Table.Cell>
                      <Text>{user.name}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text>{user.email}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Box>
          <Box padding={2}>
            <Button
              onClick={event => {
                navigate(`/signDocument`);
              }}
              text="Prepare Document for Signing"
              color="blue"
              inline
            />
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default Assign;
