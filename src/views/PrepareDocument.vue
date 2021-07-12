<template>
  <div class="home">
    <v-container>
      <h1>Prepare Document</h1>
      <div
        class="webviewer"
        id="webviewer"
        ref="viewer"
        style="margin-right: 260px"
      ></div>
      <input type="file" ref="filePicker" class="d-none" />
      <v-navigation-drawer absolute permanent right>
        <template v-slot:prepend>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Step 1</v-list-item-title>
              <v-btn
                @click="$refs.filePicker.click()"
                class="text-none mt-1"
                color="success"
              >
                Upload a document
                <v-icon right dark> mdi-plus-circle </v-icon>
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Step 2</v-list-item-title>
              <v-select
                item-text="label"
                item-value="value"
                :items="signeesOptions"
                label="Adding signature for"
                v-model="signee"
              ></v-select>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="pt-0">
              <div
                draggable
                @dragstart="dragStart"
                @dragend="dragEnd($event, 'SIGNATURE')"
              >
                <v-btn
                  class="text-none"
                  @click="addField('SIGNATURE')"
                  color="primary"
                  block
                >
                  Add signature
                  <v-icon right dark> mdi-pen </v-icon>
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div
                draggable
                @dragstart="dragStart"
                @dragend="dragEnd($event, 'TEXT')"
              >
                <v-btn
                  class="text-none"
                  @click="addField('TEXT')"
                  color="primary"
                  block
                >
                  Add text
                  <v-icon right dark> mdi-label </v-icon>
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <div
                draggable
                @dragstart="dragStart"
                @dragend="dragEnd($event, 'DATE')"
              >
                <v-btn
                  class="text-none"
                  @click="addField('DATE')"
                  color="primary"
                  block
                >
                  Add date
                  <v-icon right dark> mdi-calendar </v-icon>
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Step 3</v-list-item-title>
              <v-btn
                class="text-none"
                @click="applyFields"
                color="success"
                block
              >
                Send
                <v-icon right dark> mdi-send </v-icon>
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import WebViewer from "@pdftron/webviewer";
import { storage, addDocumentToSign } from "@/firebase";

