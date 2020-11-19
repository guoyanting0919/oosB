<template>
  <div class="flex-column orderSelfPayUser">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 車行選擇 -->
        <el-input
          style="width: 200px; margin-right: 0.5rem"
          size="mini"
          v-model="value"
          clearable
          placeholder="請輸入關鍵字"
        ></el-input>

        <!-- 日期選擇 -->
        <el-date-picker
          size="mini"
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="開始日期"
          end-placeholder="结束日期"
        ></el-date-picker>

        <!-- 權限按鈕 -->
        <permission-btn
          moduleName="builderTables"
          size="mini"
          v-on:btn-event="onBtnClicked"
        ></permission-btn>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <!-- 全部訂單 -->
      <Title title="白牌車訂單"></Title>
      <div class="bg-white customScrollBar" style="height: calc(100% - 50px)">
        <div class="orderTableContainer customScrollBar">
          <div class="orderFilterContainer">
            <OrderStatusTag size="big" type="default"></OrderStatusTag>
            <OrderStatusTag size="big" type="newOrder"></OrderStatusTag>
            <OrderStatusTag size="big" type="ready"></OrderStatusTag>
            <OrderStatusTag size="big" type="arrival"></OrderStatusTag>
            <OrderStatusTag size="big" type="boarding"></OrderStatusTag>
            <OrderStatusTag size="big" type="complete"></OrderStatusTag>
            <OrderStatusTag size="big" type="cancel"></OrderStatusTag>
          </div>
          <div v-for="order in list" :key="order.id" class="orderContainer">
            <div class="orderLeft">
              <div class="orderLeftTitle">訂單編號 {{ order.orderNo }}</div>
              <div class="orderLeftDetail">
                <p>單位：『目前沒有』</p>
                <p>車種類型：{{ order.carCategoryName }}</p>
                <p>預約時間：{{ order.reserveDate | dateFilter }}</p>
                <p>建立時間：{{ order.createDate | dateFilter }}</p>
                <!-- <p>行程：回程</p> -->
                <!-- <p>訂車人身分：B單位</p> -->
              </div>
            </div>
            <div class="orderCenter">
              <div class="orderCenterTitle">
                <p class="isCarpool">
                  <span v-if="order.canShared">可共乘</span>
                  <span v-else>不可共乘</span>
                </p>
                <!-- <span>預估時間</span> -->

                <p>搭乘人數：{{ order.passengerNum }}人</p>
              </div>
              <div class="orderCenterDetail">
                <div class="driverInfo">
                  <div class="driverName">
                    {{ order.userName }}
                  </div>
                  <div class="userId">
                    聯絡電話：{{ order.noticePhone || "0934343234" }}
                  </div>
                  <i
                    style="margin-right: 4px"
                    class="iconfont icon-member"
                    v-for="item in order.passengerNum"
                    :key="item"
                  ></i>
                </div>
                <div class="addressInfo">
                  <p class="startAdd textNoWrap">
                    {{ order.fromAddr }}
                  </p>
                  <i class="iconfont icon-down"></i>
                  <p class="endAdd textNoWrap">{{ order.toAddr }}</p>
                </div>
              </div>
            </div>
            <div class="orderRight">
              <div class="orderRightTitle">
                <p class="orderStatus">
                  <OrderStatusTag
                    :type="orderStatusMapping[order.status - 1]"
                    size="mini"
                  ></OrderStatusTag>
                </p>
              </div>
              <div class="orderRightDetail">
                <div class="rightBtnBox">
                  <button
                    class="orderButton orderDetail"
                    @click="handleCheck(order.id)"
                  >
                    查看訂單
                  </button>
                  <button class="orderButton orderEdit">編輯訂單</button>
                  <button class="orderButton orderStatus">修改狀態</button>
                  <button class="orderButton orderCancel">取消訂單</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="handleCurrentChange"
        />
      </div>
    </div>

    <!-- violation dialog -->
    <!-- <el-dialog
      v-el-drag-dialog
      title="各車行違規點數"
      :visible.sync="violationDialog"
    >
      <el-table :data="gridData">
        <el-table-column
          property="date"
          label="日期"
          width="150"
        ></el-table-column>
        <el-table-column
          property="name"
          label="姓名"
          width="200"
        ></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table>
    </el-dialog> -->
  </div>
</template>

<script>
import moment from "moment";
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import permissionBtn from "@/components/PermissionBtn";
import elDragDialog from "@/directive/el-dragDialog";
import Pagination from "@/components/Pagination";
import OrderStatusTag from "@/components/OrderStatusTag";
import * as orderSelfPayUser from "@/api/orderSelfPayUser";
export default {
  name: "orderSelfPayUser",
  components: {
    Sticky,
    Title,
    permissionBtn,
    Pagination,
    OrderStatusTag,
  },
  directives: {
    elDragDialog,
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
        "cancel",
        "cancel",
        "cancel",
      ],

      value: "",
      value1: "",

      violationDialog: false,
    };
  },
  methods: {
    //獲取訂單
    getList() {
      const vm = this;
      orderSelfPayUser.load(vm.listQuery).then((res) => {
        vm.list = res.data;
        vm.total = res.count;
      });
    },
    onBtnClicked(domId) {
      //   console.log(domId);
      switch (domId) {
        case "violationBtn":
          this.violationDialog = true;
          break;
        default:
          break;
      }
    },
    handleCheck(id) {
      this.$router.push({
        path: `/orderselfpayuser/check/${id}`,
        query: { type: "first" },
      });
    },
    // 換頁
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss"></style>
