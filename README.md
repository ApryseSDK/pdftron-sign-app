# Vue template with Firebase auth and hosting

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
<br>
<br>
<br>

## Additional steps

Update name in package.json (this shows at page title until component loaded)

Install firebase tools if not already

```
npm install -g firebase-tools
```

Add email/password auth in Firebase console and create test user

Update src/firebase.js with firebase config settings

Remove firebase.json and .firebaserc file if hosting not required

Update .firebaserc file for project name if using hosting
