import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { navigate } from '@reach/router';
import { Box, Column, Heading, Button } from 'gestalt';
import { selectDocToSign } from './SignDocumentSlice';
import { storage, updateDocumentToSign } from '../../firebase/firebase';
import { selectUser } from '../../firebase/firebaseSlice';
import { sendDocumentSigned } from '../../email/email';
import WebViewer from '@pdftron/webviewer';
import 'gestalt/dist/gestalt.css';
import './SignDocument.css';

const SignDocument = () => {
  const [instance, setInstance] = useState(null);
  const [annotationManager, setAnnotatManager] = useState(null);
  const [annotPosition, setAnnotPosition] = useState(0);
  const [annots, setAnnots] = useState([]);
  const [completedAnnots, setCompletedAnnots] = useState([]);

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
          'ribbons',
          'toggleNotesButton',
          'searchButton',
          'menuButton',
          'rubberStampToolGroupButton',
          'stampToolGroupButton',
          'fileAttachmentToolGroupButton',
          'calloutToolGroupButton',
          'undo',
          'redo',
          'eraserToolButton'
        ],
      },
      viewer.current,
    ).then(async instance => {
      setInstance(instance);
      const { documentViewer, annotationManager, Annotations } = instance.Core;
      setAnnotationManager(annotationManager);

      // select only the insert group
      instance.UI.setToolbarGroup('toolbarGroup-Insert');

      // load document
      const storageRef = storage.ref();
      const URL = await storageRef.child(docRef).getDownloadURL();
      documentViewer.loadDocument(URL);

      const normalStyles = (widget) => {
        if (widget instanceof Annotations.TextWidgetAnnotation) {
          return {
            'background-color': '#a5c7ff',
            color: 'white',
          };
        } else if (widget instanceof Annotations.SignatureWidgetAnnotation) {
          return {
            border: '1px solid #a5c7ff',
          };
        }
      };

      documentViewer.addEventListener("annotationsLoaded", () => {
        let widgetAnnots = annotationManager.getAnnotationsList().filter((annot) => annot instanceof Annotations.WidgetAnnotation);
        setAnnots(widgetAnnots.filter((annot) => annot.fieldName.startsWith(email)));
      });

      annotationManager.on('annotationChanged', (annotations, action, { imported }) => {
        if (imported && action === 'add') {
          annotations.forEach(function(annot) {
            if (annot instanceof Annotations.WidgetAnnotation) {
              Annotations.WidgetAnnotation.getCustomStyles = normalStyles;
              if (!annot.fieldName.startsWith(email)) {
                //hide other user's annotations
                annot.Hidden = true;
                annot.Listable = false;
              }
            }
          });
        } else if (action === 'add') {
          annotations.forEach(function (annot) {
            //move completed signature widgets to completed array
            setAnnots(annots => annots.filter(item => item.getX() !== annot.getX() && item.getY() !== annot.getY()));
            setCompletedAnnots(completedAnnots => [...completedAnnots, annot]);
          });
        } else if (action === 'delete') {
          annotations.forEach(function (annot) {
            //remove signature widgets from completed array
            setAnnots((annots) => [...annots, annot]);
            setCompletedAnnots((completedAnnots) => completedAnnots.filter(item => item.getX() !== annot.getX() && item.getY() !== annot.getY()));
          });
        }
      });

      annotationManager.addEventListener('fieldChanged', (field, value) => {
        const fieldAnnot = field.widgets[0];
        if (value && value !== 'm-d-yyyy') {
          //move text/date field to completed array
          setAnnots(annots =>annots.filter(item => item.Id !== fieldAnnot.Id ));
          setCompletedAnnots((completedAnnots) => [...completedAnnots,fieldAnnot]);
        } else {
          //remove text/date field from completed array
          setAnnots(annots => [...annots, fieldAnnot]);
          setCompletedAnnots((completedAnnots) => completedAnnots.filter(item => item.Id !== fieldAnnot.Id()));
        }
      });
    });
  }, [docRef, email]);

  const nextField = () => {
    if (annots[annotPosition]) {
      annotationManager.jumpToAnnotation(annots[annotPosition]);
      if (annots[annotPosition + 1]) {
        setAnnotPosition(annotPosition + 1);
      }
    }
  };

  const prevField = () => {
    if (annots[annotPosition]) {
      annotationManager.jumpToAnnotation(annots[annotPosition]);
      if (annots[annotPosition - 1]) {
        setAnnotPosition(annotPosition - 1);
      }
    }
  };

  const completeSigning = async () => {
    const isValid = annotationManager.getFieldManager().areRequiredFieldsFilled();
    if (annots.length > 0 || !isValid) {
      jumpToMissingField();
      return;
    }

    const xfdf = await annotationManager.exportAnnotations({ widgets: false, links: false });
    const signedByAll = await updateDocumentToSign(docId, email, xfdf);
    if (signedByAll) {
      //sendDocumentSigned()
    }
    navigate('/');
  };

  const jumpToMissingField = () => {
    if(!annots[0]) {
      return;
    }
    instance.UI.showErrorMessage(
      'You must fill all required fields before submitting.'
    );
    annotationManager.jumpToAnnotation(annots[0]);
    setTimeout(() => {
      instance.closeElements(['errorModal']);
    }, 2000);
  };

  return (
    <div className={'prepareDocument'}>
      <Box display="flex" direction="row" flex="grow">
        <Column span={2}>
          <Box padding={3}>
            <Heading size="md">Sign Document</Heading>
          </Box>
          <Box padding={3}>
            <Box padding={2}>
              <div>
                Completed: {completedAnnots.length} / {annots.length + completedAnnots.length} <br/>
              </div>
            </Box>
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
