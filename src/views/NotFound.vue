<template>
  <div class="not-found">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>404 - Page not found</h1>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: "Page not found"
    };
  }
};
</script>
