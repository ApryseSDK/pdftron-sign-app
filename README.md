# PDFTron Sign App

PDFTron Sign App demonstrates building a signing application where users can request signatures on the documents by placing fields, sign documents, review signed documents using [PDFTron PDF SDK](https://www.pdftron.com).

This repo is designed to help getting started in creating your own signing workflow.

## Install

```
npm install
```

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

Now you can run the application and start requesting signatures.

## Run

```
npm start
```

## Build

```
npm run build
```

## Project structure

```
src/
  app/             - Redux Store Configuration
  components/      - React components
    Assign/              - Add users to a document that needs to be signed 
    Firebase/            - Firebase configuration for authentication, updating documents, storing PDFs
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
  tools/           - Helper function to copy over PDFTron dependencies into /public on post-install
```

## API documentation

See [API documentation](https://www.pdftron.com/documentation/web/guides/ui/apis).

## Contributing

See [contributing](./CONTRIBUTING.md).

## License

See [license](./LICENSE).
![](https://onepixel.pdftron.com/webviewer-ui)
