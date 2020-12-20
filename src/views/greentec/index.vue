<template>
  <div class="flex-column industry">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input
          style="width: 200px; margin-right: 0.5rem"
          size="mini"
          clearable
          placeholder="請輸入關鍵字"
        ></el-input>
        <permission-btn
          size="mini"
          moduleName="modulemanager"
          v-on:btn-event="onBtnClicked"
        ></permission-btn>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="綠色技術與工程實務論文投稿稿件"></Title>
      <div class="bg-white" style="height: calc(100% - 50px)">
        <el-table
          ref="mainTable"
          :data="list"
          v-loading="listLoading"
          border
          fit
          highlight-current-row
          style="width: 100%"
          height="calc(100% - 52px)"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align="center"
            type="selection"
            width="55"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="title"
            width="150"
            label="投稿題目"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="authors"
            width="150"
            label="作者群"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="contactInfo"
            width="150"
            label="主要聯絡人資訊"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="email"
            width="200"
            label="E-mail"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="files"
            width="100"
            label="下載稿件"
          >
            <template slot-scope="scope">
              <div class="d-flex">
                <el-button
                  size="mini"
                  class="xsBtn"
                  @click="handleDownload(scope.row.files)"
                  type="warning"
                >
                  <i class="iconfont icon-download"></i>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="summaryStatus"
            width="150"
            label="摘要狀況"
          >
            <template slot-scope="scope">
              <div class="d-flex">
                <p>
                  {{ scope.row.summaryStatus || "-" }}
                </p>
                <el-button
                  size="mini"
                  class="xsBtn"
                  @click="handleDialog('summaryStatus', true, scope.row)"
                  type="warning"
                >
                  <i class="iconfont icon-edit"></i>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="statusName"
            width="150"
            label="審查意見"
          >
            <template slot-scope="scope">
              <div class="d-flex">
                <p>
                  {{ scope.row.statusName || "-" }}
                </p>
                <el-button
                  size="mini"
                  class="xsBtn"
                  @click="handleDialog('reviewStatus', true, scope.row)"
                  type="warning"
                >
                  <i class="iconfont icon-edit"></i>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="submissionDate"
            width="250"
            label="全文投稿時間"
          >
            <template slot-scope="scope">
              <div class="d-flex">
                <p>
                  {{ scope.row.submissionDate }}
                </p>
                <el-button
                  size="mini"
                  class="xsBtn"
                  @click="handleDialog('draftDate', true, scope.row)"
                  type="warning"
                >
                  <i class="iconfont icon-edit"></i>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="submissionFile"
            width="150"
            label="全文投稿"
          >
            <template slot-scope="scope">
              <div class="d-flex">
                <p>
                  {{ scope.row.submissionFile }}
                </p>
                <el-upload
                  v-if="!scope.row.submissionFile"
                  :show-file-list="false"
                  accept=".jpeg"
                  class="upload-demo"
                  action=""
                  :http-request="customUpload"
                  :limit="1"
                >
                  <el-button
                    @click="handelDraft(scope.row)"
                    class="xsBtn"
                    size="small"
                    type="primary"
                  >
                    <i class="iconfont icon-Cloudupload"></i
                  ></el-button>
                </el-upload>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 編摘要狀況Dialog -->
    <el-dialog
      title="編輯摘要狀況"
      :visible.sync="summaryStatusDialog"
      width="40%"
    >
      <el-form
        label-position="right"
        label-width="120px"
        ref="form"
        :model="summaryStatusTemp"
      >
        <el-form-item label="請選擇摘要狀況">
          <el-select
            v-model="summaryStatusTemp.summaryStatus"
            placeholder="請選擇摘要狀況"
          >
            <el-option
              v-for="item in summaryStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.dtValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialog('summaryStatus', false)"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleSummaryStatus">確 定</el-button>
      </span>
    </el-dialog>

    <!-- 編輯審查意見Dialog -->
    <el-dialog
      title="編輯審查意見"
      :visible.sync="reviewStatusDialog"
      width="40%"
    >
      <el-form
        label-position="right"
        label-width="120px"
        ref="form"
        :model="reviewStatusTemp"
      >
        <el-form-item label="請選擇審查意見">
          <el-select
            v-model="reviewStatusTemp.statusId"
            placeholder="請選擇審查意見"
          >
            <el-option
              v-for="item in reviewStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.dtValue"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="請輸入意見"
          v-if="
            reviewStatusTemp.statusId === 'INITSTATUS_PASS' ||
            reviewStatusTemp.statusId === 'INITSTATUS_UNPASS'
          "
        >
          <el-input
            type="textarea"
            autosize
            v-model="reviewStatusTemp.suggest"
            placeholder="請輸入意見"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialog('reviewStatus', false)"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleReviewStatus">確 定</el-button>
      </span>
    </el-dialog>

    <!-- 全文投稿時間Dialog -->
    <el-dialog
      title="編輯全文投稿時間"
      :visible.sync="draftDateDialog"
      width="40%"
    >
      <el-form
        label-position="right"
        label-width="120px"
        ref="form"
        :model="draftDateTemp"
      >
        <el-form-item label="全文投稿時間">
          <el-date-picker
            v-model="draftDateTemp.submissionDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="請選擇全文投稿時間"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialog('draftDate', false)">取 消</el-button>
        <el-button type="primary" @click="handleDraftDate">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";

import * as greenTecDrafts from "@/api/greenTec";
import * as categorys from "@/api/categorys";
import * as upload from "@/api/upload";

