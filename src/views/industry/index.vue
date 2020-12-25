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
      <Title title="工業污染防治刊物投稿稿件"></Title>
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
            prop="createDate"
            width="170"
            label="投稿日期"
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
                  type="primary"
                  plain
                >
                  <i class="iconfont icon-Clouddownload"></i>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="initStatusName"
            width="150"
            label="初審狀態"
          >
            <template slot-scope="scope">
              <div class="d-flex">
                <p
                  :class="{
                    pass: scope.row.initStatusId === 'INITSTATUS_PASS',
                    unPass: scope.row.initStatusId === 'INITSTATUS_UNPASS',
                  }"
                >
                  {{ scope.row.initStatusName }}
                </p>
                <el-button
                  v-if="
                    scope.row.initStatusId === 'INITSTATUS_NONE' ||
                    scope.row.initStatusId === 'INITSTATUS_READY'
                  "
                  size="mini"
                  class="xsBtn"
                  @click="handleDialog('initStatus', true, scope.row)"
                  type="primary"
                  plain
                >
                  <i class="iconfont icon-edit"></i>
                </el-button>
                <el-tooltip
                  placement="top"
                  v-if="
                    scope.row.initStatusId === 'INITSTATUS_PASS' ||
                    scope.row.initStatusId === 'INITSTATUS_UNPASS'
                  "
                >
                  <div slot="content">{{ scope.row.initStatusSuggest }}</div>
                  <i class="iconfont icon-mouse"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="reviewStatusName"
            width="150"
            label="複審狀態"
          >
            <template slot-scope="scope">
              <div class="d-flex">
                <p
                  :class="{
                    pass: scope.row.reviewStatusId === 'REVIEWSTATUS_PASS',
                    unPass: scope.row.reviewStatusId === 'REVIEWSTATUS_UNPASS',
                  }"
                >
                  {{ scope.row.reviewStatusName || "-" }}
                </p>
                <el-button
                  v-if="
                    scope.row.initStatusId === 'INITSTATUS_PASS' &&
                    scope.row.reviewStatusId === 'REVIEWSTATUS_NONE'
                  "
                  size="mini"
                  class="xsBtn"
                  @click="handleDialog('reviewStatus', true, scope.row)"
                  type="primary"
                  plain
                >
                  <i class="iconfont icon-edit"></i>
                </el-button>
                <el-tooltip
                  placement="top"
                  v-if="
                    scope.row.reviewStatusId === 'REVIEWSTATUS_PASS' ||
                    scope.row.reviewStatusId === 'REVIEWSTATUS_UNPASS'
                  "
                >
                  <div slot="content">{{ scope.row.reviewStatusSuggest }}</div>
                  <i class="iconfont icon-mouse"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="useSituation"
            width="150"
            label="採用情形"
          >
            <template slot-scope="scope">
              <div class="d-flex">
                <p
                  :class="{
                    pass: scope.row.useSituation === '採用',
                    unPass: scope.row.useSituation === '不採用',
                  }"
                >
                  {{ scope.row.useSituation || "-" }}
                </p>
                <el-button
                  v-if="
                    scope.row.reviewStatusId === 'REVIEWSTATUS_PASS' &&
                    scope.row.useSituation === ''
                  "
                  size="mini"
                  class="xsBtn"
                  @click="handleDialog('useSituation', true, scope.row)"
                  type="primary"
                  plain
                >
                  <i class="iconfont icon-edit"></i>
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="period"
            width="150"
            label="預計上刊期別"
          >
            <template slot-scope="scope">
              <div class="d-flex">
                <a
                  target="blank"
                  :href="scope.row.periodUrl"
                  v-if="scope.row.period"
                  >{{ scope.row.period }}期
                  <i class="iconfont icon-link"></i>
                </a>
                <p v-if="!scope.row.period">-</p>
                <el-button
                  v-if="
                    scope.row.useSituation === '採用' && scope.row.period === ''
                  "
                  size="mini"
                  class="xsBtn"
                  @click="handleDialog('period', true, scope.row)"
                  type="primary"
                  plain
                >
                  <i class="iconfont icon-edit"></i>
                </el-button>
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

    <!-- 編輯初審狀態Dialog -->
    <el-dialog
      title="編輯初審狀態"
      :visible.sync="initStatusDialog"
      width="40%"
    >
      <el-form
        label-position="right"
        label-width="120px"
        ref="form"
        :model="initStatusTemp"
      >
        <el-form-item label="請選擇初審狀態">
          <el-select
            v-model="initStatusTemp.initStatusId"
            placeholder="請選擇初審狀態"
            @change="initStatusChange"
          >
            <el-option
              v-for="item in initStatusList"
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
            initStatusTemp.initStatusId === 'INITSTATUS_PASS' ||
            initStatusTemp.initStatusId === 'INITSTATUS_UNPASS'
          "
        >
          <el-input
            type="textarea"
            autosize
            v-model="initStatusTemp.initStatusSuggest"
            placeholder="請輸入意見"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialog('initStatus', false)">取 消</el-button>
        <el-button type="primary" @click="handleInitStatus">確 定</el-button>
      </span>
    </el-dialog>

    <!-- 編輯複審狀態Dialog -->
    <el-dialog
      title="編輯複審狀態"
      :visible.sync="reviewStatusDialog"
      width="40%"
    >
      <el-form
        label-position="right"
        label-width="120px"
        ref="form"
        :model="reviewStatusTemp"
      >
        <el-form-item label="請選擇複審狀態">
          <el-select
            v-model="reviewStatusTemp.reviewStatusId"
            placeholder="請選擇複審狀態"
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
            reviewStatusTemp.reviewStatusId === 'REVIEWSTATUS_PASS' ||
            reviewStatusTemp.reviewStatusId === 'REVIEWSTATUS_UNPASS'
          "
        >
          <el-input
            type="textarea"
            autosize
            v-model="reviewStatusTemp.reviewStatusSuggest"
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

    <!-- 採用情形Dialog -->
    <el-dialog
      title="編輯採用情形"
      :visible.sync="useSituationDialog"
      width="40%"
    >
      <el-form
        label-position="right"
        label-width="120px"
        ref="form"
        :model="useSituationTemp"
      >
        <el-form-item label="請選擇採用情形">
          <el-select
            v-model="useSituationTemp.useSituation"
            placeholder="請選擇採用情形"
          >
            <el-option label="採用" value="採用"> </el-option>
            <el-option label="不採用" value="不採用"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialog('useSituation', false)"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleUseSituation">確 定</el-button>
      </span>
    </el-dialog>

    <!-- 上刊期別Dialog -->
    <el-dialog title="編輯上刊期別" :visible.sync="periodDialog" width="40%">
      <el-form
        label-position="right"
        label-width="120px"
        ref="form"
        :model="periodTemp"
      >
        <el-form-item label="請輸入上刊期別">
          <el-input v-model="periodTemp.period" placeholder="請選擇上刊期別">
          </el-input>
        </el-form-item>

        <el-form-item label="刊物頁面連結">
          <el-input
            v-model="periodTemp.periodUrl"
            placeholder="請輸入刊物頁面連結"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialog('period', false)">取 消</el-button>
        <el-button type="primary" @click="handlePeriod">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";

