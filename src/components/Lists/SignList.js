import React, { useEffect, useState } from 'react';
import { Button, Table, Text } from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { useDispatch, useSelector } from 'react-redux';
import { searchForDocumentToSign } from '../Firebase/firebase';
import { selectUser } from '../Firebase/firebaseSlice';
import { setDocToSign } from '../SignDocument/SignDocumentSlice';
import { navigate } from '@reach/router';

const SignList = () => {
  const user = useSelector(selectUser);
  const { email } = user;

  const [docs, setDocs] = useState([]);
  
  const dispatch = useDispatch(); 

  useEffect(() => {
      async function getDocs() {
        const docsToSign = await searchForDocumentToSign(email);
        console.log(docsToSign);
        setDocs(docsToSign);
      }
    
      getDocs();
  }, []);

  return (
    <div>
      {docs.length > 0 ? (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Text weight="bold">From</Text>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {docs.map(doc => (
              <Table.Row key={doc.docRef}>
                <Table.Cell>
                  <Text>{doc.email}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={event => {
                      const { docRef, docId } = doc;
                      dispatch(setDocToSign({ docRef, docId }));
                      navigate(`/signDocument`);
                    }}
                    text="Sign"
                    color="blue"
                    inline
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        'You do not have any documents to sign'
      )}
    </div>
  );
};

export default SignList;
