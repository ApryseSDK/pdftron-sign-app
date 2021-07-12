import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage';

import { mergeAnnotations } from '@/components/MergeAnnotations/MergeAnnotations';

const config = {
  apiKey: "AIzaSyChK8f0e-R5DfsYVlcovsj16mZUAlq3rHY",
  authDomain: "pdftron-sign-app1.firebaseapp.com",
  projectId: "pdftron-sign-app1",
  storageBucket: "pdftron-sign-app1.appspot.com",
  messagingSenderId: "740843792950",
  appId: "1:740843792950:web:e8ea27d348dcc9cdd20697",
  measurementId: "G-BBBB8HSK20"
};

firebase.initializeApp(config);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();

const signInWithGoogle = () => {
  return auth.signInWithPopup(provider);
};

const generateUserDocument = async (user, additionalData) => {
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

const getUserDocument = async uid => {
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

const searchForDocumentToSign = async email => {
  const documentsRef = firestore.collection('documentsToSign');
  const query = documentsRef
    .where('emails', 'array-contains', email)
    .where('signed', '==', false);

  const querySigned = documentsRef
    .where('signedBy', 'array-contains', email);

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

const searchForDocumentsSigned = async email => {
  const documentsRef = firestore.collection('documentsToSign');

  const docIds = [];

  let query = documentsRef
    .where('email', '==', email)
    .where('signed', '==', true);

  await query
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

const addDocumentToSign = async (uid, email, docRef, emails) => {
  if (!uid) return;
  const signed = false;
  const xfdf = [];
  const signedBy = [];
  const requestedTime = new Date();
  const signedTime = '';
  firestore
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
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(function (error) {
      console.error('Error adding document: ', error);
    });
};

const updateDocumentToSign = async (docId, email, xfdfSigned) => {
  const documentRef = firestore.collection('documentsToSign').doc(docId);
  documentRef
    .get()
    .then(async doc => {
      if (doc.exists) {
        const { signedBy, emails, xfdf, docRef } = doc.data();
        if (!signedBy.includes(email)) {
          const signedByArray = [...signedBy, email];
          const xfdfArray = [...xfdf, xfdfSigned];
          await documentRef.update({
            xfdf: xfdfArray,
            signedBy: signedByArray,
          });

          if (signedByArray.length === emails.length) {
            const time = new Date();
            await documentRef.update({
              signed: true,
              signedTime: time,
            });

            mergeAnnotations(docRef, xfdfArray);
          }
        }
      } else {
        console.log('No such document!');
      }
    })
    .catch(function (error) {
      console.log('Error getting document:', error);
    });
};

export {
  auth,
  firestore,
  storage,
  signInWithGoogle,
  generateUserDocument,
  searchForDocumentToSign,
  searchForDocumentsSigned,
  addDocumentToSign,
  updateDocumentToSign
};
