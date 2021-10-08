import React, {
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../firebase/firebaseSlice';
import { searchForWaitingOnOthersDocuments } from '../../firebase/firebase';

const PendingOthers = () => {
  const user = useSelector(selectUser);
  const { email } = user;
  const [docsWaitingOnOthers, setDocsWaitingOnOthers] = useState([]);

  useEffect(() => {
    async function getDocs() {
      /**
       * @todo @andrey Fix query for searchForWaitingOnOthersDocuments
       */
      // const waitingOnOthers = await searchForWaitingOnOthersDocuments(email);
      // setDocsWaitingOnOthers(waitingOnOthers);
    }
    setTimeout(getDocs, 1000);
  }, [email]);

  return (
    <div>
      {
        !docsWaitingOnOthers.length
        && 'There are no documents pending other signers'
      }
    </div>
  );
};

export default PendingOthers;
