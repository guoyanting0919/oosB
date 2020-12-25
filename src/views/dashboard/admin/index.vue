<template>
  <div class="dashboard">
    {{ title }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: process.env.VUE_APP_WEB_TITLE,
    };
  },
  methods: {},
  created() {},
};
</script>
<style scoped lang='scss'>
.dashboard {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>