<template>
  <div class="flex-column allUser">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 關鍵字搜尋 -->
        <el-input
          style="width: 200px; margin-right: 0.5rem"
          size="mini"
          v-model="listQuery.key"
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
          :data="list"
          border
          fit
          v-loading="listLoading"
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
          <el-table-column
            property="uid"
            label="身分證字號"
            width="140"
            align="center"
          ></el-table-column>
          <el-table-column
            property="birthday"
            label="生日"
            width="140"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.birthday | dateFilter }}</span>
            </template>
          </el-table-column>
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
                  v-if="!scope.row.sex"
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
                v-model="roles[scope.row.id]"
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
                  @click="handleAddOrEdit('edit', scope.row)"
                  type="warning"
                  v-if="hasButton('edit')"
                  >編輯</el-button
                >
                <el-button
                  size="mini"
                  @click="handleDetail(scope.row)"
                  type="success"
                  v-if="hasButton('detail')"
                  >檢視</el-button
                >
                <el-button
                  size="mini"
                  @click="handleUnitB(scope.row)"
                  type="primary"
                  v-if="hasButton('unitB') && roles[scope.row.id] == '1'"
                  >B單位</el-button
                >
                <el-button
                  size="mini"
                  @click="handleQuota(scope.row)"
                  type="primary"
                  v-if="hasButton('quota') && roles[scope.row.id] == '1'"
                  >額度</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-if="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
        />
      </div>
    </div>

    <!-- addOrUpdateDialog 新增/修改用戶基本資料-->
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
                value-format="yyyy-MM-dd"
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
                <el-option :value="0" :label="'女'">女</el-option>
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
        <el-button type="primary" @click="confirmAddOrUpdate()"
          >確 定</el-button
        >
      </span>
    </el-dialog>

    <!-- rolesDialog -->
    <el-dialog title="新增身份" :visible.sync="rolesDialog" width="30%">
      <!-- <span>用戶身份</span> -->
      <el-select v-model="roleSelect" placeholder="請為用戶選擇身份">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleRole(roleSelect)"
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
    <el-dialog
      :title="unitBDialogTitle"
      :visible.sync="unitBDialog"
      width="50%"
    >
      <el-checkbox-group v-model="checkedUnitBs" :min="0" :max="3">
        <el-checkbox
          v-for="unitB in unitBs"
          :label="unitB.name"
          :key="unitB.id"
        ></el-checkbox>
      </el-checkbox-group>
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
import { mapGetters } from "vuex";
import elDragDialog from "@/directive/el-dragDialog";
import Pagination from "@/components/Pagination";
import moment from "moment";
import * as users from "@/api/users";
import * as orgs from "@/api/orgs";
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
    // 身份證字號驗證
    // let checkUid = (rule, value, callback) => {
    //   // 依照字母的編號排列，存入陣列備用。
    //   let letters = new Array(
    //     "A",
    //     "B",
    //     "C",
    //     "D",
    //     "E",
    //     "F",
    //     "G",
    //     "H",
    //     "J",
    //     "K",
    //     "L",
    //     "M",
    //     "N",
    //     "P",
    //     "Q",
    //     "R",
    //     "S",
    //     "T",
    //     "U",
    //     "V",
    //     "X",
    //     "Y",
    //     "W",
    //     "Z",
    //     "I",
    //     "O"
    //   );
    //   // 儲存各個乘數
    //   let multiply = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1);
    //   let nums = new Array(2);
    //   let firstChar;
    //   let firstNum;
    //   let lastNum;
    //   let total = 0;
    //   if (!value) {
    //     return callback(new Error("請輸入分證字號"));
    //   } else {
    //     let regExpID = /^[a-z](1|2)\d{8}$/i;
    //     if (value.search(regExpID) == -1) {
    //       return callback(new Error("格式錯誤"));
    //     } else {
    //       // 取出第一個字元和最後一個數字。
    //       firstChar = value.charAt(0).toUpperCase();
    //       lastNum = value.charAt(9);
    //     }
    //     for (let i = 0; i < 26; i++) {
    //       if (firstChar == letters[i]) {
    //         firstNum = i + 10;
    //         nums[0] = Math.floor(firstNum / 10);
    //         nums[1] = firstNum - nums[0] * 10;
    //         break;
    //       }
    //     }
    //     // 執行加總計算
    //     for (let i = 0; i < multiply.length; i++) {
    //       if (i < 2) {
    //         total += nums[i] * multiply[i];
    //       } else {
    //         total += parseInt(value.charAt(i - 1)) * multiply[i];
    //       }
    //     }
    //     // 和最後一個數字比對
    //     if (10 - (total % 10) != lastNum && 10 - (total % 10) != 10) {
    //       // console.log(10 - (total % 10), lastNum);
    //       return callback(new Error("格式錯誤"));
    //     } else {
    //       // console.log(10 - (total % 10), lastNum);
    //       callback();
    //     }
    //   }
    // };
    return {
      // B單位相關
      unitBId: "802cdce7-1474-438f-b616-777cff9db321",
      unitBs: "",
      checkedUnitBs: [],

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
      rolesDialog: false,

      // table相關
      list: [],
      listLoading: false,
      listQuery: {
        // 查詢條件
        page: 1,
        limit: 20,
        orgId: "",
        key: undefined,
      },
      total: 0,
      multipleSelection: [], // 列表checkbox選中的值

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
        name: [
          { required: true, message: "請輸入姓名", trigger: "blur" },
          {
            min: 2,
            max: 99,
            message: "姓名長度最少兩字",
            trigger: "blur",
          },
        ],
        birthday: [
          { required: true, message: "請選擇出生日期", trigger: "blur" },
        ],
        uid: [
          { required: true, message: "請輸入身分證字號", trigger: "blur" },
          // { validator: checkUid, trigger: "blur" },
        ],
        sex: [{ required: true, message: "請選擇性別", trigger: "change" }],
        phone: [
          { required: true, message: "請輸入手機號碼", trigger: "blur" },
          {
            min: 8,
            max: 13,
            message: "號碼長度應為 8 ~ 13 碼",
            trigger: "blur",
          },
        ],
      },

      roleSelect: "",

      value: "",
      value1: "",

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
    // 獲取用戶資料
    async getList() {
      const vm = this;
      vm.listLoading = true;
      await users.getClientList(vm.listQuery).then((res) => {
        // console.log(res);
        vm.list = res.data;
        vm.total = res.count;
        vm.listLoading = false;
      });
      // console.log("ss", vm.list);
    },
    // 獲取所有B單位
    getUnitBs() {
      const vm = this;
      orgs.getSubOrgs({ orgId: vm.unitBId }).then((res) => {
        vm.unitBs = res.data.filter((org) => {
          return org.id !== vm.unitBId;
        });
      });
    },
    // 主要按鈕
    handleAddOrEdit(act, user) {
      const vm = this;
      vm.userDialogTitle = act;
      if (act == "add") {
        vm.handleResetUserTemp();
        vm.addOrUpdateDialog = true;
      } else {
        console.log(act, user);
        console.log(vm.roles[user.id]);
        // vm.addOrUpdateDialog = true;
      }
    },
    // 確認新增/修改用戶基本資料
    confirmAddOrUpdate() {
      const vm = this;
      let act = vm.userDialogTitle;
      if (act == "add") {
        vm.$refs.userForm.validate((valid) => {
          if (valid) {
            // alert("submit!");
            vm.userTemp.organizationIds = vm.defaultorgid;
            vm.userTemp.password = moment(vm.userTemp.birthday).format(
              "YYYYMMDD"
            );
            vm.userTemp.account = vm.userTemp.uid;
            console.log("vm.userTemp", vm.userTemp);
            users.addClient(vm.userTemp).then((res) => {
              console.log(res);
              vm.addOrUpdateDialog = false;
              vm.getList();
            });
          } else {
            console.log("error submit!!", vm.defaultorgid);
            return false;
          }
        });
      } else {
        vm.$refs.userForm.validate((valid) => {
          if (valid) {
            // alert("submit!");
            console.log(vm.userTemp);
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
      const vm = this;
      vm.unitBDialog = true;
      vm.checkedUnitBs = [];
      console.log(user);
    },
    handleDetail(user) {
      this.$router.push(`/alluser/detail/${user.uid}`);
    },
    handleRole(role) {
      switch (role) {
        case "1":
          this.$router.push(
            `/alluser/addCaseUserRole/${this.multipleSelection[0].id}`
          );
          break;
        case "2":
          console.log("2222");
          break;
        case "3":
          this.$router.push(
            `/alluser/addCaseUserRole/${this.multipleSelection[0].id}`
          );
          break;
        default:
          break;
      }
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
          this.handleAddOrEdit("add");
          break;
        case "editBasic":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.handleAddOrEdit("edit", this.multipleSelection[0]);
          break;
        case "addRole":
          if (this.multipleSelection.length == 0) {
            console.log(0);
          } else if (this.multipleSelection.length > 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          } else {
            this.rolesDialog = true;
            // this.$router.push(
            //   `/alluser/addCaseUserRole/${this.multipleSelection[0].id}`
            // );
          }

          break;
        default:
          break;
      }
    },
  },
  computed: {
    ...mapGetters(["defaultorgid"]),
    unitBDialogTitle() {
      return `B單位 ( ${this.checkedUnitBs.length}/3 )`;
    },
  },
  filters: {
    dateFilter(date) {
      let res = moment(date).format("YYYY-MM-DD");
      return res;
    },
  },
  async mounted() {
    const vm = this;
    vm.getButtons();
    vm.getUnitBs();
    await vm.getList();
    // console.log(vm.list);
    vm.list.forEach((user) => {
      vm.$set(vm.roles, `${user.id}`, null);
    });
    // console.log(vm.roles);
  },
};
</script>

<style lang="scss" scoped>
.buttonFlexBox {
  display: flex;
  justify-content: flex-start;
  transition: 0.3s;
}

.allUser {
  .el-checkbox {
    width: 50%;
    margin-right: 0;
    margin-bottom: 1rem;
  }
}
</style>
