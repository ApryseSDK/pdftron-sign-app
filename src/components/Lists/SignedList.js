import React, { useEffect, useState } from 'react';
import { Button, Table, Text } from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { useSelector, useDispatch } from 'react-redux';
import { searchForDocumentsSigned } from '../Firebase/firebase';
import { setDocsSigned, selectUser, selectSignedDocs } from '../Firebase/firebaseSlice';
import { setDocToView } from '../ViewDocument/ViewDocumentSlice';
import { navigate } from '@reach/router';

const SignedList = () => {
  const user = useSelector(selectUser);
  const { email } = user;
  const [docs, setDocs] = useState([]);
  
  const dispatch = useDispatch(); 

  useEffect(() => {
      async function getDocs() {
        const docsToView = await searchForDocumentsSigned(email);
        console.log(docsToView);
        setDocs(docsToView);
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
                  <Text>{doc.emails}</Text>
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
      ) : (
        'You do not have any documents to review'
      )}
    </div>
  );
};

export default SignedList;
