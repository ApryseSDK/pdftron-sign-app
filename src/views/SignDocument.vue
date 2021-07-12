<template>
  <div class="home">
    <v-container>
      <h1>Sign Document</h1>
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
              <v-btn @click="nextField" class="text-none mt-1" color="primary">
                Next field
                <v-icon right dark> mdi-skip-next </v-icon>
              </v-btn>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-btn @click="prevField" class="text-none mt-1" color="primary">
                Previous field
                <v-icon right dark> mdi-skip-previous </v-icon>
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
                @click="completeSigning"
                color="success"
                block
              >
                Complete Signing
                <v-icon right dark> mdi-pen </v-icon>
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
import { storage, updateDocumentToSign } from "@/firebase";

export default {
  metaInfo() {
    return {
      title: "PDFTron Sign App - Sign Document",
    };
  },
  components: {},
  data() {
    return {
      annotManager: null,
      annotPosition: 0,
    };
  },
  computed: {
    ...mapGetters(["doc", "user"]),
  },
  methods: {
    nextField() {
      let annots = this.annotManager.getAnnotationsList();
      if (annots[this.annotPosition]) {
        this.annotManager.jumpToAnnotation(annots[this.annotPosition]);
        if (annots[this.annotPosition + 1]) {
          this.annotPosition = this.annotPosition + 1;
        }
      }
    },
    prevField() {
      let annots = this.annotManager.getAnnotationsList();
      if (annots[this.annotPosition]) {
        this.annotManager.jumpToAnnotation(annots[this.annotPosition]);
        if (annots[this.annotPosition - 1]) {
          this.annotPosition = this.annotPosition - 1;
        }
      }
    },
    async completeSigning() {
      const xfdf = await this.annotManager.exportAnnotations({
        widgets: false,
        links: false,
      });
      await updateDocumentToSign(this.doc.docId, this.user.email, xfdf);
      this.$router.push("/");
    },
  },
  mounted() {
    WebViewer(
      {
        path: "webviewer",
        disabledElements: [
          "ribbons",
          "toggleNotesButton",
          "searchButton",
          "menuButton",
          "rubberStampToolGroupButton",
          "stampToolGroupButton",
          "fileAttachmentToolGroupButton",
          "calloutToolGroupButton",
          "undo",
          "redo",
          "eraserToolButton",
        ],
      },
      this.$refs.viewer
    ).then(async (instance) => {
      const { docViewer, annotManager, Annotations } = instance;
      this.annotManager = annotManager;

      // select only the insert group
      instance.setToolbarGroup("toolbarGroup-Insert");

      // load document
      const storageRef = storage.ref();
      const URL = await storageRef.child(this.doc.docRef).getDownloadURL();
      docViewer.loadDocument(URL);

      const normalStyles = (widget) => {
        if (widget instanceof Annotations.TextWidgetAnnotation) {
          return {
            "background-color": "#a5c7ff",
            color: "white",
          };
        } else if (widget instanceof Annotations.SignatureWidgetAnnotation) {
          return {
            border: "1px solid #a5c7ff",
          };
        }
      };
      const { email } = this.user;
      annotManager.on(
        "annotationChanged",
        (annotations, action, { imported }) => {
          if (imported && action === "add") {
            annotations.forEach(function (annot) {
              if (annot instanceof Annotations.WidgetAnnotation) {
                Annotations.WidgetAnnotation.getCustomStyles = normalStyles;
                if (!annot.fieldName.startsWith(email)) {
                  annot.Hidden = true;
                  annot.Listable = false;
                }
              }
            });
          }
        }
      );
    });
    if (!this.doc) {
      this.$router.push({ name: "Home" });
    }
  },
};
</script>

<style>
.webviewer {
  height: calc(100vh - 180px);
}
</style>