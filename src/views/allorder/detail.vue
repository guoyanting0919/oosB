<template>
  <div class="flex-column allOrderDetail">
    <sticky :className="'sub-navbar'">
      <el-button type="info" plain size="mini">回列表</el-button>
    </sticky>
    <div class="app-container flex-item">
      <Title title="訂單總覽"></Title>
      <div class="formContainer bg-white">
        <el-tabs v-model="activeName">
          <el-tab-pane label="訂單明細" name="first">
            <div class="tabContainer">
              <div class="orderBox">
                <div class="orderBoxDetail"></div>
                <div class="orderCost"></div>
              </div>
              <div class="routeBox">
                <div class="routeTitle"></div>
                <div class="routeMap"></div>
                <div class="routeDriver">
                  <div class="caseUserDetailBox"></div>
                  <div class="routeTimeBox"></div>
                </div>
              </div>
              <div class="orderCostDetail"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="行車歷程" name="second">
            <div class="tabContainer">
              <div class="caseUserBox"></div>
              <div class="routeMain"></div>
              <div class="costBox"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="個案基本資料" name="third">
            <div class="tabContainer">
              <div class="caseUserHeader">
                <div class="caseUserNo"></div>
                <div class="caseUserStatus"></div>
                <div class="caseUserPay"></div>
              </div>
              <div class="caseUserMainContainer">
                <div class="caseUserNameBox"></div>
                <div class="caseUserDetailMain">
                  <div class="caseUserMainTop"></div>
                  <div class="caseUserMainBottom"></div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="個案可用輔助" name="fourth">
            <div class="tabContainer">
              <div class="userPayHeader">
                <div class="caseUserNo"></div>
                <div class="userStatus"></div>
              </div>
              <div class="userPayMainContainer">
                <div class="userPayUserDetail"></div>
                <div class="userPayMainData"></div>
                <div class="userPayRoute"></div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
export default {
  name: "allOrderDetail",
  components: {
    Sticky,
    Title,
  },
  data() {
    return {
      activeName: "",
    };
  },
  mounted() {
    // console.log(this.$route);
    this.activeName = this.$route.query.type || "first";
  },
};
</script>

<style lang='scss' scoped>
.formContainer {
  padding: 8px 16px;
  height: calc(100% - 50px);
}
.tabContainer {
  height: calc(100vh - 320px);
  background: lightcyan;
  display: flex;
  flex-wrap: wrap;
}
.orderBox {
  width: 20%;
  height: 100%;
  background: lightgoldenrodyellow;
}
.orderBoxDetail {
  background-image: linear-gradient(
    180deg,
    #f3981a 0%,
    #f3971a 36%,
    #fd8115 79%
  );
  height: 80%;
}
.orderCost {
  height: 20%;
  background-image: linear-gradient(
    180deg,
    #000000 0%,
    #1f1f1f 36%,
    #292828 79%
  );
}
.routeBox {
  width: 70%;
  background: limegreen;
  height: 100%;
}
.routeTitle {
  height: 10%;
  background: lightseagreen;
}
.routeMap {
  height: 40%;
  background: lightskyblue;
}
.routeDriver {
  height: 50%;
  background: khaki;
  display: flex;
}
.caseUserDetailBox {
  width: 30%;
  height: 100%;
  background: lightgray;
}
.routeTimeBox {
  width: 70%;
  height: 100%;
  background: lightsalmon;
}
.orderCostDetail {
  width: 10%;
  height: 100%;
  background: lemonchiffon;
}
.caseUserBox {
  width: 20%;
  height: 100%;
  background-image: linear-gradient(
    180deg,
    #f3981a 0%,
    #f3971a 36%,
    #fd8115 79%
  );
}
.routeMain {
  width: 70%;
  height: 100%;
  background: lightyellow;
}
.costBox {
  width: 10%;
  height: 100%;
  background-image: linear-gradient(
    180deg,
    #474747 0%,
    #202020 36%,
    #000000 79%
  );
}
.caseUserHeader {
  height: 10%;
  width: 100%;
  background: lime;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.caseUserNo {
  height: 100%;
  width: 20%;
  background-image: linear-gradient(
    90deg,
    #f3981a 0%,
    #f3971a 36%,
    #fd8115 79%
  );
}
.caseUserStatus {
  width: 65%;
  height: 100%;
  background: magenta;
}
.caseUserPay {
  width: 15%;
  height: 100%;
  background: #000;
}
.caseUserMainContainer {
  height: calc(90% - 1rem);
  width: 100%;
  background: forestgreen;
  display: flex;
}
.caseUserNameBox {
  height: 100%;
  width: 20%;
  background: lightsalmon;
  margin-right: 1rem;
}
.caseUserDetailMain {
  height: 100%;
  width: calc(80% - 1rem);
  background: lightseagreen;
}
.caseUserMainTop {
  width: 100%;
  height: 70%;
  background: lightsteelblue;
  margin-bottom: 1rem;
}
.caseUserMainBottom {
  width: 100%;
  height: calc(30% - 1rem);
  background: lightyellow;
}
.userPayHeader {
  width: 100%;
  height: 10%;
  background: lightyellow;
  display: flex;
  margin-bottom: 1rem;
}
.userStatus {
  margin-left: 1rem;
  width: calc(80% - 1rem);
  background: lightseagreen;
}
.userPayMainContainer {
  width: 100%;
  height: calc(90% - 1rem);
  display: flex;
  background: lightsteelblue;
}
.userPayUserDetail {
  width: 20%;
  height: 100%;
  background: magenta;
  margin-right: 1rem;
}
.userPayMainData {
  height: 100%;
  width: calc(40% - 1rem);
  background: mediumaquamarine;
  margin-right: 1rem;
}
.userPayRoute {
  height: 100%;
  width: calc(40% - 1rem);
  background: moccasin;
}
</style>