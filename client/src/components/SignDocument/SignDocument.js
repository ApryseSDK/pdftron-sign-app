import React, { useRef, useEffect, useState } from 'react';
import { Box, Column, Heading, Row, Stack, Text, Button } from 'gestalt';
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
        disabledElements: [
          'toolsButton',
          'searchButton',
          'menuButton',
          'contextMenuPopup',
        ],
      },
      viewer.current,
    ).then(instance => {
      const { docViewer } = instance;
      instance.disableElements(['freeHandToolGroupButton']);
      instance.disableElements(['textToolGroupButton']);
      instance.disableElements(['shapeToolGroupButton']);
      instance.disableElements(['signatureToolButton']);
      instance.disableElements(['freeTextToolButton']);
      instance.disableElements(['eraserToolButton']);
      instance.disableElements(['stickyToolButton']);
      instance.disableElements(['miscToolGroupButton']);
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
      <Box display="flex" direction="row" paddingY={2}>
        <Column span={4}>
          <Box padding={3}>
            <Heading size="md">Sign Document</Heading>
          </Box>
          <Box padding={3}>
            <Row gap={1}>
              <Stack>
              <Box padding={2}>
                <Text>{'Step 1'}</Text>
                </Box>
                <Button
                  onClick={() => {
                    if (filePicker) {
                      filePicker.current.click();
                    }
                  }}
                  accessibilityLabel="upload a document"
                  text="Upload a document"
                />
              </Stack>
            </Row>
            <Row>
              <Stack>
                <Box padding={2}>
                <Text>{'Step 2'}</Text>
                </Box>
                
                <Button
                  onClick={() => {
                    if (filePicker) {
                      filePicker.current.click();
                    }
                  }}
                  accessibilityLabel="add signature"
                  text="Add signature"
                />
                <Button
                  onClick={() => {
                    if (filePicker) {
                      filePicker.current.click();
                    }
                  }}
                  accessibilityLabel="add text"
                  text="Add text"
                />
              </Stack>
            </Row>
          </Box>
        </Column>
        <Column span={8}>
          <div className="webviewer" ref={viewer}></div>
        </Column>
      </Box>
      <input type="file" ref={filePicker} style={{ display: 'none' }} />
    </div>
  );
};

export default SignDocument;
