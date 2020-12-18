<template>
  <div class="dashboard">
    {{ title }}
    <el-upload
      accept=".pdf"
      class="upload-demo"
      action="http://simpleweb.unitgo.tw/api/Files/Upload"
      :file-list="fileList"
      :http-request="beforeUpload"
      :limit="1"
      :headers="uploadHeader"
    >
      <el-button size="small" type="primary">上傳</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      uploadHeader: {
        Accept: `application/json, text/plain,*/*`,
      },
      title: process.env.VUE_APP_WEB_TITLE,
      action: process.env.VUE_APP_BASE_API,
    };
  },
  methods: {
    beforeUpload(file) {
      console.log(file);
      const vm = this;
      let formData = new FormData();
      formData.append("files", file.file, file.file.name);
      vm.$http
        .post("http://oss.yummydesign.com.tw/sys/api/Files/Upload", formData)
        .then((response) => {
          console.log("Success!");
          console.log({ response });
        })
        .catch((error) => {
          console.log({ error });
        });
    },
  },
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