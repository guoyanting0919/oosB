<template>
  <div class="flex-column greenTecDescription">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn
          size="mini"
          moduleName="modulemanager"
          v-on:btn-event="onBtnClicked"
        ></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="綠色技術與工程實務論文活動說明"></Title>
      <div class="bg-white" style="height: calc(100% - 50px); padding: 1rem">
        <el-form
          label-position="right"
          ref="form"
          :model="temp"
          label-width="100px"
        >
          <el-form-item label="開放投稿時間">
            <el-date-picker
              v-model="dateRangeArr"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              style="width: 400px"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item
            v-for="(email, index) in dynamicEmail.emails"
            :label="`E-mail ${index + 1}`"
            :key="email.key"
          >
            <el-input
              style="width: 70%; margin-right: 1rem"
              v-model="email.value"
            ></el-input>
            <el-button
              v-if="index + 1 == dynamicEmail.emails.length"
              size="mini"
              type="info"
              @click.prevent="addEmail(email)"
              >新增</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click.prevent="removeEmail(email)"
              >刪除</el-button
            >
          </el-form-item>
          <el-form-item label="範例檔案">
            <el-upload
              :show-file-list="false"
              accept=".pdf"
              class="upload-demo"
              action=""
              :http-request="customUpload"
              :limit="3"
            >
              <el-button size="small" type="primary">上傳</el-button>
            </el-upload>
            <span
              style="display: inline-block; margin-right: 1rem"
              v-for="(item, idx) in fileList"
              :key="item"
              >{{ idx + 1 }}.範例檔案
              <i
                class="iconfont icon-garbage"
                style="color: red"
                @click="handleDeleteFiles(item)"
              ></i>
            </span>
          </el-form-item>
          <el-form-item label="辦法編輯">
            <vue-editor
              id="editor"
              useCustomImageHandler
              @image-added="handleImageAdded"
              :editor-toolbar="customToolbar"
              v-model="temp.contents"
              :editorOptions="editorSettings"
            ></vue-editor>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { VueEditor, Quill } from "vue2-editor";
import ImageResize from "quill-image-resize-vue";
Quill.register("modules/imageResize", ImageResize);
import axios from "axios";

import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";

import * as drafts from "@/api/drafts";
export default {
  name: "greenTecDescription",
  components: { Sticky, Title, permissionBtn, VueEditor },
  data() {
    return {
      /* 權限按鈕 */
      buttons: [],

      /* 投稿類別id */
      id: "MANUCATEGORY_TECHNOLOGY",

      /* 日期選擇器 */
      dateRangeArr: [],

      /* 動態email */
      dynamicEmail: {
        emails: [],
      },

      /* editor */
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "strike"],
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" },
        ],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ color: [] }, { background: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],

      /* 檔案列表 */
      fileList: [],

      /* temp */
      temp: {
        startDate: "",
        endDate: "",
        contents: "",
        emails: "",
        id: "",
        files: "",
      },
    };
  },
  methods: {
    /* 獲取本路由下所有功能按鈕 */
    getButtons() {
      this.$route.meta.elements.forEach((el) => {
        this.buttons.push(el.domId);
      });
    },

    /* 是否擁有按鈕功能權限 */
    hasButton(domId) {
      return this.buttons.includes(domId);
    },

    /* 獲取主要資料 */
    getList() {
      const vm = this;
      vm.dynamicEmail.emails = [];
      drafts.get({ id: vm.id }).then((res) => {
        vm.$cl(res);
        vm.temp = Object.assign({}, res.result);
        this.$set(vm.dateRangeArr, 0, vm.temp.startDate);
        this.$set(vm.dateRangeArr, 1, vm.temp.endDate);
        vm.fileList = vm.temp.files.split(",");
        let emailValArr = vm.temp.emails.split(",");
        emailValArr.forEach((val) => {
          let data = {
            value: val,
          };
          vm.dynamicEmail.emails.push(data);
        });
        vm.$cl(vm.dynamicEmail);
      });
    },

    /* 儲存編輯資料 */
    handleUpdate() {
      const vm = this;
      let emailArr = vm.dynamicEmail.emails.map((email) => {
        return email.value;
      });
      vm.temp.emails = emailArr.join(",");
      vm.temp.startDate = vm.dateRangeArr[0];
      vm.temp.endDate = vm.dateRangeArr[1];
      vm.temp.files = vm.fileList.join(",");
      vm.$cl(vm.temp);
      drafts.update(vm.temp).then((res) => {
        vm.$cl(res);
        vm.$alertT.fire({
          icon: "success",
          title: `編輯成功`,
        });
        // vm.$router.push("/industry/index");
      });
    },

    /* 權限按鈕中控 */
    onBtnClicked(domId) {
      this.$cl(domId);
      switch (domId) {
        case "update":
          this.handleUpdate();
          break;

        default:
          break;
      }
    },
    rowClick() {},
    handleSelectionChange() {},
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },

    /* 移除信箱 */
    removeEmail(item) {
      let index = this.dynamicEmail.emails.indexOf(item);
      this.$cl(index);
      if (index !== -1) {
        this.dynamicEmail.emails.splice(index, 1);
      }
    },

    /* 新增信箱 */
    addEmail() {
      this.dynamicEmail.emails.push({
        value: "",
        key: Date.now(),
      });
    },

    /* 檔案上傳 */
    customUpload(file) {
      const vm = this;
      let formData = new FormData();
      formData.append("files", file.file, file.file.name);
      vm.$http
        .post(`${process.env.VUE_APP_BASE_API}Files/Upload`, formData)
        .then((response) => {
          let fileId = response.data.result[0].id;
          vm.fileList.push(fileId);
          vm.$cl(vm.fileList);
        })
        .catch((error) => {
          console.log({ error });
        });
    },

    /* 檔案刪除 */
    handleDeleteFiles(item) {
      this.fileList = this.fileList.filter((i) => {
        return i !== item;
      });
    },

    /* 圖片上傳 */
    handleImageAdded: function (file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("files", file);
      axios({
        url: `${process.env.VUE_APP_BASE_API}Files/Upload`,
        method: "POST",
        data: formData,
      })
        .then((res) => {
          let url = `${process.env.VUE_APP_BASE_IMG_URL}${res.data.result[0].filePath}`;
          Editor.insertEmbed(cursorLocation, "image", url);
          resetUploader();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getButtons();
    this.getList();
  },
};
</script>

<style lang='scss'>
.ql-snow .ql-picker.ql-header .ql-picker-item::before,
.ql-snow .ql-picker.ql-header .ql-picker-label::before {
  transform: translateY(-10px);
}
</style>