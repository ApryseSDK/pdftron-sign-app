<template>
  <div class="home">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Sign Documents</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <sign-list />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SignList from "@/components/List/SignList";

export default {
  metaInfo() {
    return {
      title: "PDFTron Sign App - Sign List",
    };
  },
  components: {
    SignList,
  },
};
</script>
