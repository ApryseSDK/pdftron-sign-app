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
import { selectAssignees } from '../Assign/AssignSlice';
import { storage, addDocumentToSign } from '../Firebase/firebase';
import { selectUser } from '../Firebase/firebaseSlice';
import WebViewer from '@pdftron/webviewer';
import 'gestalt/dist/gestalt.css';
import './SignDocument.css';

const SignDocument = () => {
  const [instance, setInstance] = useState(null);
  
  const user = useSelector(selectUser);
  const { uid, email } = user;

  const viewer = useRef(null);

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
    ).then(instance => {
      const { iframeWindow } = instance;
      setInstance(instance);
    });
  }, []);

//   const uploadForSigning = async () => {
//     // upload the PDF with fields as AcroForm
//     const storageRef = storage.ref();
//     const referenceString = `docToSign/${uid}${Date.now()}.pdf`;
//     const docRef = storageRef.child(referenceString);
//     const { docViewer, annotManager } = instance;
//     const doc = docViewer.getDocument();
//     const xfdfString = await annotManager.exportAnnotations();
//     const data = await doc.getFileData({ xfdfString });
//     const arr = new Uint8Array(data);
//     const blob = new Blob([arr], { type: 'application/pdf' });
//     docRef.put(blob).then(function(snapshot) {
//       console.log('Uploaded the blob');
//     });

//     // create an entry in the database
//     const emails = assignees.map((assignee)=>{
//       return assignee.email;
//     });
//     addDocumentToSign(uid, email, referenceString, emails);
//   };

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
