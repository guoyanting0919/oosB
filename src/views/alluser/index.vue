<template>
  <div class="flex-column allUser">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 關鍵字搜尋 -->
        <el-input
          style="width: 200px; margin-right: 0.5rem"
          size="mini"
          v-model="value"
          clearable
          placeholder="請輸入關鍵字"
        ></el-input>
        <!-- 權限按鈕 -->
        <permission-btn
          moduleName="builderTables"
          size="mini"
          v-on:btn-event="onBtnClicked"
        ></permission-btn>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <!-- 全部個案資料 -->
      <Title title="全部個案"></Title>
      <div class="bg-white" style="height: calc(100% - 50px)">
        <el-table
          ref="mainTable"
          height="calc(100% - 52px)"
          :data="gridData"
          border
          fit
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @row-click="rowClick"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          ></el-table-column>
          <!-- <el-table-column
            property="pic"
            label="照片"
            width="80"
            align="center"
          ></el-table-column> -->
          <el-table-column
            property="lock"
            label="鎖定狀態"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <i
                  style="color: #409167"
                  v-if="scope.row.lock"
                  class="iconfont icon-Vector21"
                ></i>
                <i
                  style="color: #d63737"
                  v-else
                  class="iconfont icon-Vector31"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            property="name"
            label="姓名"
            width="120"
            align="center"
          ></el-table-column>
          <!-- <el-table-column
            property="code"
            label="個案編號"
            width="140"
            align="center"
          ></el-table-column> -->
          <el-table-column
            property="uid"
            label="身分證字號"
            width="140"
            align="center"
          ></el-table-column>
          <el-table-column
            property="birth"
            label="生日"
            width="140"
            align="center"
          ></el-table-column>
          <el-table-column
            property="sex"
            label="性別"
            width="70"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <i
                  style="color: #d63737"
                  v-if="scope.row.sex"
                  class="iconfont icon-Vector5"
                ></i>
                <i
                  style="color: #227294"
                  v-else
                  class="iconfont icon-Vector6"
                ></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            property="phone"
            label="手機"
            width="170"
            align="center"
          ></el-table-column>
          <!-- <el-table-column
            property="tel"
            label="市話"
            width="170"
            align="center"
          ></el-table-column> -->
          <!-- <el-table-column
            property="status"
            label="狀態"
            width="130"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <el-tag v-if="scope.row.status" type="success">可派發</el-tag>
                <el-tag v-else type="danger">不可派發</el-tag>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column property="setting" label="身份" width="200">
            <template slot-scope="scope">
              <el-select
                style="margin-right:0.5rem"
                size="mini"
                v-model="roles[scope.row.uid]"
                placeholder="選擇身份"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            property="setting"
            label="操作"
            :fixed="isMobile()"
            width="350"
          >
            <template slot-scope="scope">
              <div class="buttonFlexBox">
                <el-button
                  size="mini"
                  @click="handleDispatch(scope.row)"
                  type="info"
                  v-if="hasButton('dispatch')"
                  >派車</el-button
                >
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)"
                  type="warning"
                  v-if="hasButton('edit')"
                  >編輯</el-button
                >
                <el-button
                  size="mini"
                  @click="handleDetail(scope.row)"
                  type="success"
                  disabled
                  v-if="hasButton('detail')"
                  >檢視</el-button
                >
                <el-button
                  size="mini"
                  @click="handleUnitB(scope.row)"
                  type="primary"
                  v-if="hasButton('unitB')"
                  >B單位</el-button
                >
                <el-button
                  size="mini"
                  @click="handleQuota(scope.row)"
                  type="primary"
                  v-if="hasButton('quota')"
                  >額度</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
        />
      </div>
    </div>

    <!-- addOrUpdateDialog 新增用戶-->
    <el-dialog
      :title="userDialogMap[userDialogTitle]"
      :visible.sync="addOrUpdateDialog"
      width="50%"
      style="min-width:375px"
    >
      <el-form
        :label-position="labelPosition"
        label-width="200px"
        :model="userTemp"
        :rules="userRules"
        ref="userForm"
      >
        <el-row :gutter="16">
          <el-col :sm="24" :md="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="userTemp.name"
                placeholder="請輸入姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="出生年月日" prop="birthday">
              <el-date-picker
                v-model="userTemp.birthday"
                type="date"
                placeholder="請選擇生日"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="身分證字號" prop="uid">
              <el-input
                v-model="userTemp.uid"
                placeholder="請輸入身分證字號"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="性別" prop="sex">
              <el-select
                clearable
                v-model="userTemp.sex"
                placeholder="請選擇性別"
                style="width:100%"
              >
                <el-option :value="1" :label="'男'">男</el-option>
                <el-option :value="2" :label="'女'">女</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="手機" prop="phone">
              <span slot="label">手機</span>
              <el-input
                placeholder="格式:0987654321"
                v-model="userTemp.phone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddOrUpdate('add')"
          >確 定</el-button
        >
      </span>
    </el-dialog>

    <!-- quotaDialog -->
    <el-dialog title="可用額度" :visible.sync="quotaDialog" width="30%">
      <span>可用額度可用額度可用額度可用額度</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quotaDialog = false">取 消</el-button>
        <el-button type="primary" @click="quotaDialog = false">確 定</el-button>
      </span>
    </el-dialog>

    <!-- unitBDialog -->
    <el-dialog title="B單位" :visible.sync="unitBDialog" width="30%">
      <span>B單位B單位B單位B單位B單位B單位</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unitBDialog = false">取 消</el-button>
        <el-button type="primary" @click="unitBDialog = false">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";
