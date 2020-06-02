import React, { useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
} from 'gestalt';
import WebViewer from '@pdftron/webviewer';
import 'gestalt/dist/gestalt.css';
import './SignDocument.css';

const SignDocument = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: 'webviewer'
      },
      viewer.current,
    ).then((instance) => {
      const { docViewer } = instance;
      instance.disableElements(['toolsButton', 'searchButton', 'menuButton', 'contextMenuPopup' ]);

      docViewer.on('documentLoaded', () => {

      });
    });
  }, []);

  return (
    <div>
      <Box padding={3}>
        <Container>
          <Box padding={3}>
            <Heading size="md">Sign Document</Heading>
          </Box>
          <div className="webviewer" ref={viewer}></div>
        </Container>
      </Box>
    </div>
  );
};

export default SignDocument;
