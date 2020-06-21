import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Column,
  Heading,
  Row,
  Stack,
  Text,
  Button,
} from 'gestalt';
import { selectDocToSign } from './SignDocumentSlice';
import { storage } from '../Firebase/firebase';
import { selectUser } from '../Firebase/firebaseSlice';
import WebViewer from '@pdftron/webviewer';
import 'gestalt/dist/gestalt.css';
import './SignDocument.css';

const SignDocument = () => {
  const [instance, setInstance] = useState(null);
  
  const docRef = useSelector(selectDocToSign);
  const user = useSelector(selectUser);
  const { uid, email } = user;

  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: 'webviewer',
        disabledElements: [
          'toolsButton',
          'searchButton',
          'menuButton',
          'contextMenuPopup',
          'freeHandToolGroupButton',
          'textToolGroupButton',
          'shapeToolGroupButton',
          'signatureToolButton',
          'eraserToolButton',
          'stickyToolButton',
          'miscToolGroupButton',
        ],
      },
      viewer.current,
    ).then( async instance => {
      const { docViewer } = instance;
      setInstance(instance);
      const storageRef = storage.ref();
      console.log(docRef);
      const URL = await storageRef.child(docRef).getDownloadURL();
      instance.docViewer.loadDocument(URL);
    });
  }, []);

  return (
    <div className={'prepareDocument'}>
      <Box display="flex" direction="row" flex="grow">
        <Column span={2}>
          <Box padding={3}>
            <Heading size="md">Sign Document</Heading>
          </Box>
          <Box padding={3}>
            <Row gap={1}>
              <Stack>
                <Box padding={2}>
                  <Text>{'Complete signing'}</Text>
                </Box>
                <Box padding={2}>
                  <Button
                    onClick={() => {
                    }}
                    accessibilityLabel="complete signing"
                    text="Complete signing"
                    iconEnd="compose"
                  />
                </Box>
              </Stack>
            </Row>
          </Box>
        </Column>
        <Column span={10}>
          <div className="webviewer" ref={viewer}></div>
        </Column>
      </Box>
    </div>
  );
};

export default SignDocument;
