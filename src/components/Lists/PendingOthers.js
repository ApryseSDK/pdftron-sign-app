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
import { searchForWaitingOnOthersDocuments } from '../../firebase/firebase';
import { navigate } from '@reach/router';

const PendingOthers = () => {
  const user = useSelector(selectUser);
  const { email } = user;
  const [docsWaitingOnOthers, setDocsWaitingOnOthers] = useState([]);
  const [apiCallPending, setApiCallPending] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    async function getDocs() {
      const waitingOnOthers = await searchForWaitingOnOthersDocuments(email);
      setDocsWaitingOnOthers(waitingOnOthers);
      setApiCallPending(false);
    }
    setTimeout(getDocs, 1000);
  }, [email]);

  if (apiCallPending) {
    return (
      <Spinner show={apiCallPending} accessibilityLabel="spinner" />
    );
  }

  return (
    <div>
      {
        !docsWaitingOnOthers.length
        && 'There are no documents pending other signers'
      }
      {
        docsWaitingOnOthers.length
        && (
          <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <Text weight="bold">Signed By</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Awaiting Signatures</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Created By</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Date Created</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Text weight="bold">Last Signed</Text>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {docsWaitingOnOthers.map(doc => (
                  <Table.Row key={doc.docRef}>
                    <Table.Cell>
                      {doc.emails.filter(email => !doc.remainingToSign.includes(email)).map(email => (
                        <Text key={email}>{email}</Text>
                      ))}
                    </Table.Cell>
                    <Table.Cell>
                      {
                        doc.remainingToSign.map((remainingEmail, idx) => (
                          <Text key={`${doc.docId}_remaining_emails_${idx}`}>
                            {remainingEmail}
                          </Text>
                        ))
                      }
                    </Table.Cell>
                    {
                      /**
                       * @todo @andrey
                       * Can we get the Requestor and the DateTime of when the
                       * document was prepared?
                       */
                    }
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell>
                      {
                        (() => {
                          const { lastUpdated } = doc;
                          if (!lastUpdated) {
                            return null;
                          }
                          const dateObj = new Date(lastUpdated.seconds * 1000);
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

export default PendingOthers;