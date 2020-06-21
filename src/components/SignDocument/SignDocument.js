import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Column, Heading, Row, Stack, Text, Button } from 'gestalt';
import { selectDocToSign } from './SignDocumentSlice';
import { storage } from '../Firebase/firebase';
import { selectUser } from '../Firebase/firebaseSlice';
import WebViewer from '@pdftron/webviewer';
import 'gestalt/dist/gestalt.css';
import './SignDocument.css';

const SignDocument = () => {
  const [instance, setInstance] = useState(null);
  const [annotManager, setAnnotatManager] = useState(null);
  const [annotPosition, setAnnotPosition] = useState(0);

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
          'freeTextToolButton',
          'miscToolGroupButton',
        ],
      },
      viewer.current,
    ).then(async instance => {
      const { docViewer, annotManager, Annotations } = instance;
      setInstance(instance);
      setAnnotatManager(annotManager);

      // load document
      const storageRef = storage.ref();
      const URL = await storageRef.child(docRef).getDownloadURL();
      instance.docViewer.loadDocument(URL);

      const normalStyles = (widget) => {
        if (widget instanceof Annotations.TextWidgetAnnotation) {
          return {
            'background-color': '#a5c7ff',
            color: 'white',
            'font-size': '20px',
          };
        } else if (widget instanceof Annotations.SignatureWidgetAnnotation) {
          return {
            border: '1px solid #a5c7ff',
          };
        }
      };

      annotManager.on('annotationChanged', (annotations, action, { imported }) => {
        if (imported && action === 'add') {
          annotations.forEach(function(annot) {
            if (annot instanceof Annotations.WidgetAnnotation) {
              console.log(annot);
              if (!annot.fieldName.startsWith(email)) {
                annot.fieldFlags.set('ReadOnly', true);
                Annotations.WidgetAnnotation.getCustomStyles = normalStyles;
              }
            }
          });
        }
      });
    });
  }, []);

  const nextField = () => {
    let annots = annotManager.getAnnotationsList();
    if (annots[annotPosition] && !annots[annotPosition].ReadOnly) {
      annotManager.jumpToAnnotation(annots[annotPosition]);
      if (annots[annotPosition+1]) {
        setAnnotPosition(annotPosition+1);
      }
    }
  }

  const prevField = () => {
    let annots = annotManager.getAnnotationsList();
    if (annots[annotPosition] && !annots[annotPosition].ReadOnly) {
      annotManager.jumpToAnnotation(annots[annotPosition]);
      if (annots[annotPosition-1]) {
        setAnnotPosition(annotPosition-1);
      }
    }
  }

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
                  <Button
                    onClick={nextField}
                    accessibilityLabel="next field"
                    text="Next field"
                    iconEnd="arrow-forward"
                  />
                </Box>
                <Box padding={2}>
                  <Button
                    onClick={prevField}
                    accessibilityLabel="Previous field"
                    text="Previous field"
                    iconEnd="arrow-back"
                  />
                </Box>
                <Box padding={2}>
                  <Button
                    onClick={() => {}}
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
