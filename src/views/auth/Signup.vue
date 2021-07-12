<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-alert v-if="loading" type="info" class="mt-3">
            Loading...
          </v-alert>
          <template v-else>
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>PDFTron Sign App</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <h2 class="text-center">Sign Up</h2>
              <v-alert v-if="errorMessage" type="error" class="mt-3">
                {{ errorMessage }}
              </v-alert>
              <v-form @submit.prevent="send">
                <v-text-field
                  label="Name"
                  name="name"
                  prepend-icon="mdi-account-box"
                  type="text"
                  required
                  v-model="name"
                  autofocus
                ></v-text-field>
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="email"
                  required
                  v-model="email"
                ></v-text-field>
                <v-text-field
                  label="Password"
                  name="password"
                  prepend-icon="mdi-key"
                  type="password"
                  required
                  v-model="password"
                  autocomplete
                ></v-text-field>
                <v-btn block type="submit" color="primary">
                  <v-icon left dark> mdi-account-plus </v-icon>
                  Sign Up
                </v-btn>
              </v-form>
              <p class="my-2 text-center">
                - - - - - - - - - - - - or - - - - - - - - - - - -
              </p>
              <v-btn
                block
                type="button"
                @click="signInWithGoogleProvider"
                class="mb-2"
                color="success"
              >
                <v-icon left dark> mdi-google-plus </v-icon>
                Sign in with Google
              </v-btn>
              <p>
                Have already an account?
                <router-link to="/login">Sign In</router-link>
              </p>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth, signInWithGoogle, generateUserDocument } from "@/firebase";

export default {
  name: "SignUp",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      errorMessage: false,
      loading: false,
    };
  },
  mounted() {},
  methods: {
    send() {
      // const actionCodeSettings = {
      //   // URL you want to redirect back to. The domain (www.example.com) for this
      //   // URL must be in the authorized domains list in the Firebase Console.
      //   url: window.location.href,
      //   // This must be true.
      //   handleCodeInApp: true,
      // };
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(({ user }) => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          generateUserDocument(user, { displayName: this.name });
          window.localStorage.setItem("emailForSignIn", this.email);
          this.$router.push({ name: "home" });
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    signInWithGoogleProvider() {
      signInWithGoogle().then(() => {
        this.$router.push({ name: "home" });
      });
    },
  },
};
</script>
