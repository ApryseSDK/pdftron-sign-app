import React, {
  useEffect,
  useState,
} from 'react';
import {
  Button,
  Table,
  Text,
  Spinner,
} from 'gestalt';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../firebase/firebaseSlice';
import { setDocToView } from '../ViewDocument/ViewDocumentSlice';
import { searchForSignedDocumentsSigned } from '../../firebase/firebase';
import { navigate } from '@reach/router';

const SignerPastSigned = () => {
  const user = useSelector(selectUser);
  const { email } = user;
  const [pastSignedDocs, setPastSignedDocs] = useState([]);
  const [apiCallPending, setApiCallPending] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getPastSignedDocs() {
      const pastSignedDocs = await searchForSignedDocumentsSigned(email);
      console.log(pastSignedDocs);
      setApiCallPending(false); 
      setPastSignedDocs(pastSignedDocs);
    }
    setTimeout(getPastSignedDocs, 1000);
  }, [email]);

  if (apiCallPending) {
    return (
      <Spinner show={apiCallPending} accessibilityLabel="spinner" />
    );
  }

  return (
    <div>
      {
        !pastSignedDocs.length
        && 'There are no documents that were previously signed.'
      }
      {
        pastSignedDocs.length
        && (
          <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <Text weight="bold">Signed By</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Created By</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Date Created</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Date Finalized</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {pastSignedDocs.map(doc => (
                  <Table.Row key={doc.docRef}>
                    <Table.Cell>
                      {
                        doc.emails.map((email, idx) => (
                          <Text key={`${doc.docId}_signed_by_email_${idx}`}>
                            {email}
                          </Text>
                        ))
                      }
                    </Table.Cell>
                    <Table.Cell>
                      {
                        /**
                         * @todo @andrey Can we add the email address of the
                         * person who requested the document to be signed?
                         */
                      }
                    </Table.Cell>
                    <Table.Cell>
                      {
                        /**
                         * @todo @andrey Can we add a Date for when the document
                         * was initially created? (i.e. the Requestor sent out
                         * the document for signing)
                         */
                      }
                    </Table.Cell>
                    <Table.Cell>
                    {
                        (() => {
                          const { signedTime } = doc;
                          if (!signedTime) {
                            return null;
                          }
                          const dateObj = new Date(signedTime.seconds * 1000);
                          return (
                            <>
                              <Text size="md">{dateObj.toDateString()}</Text>
                              <Text size="sm">{dateObj.toLocaleTimeString()}</Text>
                            </>
                          );
                        })()
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        onClick={event => {
                          const { docRef, docId } = doc;
                          dispatch(setDocToView({ docRef, docId }));
                          navigate(`/viewDocument`);
                        }}
                        text="View"
                        color="blue"
                        inline
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
        )
      }
    </div>
  );
};

export default SignerPastSigned;
