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
        <td>
          <p
            v-for="(email, index) of props.item.emails"
            :key="index"
            class="mt-2 mb-2"
          >
            {{ email }}
          </p>
        </td>
        <td>
          {{
            props.item.signedTime
              ? new Date(props.item.signedTime.seconds * 1000).toDateString()
              : ""
          }}
        </td>
        <td>
          <v-btn color="primary" @click="viewDocument(props.item)"
            ><v-icon left dark> mdi-eye </v-icon>View</v-btn
          >
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { searchForDocumentsSigned } from "@/firebase";

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
    ...mapActions(["setDocToView"]),
    getDocs() {
      this.loading = true;
      searchForDocumentsSigned(this.user.email).then((docsToSign) => {
        this.docs = docsToSign;
        console.log(this.docs);
        this.loading = false;
      });
    },
    viewDocument(doc) {
      const { docRef, docId } = doc;
      this.setDocToView({ docRef, docId });
      this.$router.push({ name: "ViewDocument" });
    },
  },
  mounted() {
    this.getDocs();
  },
};
</script>
  