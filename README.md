# PDFTron Sign App

PDFTron Sign App demonstrates building a signing application where users can request signatures on the documents by placing fields, sign documents, review signed documents using [PDFTron PDF SDK](https://www.pdftron.com).

Watch the video here:
[![image](https://img.youtube.com/vi/tSpYY8IenJw/maxresdefault.jpg)](https://youtu.be/tSpYY8IenJw)

This repo is designed to help to get started in creating your own signing workflow.

## What is new in the latest release

[Watch a quick recap](https://youtu.be/Q6-8s9uAe1s)

- Ability to add date fields
- Ability to see when the document was requested and signed
- Update WebViewer to 7.2

## Install

[Watch this quick video to setup this project](https://youtu.be/R5zBs28_TVQ).

```
npm install
```

## Firebase Configuration

This application uses Firebase to store PDFs and data for signatures. You can use any other backend of your choice. 
However, to get started with this sample, please register a new app with [Firebase](https://firebase.google.com/).

After you have registered an app, create `.env` file in the root of the directory and place the following:

```
REACT_APP_API_KEY=your_key_goes_here
REACT_APP_MESSAGING_SENDER_ID=your_key_goes_here
REACT_APP_APP_ID=your_key_goes_here
REACT_APP_AUTH_DOMAIN=your_domain_goes_here
REACT_APP_DATABASE_URL=your_database_go_here
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
```
The above information can be found under settings of your Firebase app.
![Screenshot](https://github.com/PDFTron/pdftron-sign-app/blob/master/firebase.png)

Make sure you create a storage bucket, and enable authentication for email and Google.
![Screenshot](https://github.com/PDFTron/pdftron-sign-app/blob/master/firebase_authentication.png)

After you have your storage bucket and Firestore setup give authenticated users read and write permissions.

Rules for storage which will host your PDF documents.
![Screenshot](https://github.com/PDFTron/pdftron-sign-app/blob/master/firebase-storage-rules.png)

Rules for Firestore which will host document signing metadata.
![Screenshot](https://github.com/PDFTron/pdftron-sign-app/blob/master/firebase-firestore-rules.png)

Change `Firestore Database` rules to:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Change `Storage` rules to:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Now you can run the application and start requesting signatures.

## CORS

You will need to set up CORS on your Firestore to allow WebViewer to access files stored in your bucket. I created a CORS file called `cors.json`: 

```
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

And then used gsutil to update it:
https://cloud.google.com/storage/docs/configuring-cors

The walkthrough recommends siging up for billing but that is not necessary to use this demo.

## Run

```
npm start
```

## Project structure

```
src/
  app/             - Redux Store Configuration
  components/      - React components
    Assign/              - Add users to a document that needs to be signed 
    Lists/               - List components to list files for signing and review
    MergeAnnotations/    - Merge all signatures and flatten them onto a PDF 
    PasswordReset/       - Reset password
    PrepareDocument/     - Drag and drop signatures, text fields onto a PDF to prepare it for signing
    Profile/             - Profile information and a sign out button
    SignDocument/        - Sign PDF
    SignIn/              - Sign in
    SignUp/              - Sign up
    ViewDocument/        - Review document after signing
    AssignUsers          - Component combines Profile and Assign
    Header               - Header when the user is not logged in
    Preparation          - Component combines Profile and PrepareDocument
    Sign                 - Component combines Profile and SignDocument
    View                 - Component combines Profile and ViewDocument
    Welcome              - Component combines Profile, SignList, Preparation, SignedList
  App              - Configuration for navigation, authentication
  index            - Entry point and configuration for React-Redux
  firebase/        - Firebase configuration for authentication, updating documents, storing PDFs
  tools/           - Helper function to copy over PDFTron dependencies into /public on post-install
```

## Firebase Document Structure

```
docRef: docToSign/c4Y72M0d0pZx3476jxJFxrFA3Qo21593036106369.pdf"
email: "andrey@email.com"
emails: ["julia@email.com"]
signed: true
signedBy: ["julia@email.com"]
requestedTime: July 17, 2020 at 12:01:24 PM UTC-7
signedTime: July 17, 2020 at 12:01:24 PM UTC-7
uid: "c4Y72M0d0pZx3476jxJFxrFA3Qo2"
xfdf: ["<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">...</xfdf>"]
 ```
 
- docRef - string - storage reference to the actual PDF
- email - string - email of the requestor of the signature
- emails - an array of strings - users to sign the document
- signed - boolean - value for whether or not all users have signed the document (gets determined by checking lengths of emails array and xfdf array)
- requestedTime - TimeStamp - value for when the signature was requested
- signedTime - TimeStamp - value for when the document was signed
- uid - string - unique identifier for the requestor of the signature
- xfdf - an array of strings - signature appearance/form field values for each user

## API documentation

See [API documentation](https://www.pdftron.com/documentation/web/guides/ui/apis).

## License

See [license](./LICENSE).
![](https://onepixel.pdftron.com/webviewer-ui)