export default {
  name: "industry",
  components: { Sticky, Title, permissionBtn, Pagination },
  data() {
    return {
      /* 權限按鈕 */
      buttons: [],

      /* 獲取類別 */
      summaryStatusList: [],
      reviewStatusList: [],

      /* dialog */
      summaryStatusDialog: false,
      reviewStatusDialog: false,
      draftDateDialog: false,

      /* table */
      multipleSelection: [],
      list: [],
      total: 10,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
      },

      /* 摘要狀況模板 */
      summaryStatusTemp: {
        id: "",
        summaryStatusId: "",
        summaryStatusName: "",
        suggest: "",
      },

      /* 採用狀態模板 */
      reviewStatusTemp: {
        id: "",
        reviewStatusId: "",
        reviewStatusName: "",
        suggest: "",
      },

      /* 全文投稿模板 */
      draftDateTemp: {},

      /* 全文投稿模板 */
      draftTemp: {},
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

    /* 獲取摘要狀況類別 */
    getSummaryStatus() {
      const vm = this;
      let params = {
        TypeId: "SUMMARYSTATUS",
        limit: 10,
      };
      categorys.getList(params).then((res) => {
        vm.summaryStatusList = res.data.sort(function (a, b) {
          return a.sortNo - b.sortNo;
        });
      });
    },

    /* 獲取審查意見類別 */
    getReviewStatus() {
      const vm = this;
      let params = {
        TypeId: "INITSTATUS",
        limit: 10,
      };
      categorys.getList(params).then((res) => {
        vm.reviewStatusList = res.data.sort(function (a, b) {
          return a.sortNo - b.sortNo;
        });
      });
    },

    /* 獲取主要資料 */
    getList() {
      const vm = this;
      greenTecDrafts.load(vm.listQuery).then((res) => {
        vm.list = res.data;
        vm.total = res.count;
      });
    },

    /* 下載檔案 */
    handleDownload(fileIds) {
      const vm = this;
      upload.getFileById({ fileIds }).then((res) => {
        let url = `${process.env.VUE_APP_BASE_IMG_URL}${res.result[0].filePath}`;

        let downloadElement = document.createElement("a");
        let href = url; // 創建下載的鏈接
        downloadElement.href = href;
        downloadElement.download = res.result[0].fileName; // 下載後文件名
        downloadElement.target = "_blank";
        vm.$cl(downloadElement);
        // 此寫法兼容可火狐瀏覽器
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 點擊下載
        document.body.removeChild(downloadElement); // 下載完成移除元素
        window.URL.revokeObjectURL(href); // 釋放掉 blob 對象
        vm.$alertT.fire({
          icon: "success",
          title: `下載成功`,
        });
      });
    },

    /* dialog開關控制 */
    handleDialog(name, status, item) {
      const vm = this;
      vm[`${name}Dialog`] = status;
      vm.$cl(name, status, item);
      if (item) {
        vm[`${name}Temp`] = Object.assign({}, item);
      }
    },

    /* 摘要狀況修改確認 */
    handleSummaryStatus() {
      const vm = this;
      greenTecDrafts.update(vm.summaryStatusTemp).then((res) => {
        vm.$cl(res);
        vm.handleDialog("summaryStatus", false);
        vm.getList();
        vm.$alertT.fire({
          icon: "success",
          title: `摘要狀況修改成功`,
        });
      });
    },

    /* 審查意見資料修改確認 */
    handleReviewStatus() {
      const vm = this;
      vm.reviewStatusTemp.statusName = vm.reviewStatusList.filter((item) => {
        return item.dtValue === vm.reviewStatusTemp.statusId;
      })[0].name;
      vm.$cl(vm.reviewStatusTemp);
      greenTecDrafts.reviewStatus(vm.reviewStatusTemp).then((res) => {
        vm.$cl(res);
        vm.handleDialog("reviewStatus", false);
        vm.getList();
        vm.$alertT.fire({
          icon: "success",
          title: `審查資料修改成功`,
        });
      });
    },

    /* 全文投稿時間修改確認 */
    handleDraftDate() {
      const vm = this;
      greenTecDrafts.update(vm.draftDateTemp).then((res) => {
        vm.$cl(res);
        vm.handleDialog("draftDate", false);
        vm.getList();
        vm.$alertT.fire({
          icon: "success",
          title: `全文投稿時間修改成功`,
        });
      });
    },

    /* 全文投稿 */
    handelDraft(item) {
      const vm = this;
      if (item.submissionFile == "") {
        vm.draftTemp = Object.assign({}, item);
      } else {
        greenTecDrafts.update(vm.draftTemp).then(() => {
          vm.$alertT.fire({
            icon: "success",
            title: `全文投稿檔案上傳成功`,
          });
          vm.getList();
        });
        return;
      }
    },

    /* 檔案上傳 */
    customUpload(file) {
      const vm = this;
      let formData = new FormData();
      formData.append("files", file.file, file.file.name);
      vm.$http
        .post(`${process.env.VUE_APP_BASE_API}Files/Upload`, formData)
        .then((response) => {
          vm.$cl(response.data.result[0].id);
          let fileId = response.data.result[0].id;
          vm.draftTemp.submissionFile = fileId;
          vm.handelDraft(vm.draftTemp);
        })
        .catch((error) => {
          console.log({ error });
        });
    },

    /* 權限按鈕中控 */
    onBtnClicked(domId) {
      this.$cl(domId);
      switch (domId) {
        case "delete":
          this.handleDelete();
          break;

        default:
          break;
      }
    },

    /* 刪除刊物 */
    handleDelete() {
      const vm = this;
      let deleteArr = vm.multipleSelection.map((item) => {
        return item.id;
      });
      vm.$cl(deleteArr);
      greenTecDrafts.remove(deleteArr).then((res) => {
        vm.$cl(res);
        vm.getList();
      });
    },

    rowClick() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
  },
  mounted() {
    this.getButtons();
    this.getList();
    this.getSummaryStatus();
    this.getReviewStatus();
  },
};
</script>

<style>
</style>