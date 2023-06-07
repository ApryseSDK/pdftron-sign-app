import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import { mergeAnnotations } from '../components/MergeAnnotations/MergeAnnotations';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const sendEmailAuthLink = (docRef, docId, email) => {
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: `https://pdftron-sign-app.web.app/?docRef=${docRef}&docId=${docId}`,
    handleCodeInApp: true,
  };

  // const actionCodeSettings = {
  //   // URL you want to redirect back to. The domain (www.example.com) for this
  //   // URL must be in the authorized domains list in the Firebase Console.
  //   url: `http://localhost:3000/?docRef=${docRef}&docId=${docId}`,
  //   handleCodeInApp: true,
  // };
  
  firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
  .then(() => {
    console.log(`Auth link is now sent: ${email}`);
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(`Sending auth link failed: ${error.message}`);
  });
}

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user document', error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error('Error fetching user', error);
  }
};

// Requestor Role

export const addDocumentToSign = async (uid, email, docRef, emails) => {
  if (!uid) return;
  const signed = false;
  const xfdf = [];
  const signedBy = [];
  const requestedTime = new Date();
  const lastUpdated = new Date();
  const signedTime = '';
  const docId = await firestore
    .collection('documentsToSign')
    .add({
      uid,
      email,
      docRef,
      emails,
      xfdf,
      signedBy,
      signed,
      requestedTime,
      signedTime,
      lastUpdated,
    });

  return docId;
};

export const updateDocumentToSign = async (docId, email, xfdfSigned) => {
  const documentRef = firestore.collection('documentsToSign').doc(docId);
  let signedByAll = false;
  try {
    const doc = await documentRef.get();
    if (doc.exists) {
      const { signedBy, emails, xfdf, docRef } = doc.data();
      if (!signedBy.includes(email)) {
        const signedByArray = [...signedBy, email];
        const xfdfArray = [...xfdf, xfdfSigned];
        const time = new Date();
        await documentRef.update({
          xfdf: xfdfArray,
          signedBy: signedByArray,
          lastUpdated: time,
        });

        if (signedByArray.length === emails.length) {
          
          await documentRef.update({
            signed: true,
            signedTime: time,
          });

          signedByAll = true;
          mergeAnnotations(docRef, xfdfArray);
        }
      }
    } else {
      console.log('No such document!');
    }
  } catch (error) {
    console.log('Error getting document:', error);
  }

  return signedByAll;
};

/**
 * Requestor: All completed documents they requested
 */
export const searchForSignedDocumentsRequested = async (email) => {
  const documentsRef = firestore.collection('documentsToSign');

  const docIds = [];

  let queryForRequestedDocs = documentsRef
    .where('email', '==', email)
    .where('signed', '==', true);

  await queryForRequestedDocs
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const { docRef, emails, signedTime } = doc.data();
        const docId = doc.id;
        docIds.push({ docRef, emails, signedTime, docId });
      });
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error);
    });

  return docIds;
};

/**
 * Requestor: All pending documents
 */
export const searchForDocumentToSignPending = async (email) => {
  const documentsRef = firestore.collection('documentsToSign');
  const query = documentsRef
    .where('email', 'array-contains', email)
    .where('signed', '==', false);

  const querySigned = documentsRef.where('signedBy', 'array-contains', email);

  const docIds = [];
  const docIdSigned = [];

  await querySigned
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const docId = doc.id;
        docIdSigned.push(docId);
      });
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error);
    });

  await query
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const { docRef, email, requestedTime } = doc.data();
        const docId = doc.id;
        if (!docIdSigned.includes(docId)) {
          docIds.push({ docRef, email, requestedTime, docId });
        }
      });
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error);
    });
  return docIds;
};

// Signer Role

/**
 * Signer: All documents waiting to sign
 */
export const searchForDocumentToSign = async (email) => {
  const documentsRef = firestore.collection('documentsToSign');
  const query = documentsRef
    .where('emails', 'array-contains', email)
    .where('signed', '==', false);

  const querySigned = documentsRef.where('signedBy', 'array-contains', email);

  const docIds = [];
  const docIdSigned = [];

  await querySigned
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const docId = doc.id;
        docIdSigned.push(docId);
      });
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error);
    });

  await query
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const { docRef, email, requestedTime } = doc.data();
        const docId = doc.id;
        if (!docIdSigned.includes(docId)) {
          docIds.push({ docRef, email, requestedTime, docId });
        }
      });
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error);
    });
  return docIds;
};

/**
 * Signer: All their completed documents
 */
export const searchForSignedDocumentsSigned = async (email) => {
  const documentsRef = firestore.collection('documentsToSign');

  const docIds = [];

  let queryForSignedDocs = documentsRef
    .where('emails', 'array-contains', email)
    .where('signed', '==', true);

  await queryForSignedDocs
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const { docRef, emails, email, signedTime, requestedTime } = doc.data();
        const docId = doc.id;
        docIds.push({ docRef, emails, email, requestedTime, signedTime, docId });
      });
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error);
    });

  return docIds;
};

/**
 * Signer: All waiting on others documents
 */
export const searchForWaitingOnOthersDocuments = async (email) => {
  const documentsRef = firestore.collection('documentsToSign');

  const docIds = [];

  let queryForSignedDocs = documentsRef
    .where('emails', 'array-contains', email)
    .where('signed', '==', false);

  await queryForSignedDocs
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        const { docRef, emails, email: preparedBy, signedTime, requestedTime, signedBy, lastUpdated } = doc.data();
        if (signedBy.includes(email)) {
          const docId = doc.id;
          const remainingToSign = emails.filter(
            (email) => !signedBy.includes(email)
          );
          docIds.push({ docRef, emails, signedTime, docId, remainingToSign, lastUpdated });
        }
      });
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error);
    });

  return docIds;
};
