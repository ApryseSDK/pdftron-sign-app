<template>
  <v-skeleton-loader
    v-if="loading"
    type="list-item-avatar-two-line, list-item-avatar-two-line, list-item-avatar-two-line"
  ></v-skeleton-loader>
  <v-data-table
    v-else
    :headers="headers"
    :items="docs"
    :hide-default-footer="true"
    class="elevation-1"
  >
    <template v-slot:item="props">
      <tr>
        <td>{{ props.item.email }}</td>
        <td>
          {{
            props.item.requestedTime
              ? new Date(props.item.requestedTime.seconds * 1000).toDateString()
              : ""
          }}
        </td>
        <td>
          <v-btn @click="signDocument(props.item)" color="primary"
            ><v-icon left dark> mdi-pencil-ruler </v-icon>Sign</v-btn
          >
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { searchForDocumentToSign } from "@/firebase";

export default {
  name: "SignList",
  data() {
    return {
      headers: [
        {
          text: "From",
          align: "start",
          sortable: false,
        },
        {
          text: "When",
          align: "start",
          sortable: false,
        },
        {
          text: "Action",
          align: "start",
          sortable: false,
        },
      ],
      docs: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    email() {
      return this.user.email;
    },
  },
  methods: {
    ...mapActions(["setDocToSign"]),
    getDocs() {
      this.loading = true;
      searchForDocumentToSign(this.user.email).then((docsToSign) => {
        this.docs = docsToSign;
        this.loading = false;
      });
    },
    signDocument(doc) {
      const { docRef, docId } = doc;
      this.setDocToSign({ docRef, docId });
      this.$router.push({ name: "SignDocument" });
    },
  },
  mounted() {
    this.getDocs();
  },
};
</script>
  