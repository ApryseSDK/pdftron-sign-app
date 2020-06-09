import React, { useRef, useEffect, useState } from 'react';
import { Box, Container, Heading, Row, Stack, Text, Button } from 'gestalt';
import WebViewer from '@pdftron/webviewer';
import 'gestalt/dist/gestalt.css';
import './SignDocument.css';

const SignDocument = () => {
  const [upload, setUpload] = useState(true);
  const viewer = useRef(null);
  const filePicker = useRef(null);
  const addSignature = useRef(null);
  const addText = useRef(null);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: 'webviewer',
      },
      viewer.current,
    ).then(instance => {
      const { docViewer } = instance;
      instance.disableElements([
        'toolsButton',
        'searchButton',
        'menuButton',
        'contextMenuPopup',
      ]);

      filePicker.current.onchange = e => {
        const file = e.target.files[0];
        if (file) {
          instance.loadDocument(file);
          setUpload(false);
        }
      };

      docViewer.on('documentLoaded', () => {});
    });
  }, []);

  return (
    <div>
      <Box padding={3}>
        <Container>
          <Box padding={3}>
            <Heading size="md">Sign Document</Heading>
          </Box>
          <Box padding={3}>
            <Row gap={1}>
              <Stack>
                {upload ? (
                  <Button
                    onClick={() => {
                      if (filePicker) {
                        filePicker.current.click();
                      }
                    }}
                    accessibilityLabel="upload a document"
                    text="Upload a document"
                  />
                ) : null}
              </Stack>
              {!upload ? (
                <Button
                  onClick={() => {
                    if (filePicker) {
                      filePicker.current.click();
                    }
                  }}
                  accessibilityLabel="add signature"
                  text="Add signature"
                />
              ) : null}
              {!upload ? (
                <Button
                  onClick={() => {
                    if (filePicker) {
                      filePicker.current.click();
                    }
                  }}
                  accessibilityLabel="add text"
                  text="Add text"
                />
              ) : null}
            </Row>
          </Box>
          <div className="webviewer" ref={viewer}></div>
        </Container>
      </Box>
      <input type="file" ref={filePicker} style={{ display: 'none' }} />
    </div>
  );
};

export default SignDocument;