export default {
  metaInfo() {
    return {
      title: "PDFTron Sign App - Prepare Document",
    };
  },
  components: {},
  data() {
    return {
      instance: null,
      dropPoint: null,
      signee: "",
    };
  },
  computed: {
    ...mapGetters(["signees", "user"]),
    signeesOptions() {
      return this.signees.map((user) => {
        return { value: user.email, label: user.name };
      });
    },
  },
  methods: {
    ...mapActions(["resetSignee"]),
    dragOver(e) {
      e.preventDefault();
      return false;
    },
    drop(e, instance) {
      const { docViewer } = instance;
      const scrollElement = docViewer.getScrollViewElement();
      const scrollLeft = scrollElement.scrollLeft || 0;
      const scrollTop = scrollElement.scrollTop || 0;
      this.dropPoint = { x: e.pageX + scrollLeft, y: e.pageY + scrollTop };
      e.preventDefault();
      return false;
    },
    dragStart(e) {
      e.target.style.opacity = 0.5;
      const copy = e.target.cloneNode(true);
      copy.id = "form-build-drag-image-copy";
      copy.style.width = "250px";
      document.body.appendChild(copy);
      e.dataTransfer.setDragImage(copy, 125, 25);
      e.dataTransfer.setData("text", "");
    },
    dragEnd(e, type) {
      this.addField(type, this.dropPoint);
      e.target.style.opacity = 1;
      document.body.removeChild(
        document.getElementById("form-build-drag-image-copy")
      );
      e.preventDefault();
    },
    addField(type, point = {}, name = "", value = "", flag = {}) {
      const { docViewer, Annotations } = this.instance;
      const annotManager = docViewer.getAnnotationManager();
      const doc = docViewer.getDocument();
      const displayMode = docViewer.getDisplayModeManager().getDisplayMode();
      const page = displayMode.getSelectedPages(point, point);
      if (!!point.x && page.first == null) {
        return; //don't add field to an invalid page location
      }
      const page_idx =
        page.first !== null ? page.first : docViewer.getCurrentPage();
      const page_info = doc.getPageInfo(page_idx);
      const page_point = displayMode.windowToPage(point, page_idx);
      const zoom = docViewer.getZoom();
      let textAnnot = name;
      textAnnot = new Annotations.FreeTextAnnotation();
      textAnnot.PageNumber = page_idx;
      const rotation = docViewer.getCompleteRotation(page_idx) * 90;
      textAnnot.Rotation = rotation;
      if (rotation === 270 || rotation === 90) {
        textAnnot.Width = 50.0 / zoom;
        textAnnot.Height = 250.0 / zoom;
      } else {
        textAnnot.Width = 250.0 / zoom;
        textAnnot.Height = 50.0 / zoom;
      }
      textAnnot.X = (page_point.x || page_info.width / 2) - textAnnot.Width / 2;
      textAnnot.Y =
        (page_point.y || page_info.height / 2) - textAnnot.Height / 2;

      textAnnot.setPadding(new Annotations.Rect(0, 0, 0, 0));
      textAnnot.custom = {
        type,
        value,
        flag,
        name: `${this.signee}_${type}_`,
      };

      // set the type of annot
      textAnnot.setContents(textAnnot.custom.name);
      textAnnot.FontSize = "" + 20.0 / zoom + "px";
      textAnnot.FillColor = new Annotations.Color(211, 211, 211, 0.5);
      textAnnot.TextColor = new Annotations.Color(0, 165, 228);
      textAnnot.StrokeThickness = 1;
      textAnnot.StrokeColor = new Annotations.Color(0, 165, 228);
      textAnnot.TextAlign = "center";

      textAnnot.Author = annotManager.getCurrentUser();

      annotManager.deselectAllAnnotations();
      annotManager.addAnnotation(textAnnot, true);
      annotManager.redrawAnnotation(textAnnot);
      annotManager.selectAnnotation(textAnnot);
    },
    applyFields: async function () {
      const { Annotations, docViewer } = this.instance;
      const annotManager = docViewer.getAnnotationManager();
      const fieldManager = annotManager.getFieldManager();
      const annotationsList = annotManager.getAnnotationsList();
      const annotsToDelete = [];
      const annotsToDraw = [];

      await Promise.all(
        annotationsList.map(async (annot, index) => {
          let inputAnnot;
          let field;

          if (typeof annot.custom !== "undefined") {
            // create a form field based on the type of annotation
            if (annot.custom.type === "TEXT") {
              field = new Annotations.Forms.Field(
                annot.getContents() + Date.now() + index,
                {
                  type: "Tx",
                  value: annot.custom.value,
                }
              );
              inputAnnot = new Annotations.TextWidgetAnnotation(field);
            } else if (annot.custom.type === "SIGNATURE") {
              field = new Annotations.Forms.Field(
                annot.getContents() + Date.now() + index,
                {
                  type: "Sig",
                }
              );
              inputAnnot = new Annotations.SignatureWidgetAnnotation(field, {
                appearance: "_DEFAULT",
                appearances: {
                  _DEFAULT: {
                    Normal: {
                      data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC",
                      offset: {
                        x: 100,
                        y: 100,
                      },
                    },
                  },
                },
              });
            } else if (annot.custom.type === "DATE") {
              field = new Annotations.Forms.Field(
                annot.getContents() + Date.now() + index,
                {
                  type: "Tx",
                  value: "m-d-yyyy",
                  // Actions need to be added for DatePickerWidgetAnnotation to recognize this field.
                  actions: {
                    F: [
                      {
                        name: "JavaScript",
                        // You can customize the date format here between the two double-quotation marks
                        // or leave this blank to use the default format
                        javascript: 'AFDate_FormatEx("mmm d, yyyy");',
                      },
                    ],
                    K: [
                      {
                        name: "JavaScript",
                        // You can customize the date format here between the two double-quotation marks
                        // or leave this blank to use the default format
                        javascript: 'AFDate_FormatEx("mmm d, yyyy");',
                      },
                    ],
                  },
                }
              );

              inputAnnot = new Annotations.DatePickerWidgetAnnotation(field);
            } else {
              // exit early for other annotations
              annotManager.deleteAnnotation(annot, false, true); // prevent duplicates when importing xfdf
              return;
            }
          } else {
            // exit early for other annotations
            return;
          }

          // set position
          inputAnnot.PageNumber = annot.getPageNumber();
          inputAnnot.X = annot.getX();
          inputAnnot.Y = annot.getY();
          inputAnnot.rotation = annot.Rotation;
          if (annot.Rotation === 0 || annot.Rotation === 180) {
            inputAnnot.Width = annot.getWidth();
            inputAnnot.Height = annot.getHeight();
          } else {
            inputAnnot.Width = annot.getHeight();
            inputAnnot.Height = annot.getWidth();
          }

          // delete original annotation
          annotsToDelete.push(annot);

          // customize styles of the form field
          Annotations.WidgetAnnotation.getCustomStyles = function (widget) {
            if (widget instanceof Annotations.SignatureWidgetAnnotation) {
              return {
                border: "1px solid #a5c7ff",
              };
            }
          };
          Annotations.WidgetAnnotation.getCustomStyles(inputAnnot);

          // draw the annotation the viewer
          annotManager.addAnnotation(inputAnnot);
          fieldManager.addField(field);
          annotsToDraw.push(inputAnnot);
        })
      );

      // delete old annotations
      annotManager.deleteAnnotations(annotsToDelete, null, true);

      // refresh viewer
      await annotManager.drawAnnotationsFromList(annotsToDraw);
      await this.uploadForSigning();
    },
    uploadForSigning: async function () {
      // upload the PDF with fields as AcroForm
      const storageRef = storage.ref();
      const referenceString = `docToSign/${this.user.uid}${Date.now()}.pdf`;
      const docRef = storageRef.child(referenceString);
      const { docViewer, annotManager } = this.instance;
      const doc = docViewer.getDocument();
      const xfdfString = await annotManager.exportAnnotations({
        widgets: true,
        fields: true,
      });
      const data = await doc.getFileData({ xfdfString });
      const arr = new Uint8Array(data);
      const blob = new Blob([arr], { type: "application/pdf" });
      docRef.put(blob).then(function () {
        console.log("Uploaded the blob");
      });

      // create an entry in the database
      const emails = this.signees.map((signee) => {
        return signee.email;
      });
      await addDocumentToSign(
        this.user.uid,
        this.user.email,
        referenceString,
        emails
      );
      // dispatch(resetSignee());
      this.resetSignee();
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
        ],
      },
      this.$refs.viewer
    ).then((instance) => {
      const { iframeWindow } = instance;

      // select only the view group
      instance.setToolbarGroup("toolbarGroup-View");

      this.instance = instance;

      const iframeDoc = iframeWindow.document.body;
      iframeDoc.addEventListener("dragover", this.dragOver);
      iframeDoc.addEventListener("drop", (e) => {
        this.drop(e, instance);
      });

      this.$refs.filePicker.onchange = (e) => {
        const file = e.target.files[0];
        console.log("change");
        if (file) {
          instance.loadDocument(file);
        }
      };
    });
    if (this.signeesOptions.length) {
      this.signee = this.signeesOptions[0].value;
    } else {
      this.$router.push({ name: "Prepare" });
    }
  },
};
</script>

<style>
.webviewer {
  height: calc(100vh - 180px);
}
</style>