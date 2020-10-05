<template>
  <div class="flex-column allUser">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 關鍵字搜尋 -->
        <el-input
          style="width:200px;margin-right:0.5rem"
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
      <Title title="全部個案資料"></Title>
      <div class="bg-white" style="height:calc(100% - 50px)">
        <el-table
          ref="mainTable"
          height="calc(100% - 52px)"
          :data="gridData"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
          @row-click="rowClick"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          ></el-table-column>
          <el-table-column
            property="pic"
            label="照片"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            property="lock"
            label="鎖定狀態"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <i
                  style="color:#409167"
                  v-if="scope.row.lock"
                  class="iconfont icon-Vector21"
                ></i>
                <i
                  style="color:#d63737"
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
            property="code"
            label="個案編號"
            width="140"
            align="center"
          ></el-table-column>
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
                  style="color:#d63737"
                  v-if="scope.row.sex"
                  class="iconfont icon-Vector5"
                ></i>
                <i
                  style="color:#227294"
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
          <el-table-column
            property="tel"
            label="市話"
            width="170"
            align="center"
          ></el-table-column>
          <el-table-column
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
          </el-table-column>
          <el-table-column
            property="setting"
            label="操作"
            :fixed="isMobile()"
            width="270"
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
                  v-if="hasButton('detail')"
                  >檢視</el-button
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
      // button
      buttons: [],

      // dialog
      quotaDialog: false,
      unitBDialog: false,

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
          uid: "A203******",
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
          uid: "A203******",
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
          uid: "A203******",
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
    handleEdit(user) {
      this.$router.push(`/alluser/edit/${user.uid}`);
    },
    handleQuota(user) {
      console.log(user);
      this.quotaDialog = true;
    },
    handleUnitB(user) {
      this.unitBDialog = true;
      console.log(user);
    },
    handleDetail(user) {
      this.$router.push(`/alluser/detail/${user.uid}`);
    },
    handleDispatch(user) {
      this.$router.push(`/alluser/dispatch/${user.uid}`);
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
          this.$router.push("/alluser/add/1");
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.getButtons();
  },
};
</script>

<style lang="scss" scoped>
.buttonFlexBox {
  display: flex;
  justify-content: center;
}
</style>
