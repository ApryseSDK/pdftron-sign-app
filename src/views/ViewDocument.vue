<template>
  <div class="home">
    <v-container>
      <h1>View Document</h1>
      <div
        class="webviewer"
        id="webviewer"
        ref="viewer"
        style="margin-right: 260px"
      ></div>
      <v-navigation-drawer absolute permanent right>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-btn @click="download" class="text-none mt-1" color="primary">
                Download PDF
                <v-icon right dark> mdi-download </v-icon>
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-btn
                class="text-none"
                @click="doneViewing"
                color="success"
                block
              >
                Close
                <v-icon right dark> mdi-close </v-icon>
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import WebViewer from "@pdftron/webviewer";
import { storage } from "@/firebase";

export default {
  metaInfo() {
    return {
      title: "PDFTron Sign App - View Signed Document",
    };
  },
  components: {},
  data() {
    return {
      instance: null,
    };
  },
  computed: {
    ...mapGetters(["docToView", "user"]),
  },
  methods: {
    download() {
      this.instance.downloadPdf(true);
    },
    async doneViewing() {
      this.$router.push({ name: "Signed" });
    },
  },
  mounted() {
    WebViewer(
      {
        path: "webviewer",
        disabledElements: ["ribbons", "toggleNotesButton", "contextMenuPopup"],
      },
      this.$refs.viewer
    ).then(async (instance) => {
      // select only the view group
      instance.setToolbarGroup("toolbarGroup-View");

      this.instance = instance;

      // load document
      const storageRef = storage.ref();
      const URL = await storageRef
        .child(this.docToView.docRef)
        .getDownloadURL();
      console.log(URL);
      instance.docViewer.loadDocument(URL);
    });
    if (!this.docToView) {
      this.$router.push({ name: "Signed" });
    }
  },
};
</script>

<style>
.webviewer {
  height: calc(100vh - 180px);
}
</style>