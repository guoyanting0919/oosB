<template>
  <div class="flex-column dispatchSelfPay">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button size="mini" @click="handleReservation" type="primary" plain
          >預約</el-button
        >
        <el-button size="mini" @click="handleChange" type="info" plain
          >起訖點互換</el-button
        >
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="白牌車預約"></Title>
      <div class="dispatchContainer bg-white">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="temp"
          :rules="rules"
          ref="form"
        >
          <el-row :gutter="16">
            <el-col :sm="12" :md="8">
              <el-form-item label="預約日期">
                <el-date-picker
                  style="width: 100%"
                  v-model="temp.date"
                  type="date"
                  placeholder="選擇日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8">
              <el-form-item label="預約時間">
                <el-time-select
                  style="width: 100%"
                  v-model="temp.time"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30',
                  }"
                  placeholder="選擇時間"
                >
                </el-time-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8">
              <el-form-item label="搭乘人數">
                <el-select
                  style="width: 100%"
                  v-model="temp.passengerNum"
                  placeholder="選擇搭乘人數"
                >
                  <el-option
                    v-for="num in 20"
                    :key="num"
                    :label="num"
                    :value="num"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8">
              <el-form-item label="車輛類型">
                <el-select
                  style="width: 100%"
                  v-model="temp.carCategoryId"
                  placeholder="選擇車輛類型"
                >
                  <el-option
                    v-for="type in carCategorysList"
                    :key="type.id"
                    :label="type.name"
                    :value="type.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="8">
              <el-form-item label="是否共乘">
                <el-switch
                  active-text="願意共乘"
                  inactive-text="不共乘"
                  v-model="temp.canShared"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="12">
              <el-form-item label="起點">
                <el-autocomplete
                  style="width: 100%"
                  popper-class="my-autocomplete"
                  v-model="temp.fromAddr"
                  :fetch-suggestions="querySearch"
                  placeholder="請選擇起點"
                  @select="handleSelect"
                >
                  <i
                    class="el-icon-edit el-input__icon"
                    slot="suffix"
                    @click="handleIconClick"
                  >
                  </i>
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                    <span class="addr">{{ item.address }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="12">
              <el-form-item label="訖點">
                <el-autocomplete
                  style="width: 100%"
                  popper-class="my-autocomplete"
                  v-model="temp.toAddr"
                  :fetch-suggestions="querySearch"
                  placeholder="請選擇訖點"
                  @select="handleSelect"
                >
                  <i
                    class="el-icon-edit el-input__icon"
                    slot="suffix"
                    @click="handleIconClick"
                  >
                  </i>
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                    <span class="addr">{{ item.address }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import * as categorys from "@/api/categorys";
import * as orderSelfPayUser from "@/api/orderSelfPayUser";
export default {
  name: "dispatchSelfPay",
  components: {
    Sticky,
    Title,
  },
  data() {
    return {
      //車輛類別
      carCategorysList: [],

      // 表單相關
      labelPosition: "top",
      restaurants: [],
      temp: {
        // 日期
        date: "",
        time: "",
        id: "",
        selfPayUserId: "",
        orgId: "",
        reserveDate: "",
        fromAddr: "",
        fromLon: 121.4724972,
        fromLat: 25.0129298,
        toAddr: "",
        toLon: 121.3645382,
        toLat: 25.0589911,
        passengerNum: 1,
        canShared: true,
        status: 1,
        carCategoryId: null,
        CarCategoryName: "",
        // carCategoryName: "",
        // orderNo: "",
        // expectedMinute: 0,
        // totalMileage: 0,
        // highwayMileage: 0,
        // fromAddrRemark: "",
        // toAddrRemark: "",
        // wheelchairType: "",
        // cancelReamrk: "",
        // remark: "",
        // withAmt: 0,
        // totalAmt: 0,
      },
      rules: {
        // Id: [{ required: true, message: "請輸入個案編號", trigger: "blur" }],
        caseUserNo: [{ required: true, message: "必填欄位", tigger: "blur" }],
        orgAId: [{ required: true, message: "必填欄位", tigger: "change" }],
        disabilityLevel: [
          { required: true, message: "必填欄位", tigger: "change" },
        ],
        county: [{ required: true, message: "必填欄位", tigger: "change" }],
        district: [{ required: true, message: "必填欄位", tigger: "change" }],
        addr: [{ required: true, message: "必填欄位", tigger: "blur" }],
        urgentName: [{ required: true, message: "必填欄位", tigger: "blur" }],
        urgentRelationship: [
          { required: true, message: "必填欄位", tigger: "blur" },
        ],
        urgentPhone: [{ required: true, message: "必填欄位", tigger: "blur" }],
        urgentTel: [{ required: true, message: "必填欄位", tigger: "blur" }],
        caseUserStatus: [
          { required: true, message: "必填欄位", tigger: "blur" },
        ],
        reviewDate: [{ required: true, message: "必填欄位" }],
        wealTypeId: [{ required: true, message: "必填欄位", tigger: "change" }],
      },
    };
  },
  methods: {
    //獲取所有車輛類別
    getCarCategorys() {
      const vm = this;
      let query = {
        page: 1,
        limit: 20,
        TypeId: "SYS_CAR",
      };
      categorys.getList(query).then((res) => {
        vm.carCategorysList = res.data;
      });
    },
    //預約訂單
    handleReservation() {
      const vm = this;
      let date = moment(vm.temp.date).format("yyyy-MM-DD");
      vm.temp.selfPayUserId = vm.$route.params.id.split("-")[1];
      vm.temp.reserveDate = `${date} ${vm.temp.time}`;
      vm.temp.CarCategoryName = vm.carCategorysList.filter((car) => {
        return car.id === vm.temp.carCategoryId;
      })[0].name;
      console.log(vm.temp.CarCategoryName);
      orderSelfPayUser.add(vm.temp).then((res) => {
        console.log(res);
      });
    },
    handleChange() {
      let ex = this.temp.startSite;
      this.temp.startSite = this.temp.endSite;
      this.temp.endSite = ex;
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      return [
        { value: "玉峰大橋", address: "24.654981, 121.306182" },
        {
          value: "秀巒部落",
          address: " 24.670562, 121.265620",
        },
        {
          value: "道下",
          address: "24.620131, 121.286526",
        },
      ];
    },
    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    },
  },
  mounted() {
    this.restaurants = this.loadAll();
    this.getCarCategorys();
  },
};
</script>

<style lang="scss" scoped>
.dispatchContainer {
  padding: 24px;
}
.name {
  line-height: 20px;
  font-weight: 700;
}
.addr {
  font-size: 10px;
}
</style>