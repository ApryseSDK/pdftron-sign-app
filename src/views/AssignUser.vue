<template>
  <div class="home">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Who needs to sign?</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <v-alert v-model="alert" dismissible type="error" class="mt-3">
            {{ errorMessage }}
          </v-alert>
          <v-form @submit.prevent="addUser">
            <v-text-field
              label="Name"
              name="name"
              prepend-icon="mdi-account-box"
              type="text"
              required
              v-model="displayName"
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
            <v-btn class="float-right" type="submit" color="primary">
              <v-icon left dark> mdi-account-multiple-plus </v-icon>
              Add User
            </v-btn>
          </v-form>
        </v-col>
        <v-col cols="1"></v-col>
        <v-col cols="6">
          <v-data-table
            :headers="headers"
            :items="signees"
            :hide-default-footer="true"
            class="elevation-1"
          >
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn @click="continuePrepare" class="float-right" color="primary">
            Continue
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  metaInfo() {
    return {
      title: "PDFTron Sign App - Prepare Document",
    };
  },
  components: {},
  data() {
    return {
      displayName: "",
      alert: false,
      email: "",
      errorMessage: "",
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: "Email",
          align: "start",
          sortable: false,
          value: "email",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["signees"]),
  },
  methods: {
    ...mapActions(["addSignee"]),
    addUser() {
      const key = `${new Date().getTime()}${this.email}`;
      const { displayName, email } = this;
      if (!displayName) {
        this.errorMessage = "User name field is required.";
        this.alert = true;
        return;
      }
      if (!email) {
        this.errorMessage = "User email field is required.";
        this.alert = true;
        return;
      }
      this.addSignee({ key, name: displayName, email });
      this.displayName = "";
      this.email = "";
      this.errorMessage = "";
      this.alert = false;
    },
    continuePrepare() {
      if (!this.signees.length) {
        this.errorMessage = "You have to add one or more users.";
        this.alert = true;
        return;
      }
      this.$router.push({ name: "Docuement" });
    },
  },
};
</script>
