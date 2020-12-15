<template>
  <div class="app-container" style="height: 100%">
    <div class="block" v-if="url" style="height: 100%">
      <iframe
        :src="url"
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="auto"
      ></iframe>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "iframePage",
  computed: {
    ...mapGetters(["iframeViews"]),
  },
  data() {
    return {
      url: "",
    };
  },
  mounted() {
    this.url = this.iframeViews[this.$route.params.code].url;
  },
};
</script>

