<template>
  <div class="home">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Signed Documents</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <signed-list />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SignedList from "@/components/List/SignedList";

export default {
  metaInfo() {
    return {
      title: "PDFTron Sign App - Signed List",
    };
  },
  components: {
    SignedList,
  },
};
</script>
