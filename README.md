# PDFTron Sign App

PDFTron Sign App demonstrates building a signing application where users can request signatures on the documents by placing fields, sign documents, review signed documents using [PDFTron PDF SDK](https://www.pdftron.com).

This repo is designed to help getting started in creating your own signing workflow.

## Install

```
npm install
```

This application uses Firebase to store PDFs, and data for signatures. You can use any other backend of your choice. 
However, to get started with this sample, please register a new app with [Firebase](https://firebase.google.com/).

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
  apis/            - APIs exposed in myWebViewer.getInstance()
  components/      - React components
  constants/       - JavaScript or CSS constants
  core/            - APIs from the Core
  event-listeners/ - Listeners for the Core events
  helpers/         - Reused functions
  redux/           - Redux files for state managing
  lib/             - Lib folder created upon npm install, used for dev testing only
```

## API documentation

See [API documentation](https://www.pdftron.com/documentation/web/guides/ui/apis).

## Contributing

See [contributing](./CONTRIBUTING.md).

## License

See [license](./LICENSE).
![](https://onepixel.pdftron.com/webviewer-ui)
