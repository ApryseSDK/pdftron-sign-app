import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from '@reach/router';
import { Box, Column, Heading, Row, Stack, Button } from 'gestalt';
import { selectDocToSign, resetDocToSign } from './SignDocumentSlice';
import { storage, updateDocumentToSign } from '../Firebase/firebase';
import { selectUser } from '../Firebase/firebaseSlice';
import WebViewer from '@pdftron/webviewer';
import 'gestalt/dist/gestalt.css';
import './SignDocument.css';

const SignDocument = () => {
  const [instance, setInstance] = useState(null);
  const [annotManager, setAnnotatManager] = useState(null);
  const [annotPosition, setAnnotPosition] = useState(0);

  const dispatch = useDispatch();

  const doc = useSelector(selectDocToSign);
  const user = useSelector(selectUser);
  const { docRef, docId } = doc;
  const { email } = user;

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
      console.log(URL);
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
              Annotations.WidgetAnnotation.getCustomStyles = normalStyles;
              if (!annot.fieldName.startsWith(email)) {
                annot.Hidden = true;
                annot.Listable = false;
              }
            }
          });
        }
      });
    });
  }, []);

  const nextField = () => {
    let annots = annotManager.getAnnotationsList();
    if (annots[annotPosition]) {
      annotManager.jumpToAnnotation(annots[annotPosition]);
      if (annots[annotPosition+1]) {
        setAnnotPosition(annotPosition+1);
      }
    }
  }

  const prevField = () => {
    let annots = annotManager.getAnnotationsList();
    if (annots[annotPosition]) {
      annotManager.jumpToAnnotation(annots[annotPosition]);
      if (annots[annotPosition-1]) {
        setAnnotPosition(annotPosition-1);
      }
    }
  }

  const completeSigning = async () => {
    const xfdf = await annotManager.exportAnnotations({ widgets: false, links: false });
    await updateDocumentToSign(docId, email, xfdf);
    dispatch(resetDocToSign);
    navigate('/');
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
                    onClick={completeSigning}
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
