<template>
  <div class="flex-column dispatch">
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

    <div style="padding-bottom: 0px" class="app-container flex-item">
      <Title title="白牌車表格式調度台"></Title>
      <div class="bg-white formContainer" style="height: calc(100% - 50px)">
        <SubTitle title="新訂單"></SubTitle>
        <div class="bg-white newOrderContainer">
          <p
            style="color: red; font-size: 14px; width: 100%; text-align: center"
            v-if="newOrderList.length == 0"
          >
            暫無新訂單
          </p>
          <transition-group
            name="fade-transform"
            mode="out-in"
            class="newOrderContainer"
          >
            <div v-for="item in newOrderList" :key="item.id" class="orderCard">
              <div class="orderCardTitle" v-if="newOrderList">
                <p>{{ item.carCategoryName }}</p>
                <!-- <p>普通輪椅(可收拆)</p> -->
                <p v-if="item.canShared">可共乘</p>
                <p v-else>不可共乘</p>
                <p>{{ item.passengerNum }}人搭乘</p>
                <el-button
                  @click="handleReceive(item.id)"
                  size="mini"
                  type="success"
                  style="padding: 3px 8px; margin-left: auto"
                  >接收</el-button
                >
              </div>
              <div class="orderCardMain">
                <div class="orderInfo">
                  <p class="orderInfoName">{{ item.userName }}</p>
                  <p>聯絡電話 : {{ item.noticePhone }}</p>
                </div>
                <p class="orderTime">
                  {{ item.reserveDate | dateFilter }}
                </p>
                <div class="orderAddr">
                  <i class="iconfont icon-circle"></i>
                  <i class="iconfont icon-Vector10"></i>
                  <p class="startAddr">
                    {{ item.fromAddr }}
                  </p>
                  <p class="endAddr">{{ item.toAddr }}</p>
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <SubTitle title="調度台"></SubTitle>
        <div class="bg-white formContainer" style="height: 100%">
          <el-table
            ref="mainTable"
            height="calc(100% - 52px)"
            :data="list"
            border
            fit
            v-loading="listLoading"
            highlight-current-row
            @selection-change="handleSelectionChange"
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <el-table-column
              align="center"
              property="userName"
              label="姓名"
              width="100"
            >
            </el-table-column>
            <el-table-column
              align="center"
              property="userName"
              label="訂單狀態"
              width="100"
            >
              <template slot-scope="scope">
                <OrderStatusTag
                  :type="orderStatusMapping[scope.row.status - 1]"
                ></OrderStatusTag>
              </template>
            </el-table-column>
            <el-table-column
              property="reserveDate"
              label="預約乘車時間"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <span style="margin-left: 10px"
                  >{{ scope.row.reserveDate | dateFilter }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              property="orgId"
              label="所屬單位"
              align="center"
              width="130"
            >
              『orgName 目前沒抓到』
            </el-table-column>
            <el-table-column property="name" label="起訖點" width="400">
              <template slot-scope="scope">
                <div class="orderAddr">
                  <i class="iconfont icon-circle"></i>
                  <i class="iconfont icon-Vector10"></i>
                  <p class="startAddr">
                    {{ scope.row.fromAddr }}
                  </p>
                  <p class="endAddr">{{ scope.row.toAddr }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              property="canShared"
              label="可否共乘"
              align="center"
              width="130"
            >
              <template slot-scope="scope">
                <div>
                  <el-tag v-if="scope.row.canShared" size="mini" type="success"
                    >共乘</el-tag
                  >
                  <el-tag v-else size="mini" type="danger">不共乘</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              property="carCategoryName"
              label="車輛類型"
              width="130"
              align="center"
            >
            </el-table-column>
            <el-table-column
              property="passengerNum"
              label="搭乘人數"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              property="driver"
              label="司機"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.driverInfoId"
                  filterable
                  size="mini"
                  placeholder="選擇司機"
                  :disabled="scope.row.status != 1"
                >
                  <el-option
                    v-for="driver in driverList"
                    :key="driver.id"
                    :label="driver.userName"
                    :value="driver.id"
                  >
                    {{ driver.userName }} / {{ driver.phone }}
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              property="car"
              label="車輛"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.carId"
                  filterable
                  size="mini"
                  placeholder="選擇車輛"
                  :disabled="scope.row.status != 1"
                >
                  <el-option
                    v-for="car in carList"
                    :key="car.id"
                    :label="car.carNo"
                    :value="car.id"
                  >
                    {{ car.carCategoryName || "一般車" }} /
                    {{ car.seatNum }}人座 /
                    {{ car.carNo }}
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="'操作'"
              fixed="right"
              width="300"
            >
              <template slot-scope="scope">
                <div class="buttonFlexBox">
                  <el-button
                    type="info"
                    size="mini"
                    v-if="scope.row.status == 1"
                    @click="handleRoster(scope.row)"
                    >排班</el-button
                  >
                  <el-button
                    type="success"
                    size="mini"
                    v-if="scope.row.status !== 1"
                    disabled
                    @click="handleUpdate(scope.row)"
                    >編輯訂單</el-button
                  >
                  <el-button
                    type="warning"
                    size="mini"
                    v-if="scope.row.status !== 1"
                    disabled
                    @click="handleUpdate(scope.row)"
                    >變更司機</el-button
                  >
                  <el-button
                    size="mini"
                    disabled
                    type="danger"
                    @click="handleModifyStatus(scope.row, true)"
                    >取消排班</el-button
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
            @pagination="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import * as signalR from "@aspnet/signalr";
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";
import SubTitle from "@/components/SubTitle";
import Pagination from "@/components/Pagination";
import OrderStatusTag from "@/components/OrderStatusTag";
import * as orderSelfPayUser from "@/api/orderSelfPayUser";
import * as drivers from "@/api/drivers";
import * as cars from "@/api/cars";
import * as dispatchSelfPayUser from "@/api/dispatchSelfPayUser";
export default {
  name: "dispatch",
  components: {
    Sticky,
    Title,
    permissionBtn,
    SubTitle,
    Pagination,
    OrderStatusTag,
  },
  computed: {
    ...mapGetters(["defaultorgid"]),
  },
  filters: {
    dateFilter(date) {
      let day = moment(date).format("yyyy-MM-DD");
      let time = moment(date).format("HH:mm");
      return `${day} ${time}`;
    },
  },
  data() {
    return {
      //司機列表
      driverList: [],
      //車輛列表
      carList: [],
      // 無組織訂單
      newOrderList: [],

      //table
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        key: undefined,
      },
      multipleSelection: [], // 列表checkbox選中的值

      // order status mapping
      orderStatusMapping: [
        "newOrder",
        "ready",
        "arrival",
        "boarding",
        "complete",
        "cancel",
      ],
      // signalR
      hubConnection: new signalR.HubConnectionBuilder()
        .withUrl("http://openauth.1966.org.tw/api/chatHub")
        .build(),
      value: "",
    };
  },
  methods: {
    onBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "delete":
          this.handleDeleteOrders(this.multipleSelection);
          break;

        default:
          break;
      }
    },
    handleModifyStatus() {},
    //獲取派遣訂單
    getList() {
      const vm = this;
      vm.listLoading = true;
      dispatchSelfPayUser.load(vm.listQuery).then((res) => {
        vm.list = res.data.map((d) => {
          d.driver = "";
          d.car = "";
          return d;
        });
        vm.total = res.count;
        vm.listLoading = false;
      });
    },
    //獲取無組織訂單
    async getListNoOrg() {
      const vm = this;
      await orderSelfPayUser.loadNoOrg({ key: undefined }).then((res) => {
        vm.newOrderList = res.data;
      });
    },
    // 獲取所有司機
    getDriverList() {
      const vm = this;
      vm.listLoading = true;
      drivers.load({ limit: 9999, page: 1 }).then((res) => {
        vm.driverList = res.data;
      });
    },
    // 獲取所有車輛
    getCarList() {
      const vm = this;
      vm.listLoading = true;
      cars.load({ limit: 9999, page: 1 }).then((res) => {
        vm.carList = res.data;
      });
    },
    //批次刪除訂單
    handleDeleteOrders(car) {
      const vm = this;
      vm.$swal({
        title: "刪除提示",
        text: `確認刪除已選取訂單?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#227294",
        cancelButtonColor: "#d63737",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.value) {
          let ids = car.map((c) => c.id);
          orderSelfPayUser.remove(ids).then((res) => {
            vm.$alertT.fire({
              icon: "success",
              title: res.message,
            });
            vm.getList();
          });
        } else {
          vm.$alertT.fire({
            icon: "info",
            title: `已取消刪除`,
          });
        }
      });
    },
    //接收訂單
    handleReceive(orderId) {
      const vm = this;
      console.log(orderId);
      orderSelfPayUser
        .receive({
          id: orderId,
          orgId: vm.defaultorgid,
        })
        .then((res) => {
          console.log(res);
        });
    },
    //排班
    handleRoster(order) {
      const vm = this;
      if (order.driverInfoId == null || order.carId == null) {
        vm.$alertM.fire({
          icon: "error",
          title: `請確實選擇司機及車輛`,
        });
        return;
      }
      console.log(order);
      let data = {
        id: order.id,
        driverInfoId: order.driverInfoId,
        carId: order.carId,
        driverInfoName: vm.driverList.filter((d) => {
          return d.id == order.driverInfoId;
        })[0].userName,
        carNo: vm.carList.filter((c) => {
          return c.id == order.carId;
        })[0].carNo,
      };
      console.log(data);
      dispatchSelfPayUser.addOrUpdate(data).then((res) => {
        console.log(res);
        vm.$alertT.fire({
          icon: "success",
          title: res.message,
        });
        vm.getList();
      });
    },
    //signalR
    //建立連線
    connectHub() {
      const vm = this;
      vm.hubConnection
        .start()
        .then(() => {
          console.log("signalR success connect");
          vm.addListener();
          vm.addListenerReceive();
          vm.addToGroup();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //建立監聽
    addListener() {
      const vm = this;
      vm.hubConnection.on("ReceiveOrderMessage", function (order) {
        console.info("update success!", order);
        // vm.signalRMsg = `${user}`;
        vm.$alertT.fire({
          icon: "success",
          title: "有一筆新訂單",
        });
        vm.newOrderList.push(order);
      });
    },
    //建立接收成功signalR
    addListenerReceive() {
      const vm = this;
      vm.hubConnection.on("ReceiveOrderHide", function (orderId) {
        console.info("update success!", orderId);
        // vm.signalRMsg = `${user}`;
        vm.$alertT.fire({
          icon: "success",
          title: `成功接收訂單(${orderId})`,
        });
        vm.newOrderList = vm.newOrderList.filter(function (order) {
          return order.id != orderId;
        });
        vm.getList();
        // vm.newOrderList.push(order);
      });
    },
    //加入分組
    addToGroup() {
      const vm = this;
      vm.hubConnection
        .invoke("AddToGroup", vm.defaultorgid)
        .then(() => {
          console.log("addToGroup success");
        })
        .catch(function (err) {
          return console.error(err);
        });
    },
    // 換頁
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    // table 功能
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  async mounted() {
    this.connectHub();
    this.getDriverList();
    this.getCarList();
    await this.getListNoOrg();
    this.getList();
  },
  beforeDestroy() {
    // Make sure to cleanup SignalR event handlers when removing the component
    this.hubConnection.stop();
  },
};
</script>

<style lang='scss' scoped>
.newOrderContainer {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.orderCard {
  width: 320px;
  margin-right: 0.5rem;
  height: auto;
  background: #fff;
  border: 2px solid #fa8c16;
  border-top: 5px solid #fa8c16;
  border-radius: 0px 0px 8px 8px;
  margin-bottom: 1rem;
}
.orderCardTitle {
  height: 38px;
  color: #fff;
  background: #fa8c16;
  padding: 0.5rem;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  p {
    margin-right: 1rem;
  }
}
.orderCardMain {
  padding: 0.5rem;
  font-size: 14px;
  font-weight: 700;
}
.orderInfo {
  color: #fa8c16;
  display: flex;
  margin-bottom: 0.5rem;

  p {
    margin-right: 1rem;
  }
}
.orderInfoName {
  color: #000;
  font-size: 1rem;
}
.orderTime {
  margin-bottom: 0.5rem;
}
.orderAddr {
  padding-left: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 45px;
  border-left: 3px dotted #fa8c16;
  position: relative;

  .icon-circle {
    font-weight: 500;
    color: #fa8c16;
    position: absolute;
    left: -9px;
    top: -1px;
    background: #fff;
  }

  .icon-Vector10 {
    font-weight: 500;
    color: #fa8c16;
    position: absolute;
    left: -9px;
    bottom: -1px;
    background: #fff;
  }
}

.startAddr {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.endAddr {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>