// import tablePermissionBtn from "@/components/TablePermissionBtn";
import elDragDialog from "@/directive/el-dragDialog";
import Pagination from "@/components/Pagination";
export default {
  name: "allUser",
  components: {
    Sticky,
    Title,
    permissionBtn,
    Pagination,
  },
  directives: {
    elDragDialog,
  },
  data() {
    return {
      roles: {},
      // button
      buttons: [],

      // dialog
      addOrUpdateDialog: false,
      userDialogTitle: "add",
      userDialogMap: {
        add: "新增用戶",
        edit: "編輯用戶",
      },
      quotaDialog: false,
      unitBDialog: false,

      // 表單相關
      labelPosition: "top",
      userTemp: {
        id: undefined,
        account: "",
        password: "",
        name: "",
        birthday: "",
        uid: "",
        phone: "",
        sex: "",
        status: 1,
        organizationIds: "",
      },
      userRules: {
        name: [{ required: true, message: "請輸入姓名", trigger: "blur" }],
        birthday: [
          { required: true, message: "請選擇出生日期", trigger: "blur" },
        ],
        uid: [{ required: true, message: "請輸入身分證字號", trigger: "blur" }],
        sex: [{ required: true, message: "請選擇性別", trigger: "change" }],
        phone: [{ required: true, message: "請輸入手機號碼", trigger: "blur" }],
      },

      // main data
      total: 200,
      listQuery: {
        page: 20,
        limit: 20,
      },
      multipleSelection: [], // 列表checkbox選中的值

      value: "",
      value1: "",
      gridData: [
        {
          lock: 1,
          pic: "Ｏ",
          name: "王小虎",
          code: "109X20404",
          uid: "A213******",
          birth: "1954-07-18",
          sex: 0,
          phone: "0921079303",
          tel: "0921079303",
          status: 1,
          setting: "功能按鈕",
        },
        {
          lock: 1,
          pic: "Ｏ",
          name: "王小虎",
          code: "109X20404",
          uid: "A223******",
          birth: "1954-07-18",
          sex: 0,
          phone: "0921079303",
          tel: "0921079303",
          status: 0,
          setting: "功能按鈕",
        },
        {
          lock: 0,
          pic: "Ｏ",
          name: "王小虎",
          code: "109X20404",
          uid: "A233******",
          birth: "1954-07-18",
          sex: 1,
          phone: "0921079303",
          tel: "0921079303",
          status: 1,
          setting: "功能按鈕",
        },
      ],
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      options2: [
        {
          value: "1",
          label: "長照",
        },
        {
          value: "2",
          label: "白牌",
        },
        {
          value: "3",
          label: "幸福巴士",
        },
      ],
    };
  },
  methods: {
    // 是否為移動端
    isMobile() {
      const vm = this;
      if (vm.$store.state.app.device === "mobile") {
        return null;
      } else {
        return "right";
      }
    },
    // 獲取本路由下所有功能按鈕
    getButtons() {
      this.$route.meta.elements.forEach((el) => {
        this.buttons.push(el.domId);
      });
    },
    // 是否擁有按鈕功能權限
    hasButton(domId) {
      return this.buttons.includes(domId);
    },
    // 主要按鈕
    handleAddOrUpdate(act) {
      this.userDialogTitle = act;
      this.addOrUpdateDialog = true;
      if (act == "add") {
        this.handleResetUserTemp();
      }
    },
    confirmAddOrUpdate(act) {
      if (act == "add") {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            // alert("submit!");
            console.log(this.userTemp);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    handleEdit(user) {
      this.$router.push(`/alluser/edit/${user.uid}`);
    },
    handleQuota(user) {
      console.log(user);
      this.quotaDialog = true;
    },
    handleUnitB(user) {
      this.unitBDialog = true;
      console.log(this.roles, user);
    },
    handleDetail(user) {
      this.$router.push(`/alluser/detail/${user.uid}`);
    },
    handleDispatch(user) {
      this.$router.push(`/alluser/dispatch/${user.uid}`);
    },
    handleResetUserTemp() {
      // this.$refs.userForm.resetFields();
      this.userTemp = {
        id: undefined,
        account: "",
        password: "",
        name: "",
        birthday: "",
        uid: "",
        phone: "",
        sex: "",
        status: 1,
        organizationIds: "",
      };
      if (this.$refs.userForm) {
        this.$refs.userForm.resetFields();
      }
    },
    // table 功能
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    onBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "unitB":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.handleUnitB(this.multipleSelection[0]);
          break;
        case "add":
          // this.$router.push("/alluser/add/1");
          this.handleAddOrUpdate("add");
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    const vm = this;
    vm.getButtons();

    vm.gridData.forEach((user) => {
      vm.$set(vm.roles, `${user.uid}`, null);
    });
    console.log(vm.roles);
  },
};
</script>

<style lang="scss" scoped>
.buttonFlexBox {
  display: flex;
  justify-content: center;
}
</style>
