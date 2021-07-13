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
              <h2 class="text-center">Sign In</h2>
              <v-alert v-if="errorMessage" type="error" class="mt-3">
                {{ errorMessage }}
              </v-alert>
              <v-form @submit.prevent="send">
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="email"
                  required
                  v-model="email"
                  autofocus
                ></v-text-field>
                <v-text-field
                  label="password"
                  name="password"
                  prepend-icon="mdi-key"
                  type="password"
                  required
                  v-model="password"
                  autocomplete
                ></v-text-field>
                <v-btn block type="submit" color="primary">
                  <v-icon left dark> mdi-login-variant </v-icon>
                  Sign In
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
                Don't have an account?
                <router-link to="/sign-up">Sign Up</router-link>
              </p>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth, signInWithGoogle } from "@/firebase";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: false,
      loading: false,
    };
  },
  mounted() {},
  methods: {
    send() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
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