import * as industryDrafts from "@/api/industryDrafts";
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
      initStatusList: [],
      reviewStatusList: [],

      /* dialog */
      initStatusDialog: false,
      reviewStatusDialog: false,
      useSituationDialog: false,
      periodDialog: false,

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

      /* 初審模板 */
      initStatusTemp: {
        id: "",
        initStatusId: "",
        initStatusName: "",
        suggest: "",
      },

      /* 複審模板 */
      reviewStatusTemp: {
        id: "",
        reviewStatusId: "",
        reviewStatusName: "",
        suggest: "",
      },

      /* 採用狀態模板 */
      useSituationTemp: {},

      /* 預計上刊期別模板 */
      periodTemp: {},
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

    /* 獲取初審狀態類別 */
    getInitStatus() {
      const vm = this;
      let params = {
        TypeId: "INITSTATUS",
        limit: 10,
      };
      categorys.getList(params).then((res) => {
        vm.initStatusList = res.data.sort(function (a, b) {
          return a.sortNo - b.sortNo;
        });
      });
    },

    /* 獲取複審狀態類別 */
    getReviewStatus() {
      const vm = this;
      let params = {
        TypeId: "REVIEWSTATUS",
        limit: 10,
      };
      categorys.getList(params).then((res) => {
        vm.reviewStatusList = res.data;
      });
    },

    /* 獲取主要資料 */
    getList() {
      const vm = this;
      industryDrafts.load(vm.listQuery).then((res) => {
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

    /* 初審資料變動 */
    initStatusChange(val) {
      const vm = this;
      vm.$cl(val);
      if (val == "INITSTATUS_READY") {
        vm.$alertM.fire({
          icon: "info",
          title: `確認修改狀態為以收稿後,將email告知作者已收稿,請於兩週內進行審查作業`,
        });
      }
    },

    /* 初審資料修改確認 */
    handleInitStatus() {
      const vm = this;
      vm.initStatusTemp.initStatusName = vm.initStatusList.filter((item) => {
        return item.dtValue === vm.initStatusTemp.initStatusId;
      })[0].name;
      vm.initStatusTemp.suggest = vm.initStatusTemp.initStatusSuggest;
      vm.$cl(vm.initStatusTemp);
      industryDrafts.initStatus(vm.initStatusTemp).then((res) => {
        vm.$cl(res);
        vm.handleDialog("initStatus", false);
        vm.getList();
        vm.$alertT.fire({
          icon: "success",
          title: `初審狀態修改成功`,
        });
      });
    },

    /* 複審資料修改確認 */
    handleReviewStatus() {
      const vm = this;
      vm.reviewStatusTemp.reviewStatusName = vm.reviewStatusList.filter(
        (item) => {
          return item.dtValue === vm.reviewStatusTemp.reviewStatusId;
        }
      )[0].name;
      vm.reviewStatusTemp.suggest = vm.reviewStatusTemp.reviewStatusSuggest;
      vm.$cl(vm.reviewStatusTemp);
      industryDrafts.reviewStatus(vm.reviewStatusTemp).then((res) => {
        vm.$cl(res);
        vm.handleDialog("reviewStatus", false);
        vm.getList();
        vm.$alertT.fire({
          icon: "success",
          title: `複審狀態修改成功`,
        });
      });
    },

    /* 採用情況修改確認 */
    handleUseSituation() {
      const vm = this;
      industryDrafts.update(vm.useSituationTemp).then((res) => {
        vm.$cl(res);
        vm.handleDialog("useSituation", false);
        vm.getList();
        vm.$alertT.fire({
          icon: "success",
          title: `採用情況修改成功`,
        });
      });
    },

    /* 上刊期別修改確認 */
    handlePeriod() {
      const vm = this;
      industryDrafts.update(vm.periodTemp).then((res) => {
        vm.$cl(res);
        vm.handleDialog("period", false);
        vm.getList();
        vm.$alertT.fire({
          icon: "success",
          title: `上刊期別修改成功`,
        });
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
      industryDrafts.remove(deleteArr).then((res) => {
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
    this.getInitStatus();
    this.getReviewStatus();
  },
};
</script>

<style lang='scss' scoped>
.pass {
  color: #ffffff;
  padding: 0 0.5rem;
  background: $success;
  border-radius: 0.25rem;
  width: 58px;
}

.unPass {
  color: #ffffff;
  padding: 0 0.5rem;
  background: $danger;
  border-radius: 0.25rem;
}
</style>