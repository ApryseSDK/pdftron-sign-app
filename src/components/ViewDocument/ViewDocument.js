import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import { Box, Column, Heading, Row, Stack, Button } from 'gestalt';
import { selectDocToView, resetDocToView } from './ViewDocumentSlice';
import { storage } from '../Firebase/firebase';
import WebViewer from '@pdftron/webviewer';
import 'gestalt/dist/gestalt.css';
import './ViewDocument.css';

const SignDocument = () => {
  const [instance, setInstance] = useState(null);

  const dispatch = useDispatch();

  const doc = useSelector(selectDocToView);
  const { docRef } = doc;

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
          'freeTextToolButton',
          'miscToolGroupButton',
        ],
      },
      viewer.current,
    ).then(async instance => {
      setInstance(instance);

      // load document
      const storageRef = storage.ref();
      const URL = await storageRef.child(docRef).getDownloadURL();
      console.log(URL);
      instance.docViewer.loadDocument(URL);
    });
  }, []);

  const download = () => {
    instance.downloadPdf(true);
  };

  const doneViewing = async () => {
    dispatch(resetDocToView());
    navigate('/');
  }

  return (
    <div className={'prepareDocument'}>
      <Box display="flex" direction="row" flex="grow">
        <Column span={2}>
          <Box padding={3}>
            <Heading size="md">View Document</Heading>
          </Box>
          <Box padding={3}>
            <Row gap={1}>
              <Stack>
                <Box padding={2}>
                  <Button
                    onClick={download}
                    accessibilityLabel="download signed document"
                    text="Download"
                    iconEnd="download"
                  />
                </Box>
                <Box padding={2}>
                  <Button
                    onClick={doneViewing}
                    accessibilityLabel="complete signing"
                    text="Done viewing"
                    iconEnd="check"
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
