import React, { useState } from 'react';
import { Link } from '@reach/router';
import {
  Box,
  Button,
  Toast,
  Container,
  Text,
  TextField,
  Heading,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';

const SignDocument = () => {
  return (
    <div>
      <Box padding={3}>
        <Container>
          <Box padding={3}>
            <Heading size="md">Sign Document</Heading>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default SignDocument;
