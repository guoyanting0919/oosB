<template>
  <div class="flex-column allUserDispatch">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <!-- <el-button size="mini" type="primary">立即預約</el-button>
        <el-button size="mini" type="info">新增下個地點</el-button>-->
        <el-button size="mini" type="info">可用補助額查詢</el-button>
        <el-button size="mini" type="success">回列表</el-button>
      </div>
    </sticky>

    <!-- main -->
    <div class="app-container flex-item">
      <div class="mainContainer">
        <!-- google map -->
        <div class="mapContainer">
          <div id="map" ref="map" style="width: 100%; height: 100%"></div>
        </div>

        <!-- dispatch -->
        <div class="dispatchContainer">
          <div class="caseUserName">name</div>
          <div class="dispatchDetail customScrollBar">
            <el-form
              :label-position="labelPosition"
              label-width="200px"
              :model="temp"
              :rules="rules"
              ref="form"
            >
              <el-row :gutter="8">
                <el-col :sm="24" :md="15">
                  <el-form-item label="乘車日期" prop="Id">
                    <el-date-picker
                      v-model="temp.Id"
                      type="date"
                      placeholder="請選擇乘車日期"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="9" v-if="temp.Id">
                  <el-form-item label="乘車時間" prop="Id">
                    <el-time-picker
                      v-model="temp.Id2"
                      placeholder="請選擇乘車時間"
                      style="width: 100%"
                    ></el-time-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="24">
                  <div>
                    <span class="unitBTitle"
                      >優先搭乘車行排序 (請依序點擊完成排序)</span
                    >
                    <div class="unitBContainer">
                      <div class="unitBBox"></div>
                      <div class="unitBBox"></div>
                      <div class="unitBBox"></div>
                      <div class="unitBBox"></div>
                    </div>
                  </div>
                </el-col>
                <el-col :sm="24" :md="24">
                  <el-form-item label="訂車人身份" prop="Id">
                    <el-select
                      clearable
                      v-model="temp.Id"
                      placeholder="請選擇訂車人身份"
                      style="width: 100%"
                    >
                      <el-option :value="1" :label="'男'">男</el-option>
                      <el-option :value="2" :label="'女'">女</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="18">
                  <el-form-item label="起點" prop="Id">
                    <el-input
                      v-model="temp.Id"
                      placeholder="請輸入起點"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="6">
                  <el-form-item label="起點備註" prop="Id">
                    <el-select
                      clearable
                      v-model="temp.Id"
                      placeholder="請選擇備註"
                      style="width: 100%"
                    >
                      <el-option :value="1" :label="'男'">男</el-option>
                      <el-option :value="2" :label="'女'">女</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="24">
                  <el-form-item label="起點備註-其他" prop="Id">
                    <el-input
                      v-model="temp.Id"
                      placeholder="請輸入起點備註"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="18">
                  <el-form-item label="訖點" prop="Id">
                    <el-input
                      v-model="temp.Id"
                      placeholder="請輸入訖點"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="6">
                  <el-form-item label="訖點備註" prop="Id">
                    <el-select
                      clearable
                      v-model="temp.Id"
                      placeholder="請選擇備註"
                      style="width: 100%"
                    >
                      <el-option :value="1" :label="'男'">男</el-option>
                      <el-option :value="2" :label="'女'">女</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="24">
                  <el-form-item label="訖點備註-其他" prop="Id">
                    <el-input
                      v-model="temp.Id"
                      placeholder="請輸入訖點備註"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12">
                  <el-form-item label="預約回程(回居住地址)" prop="Id">
                    <el-radio-group v-model="temp.Id">
                      <el-radio label="是"></el-radio>
                      <el-radio label="否"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12">
                  <el-form-item label="回程乘車時間" prop="Id">
                    <el-date-picker
                      v-model="temp.Id"
                      type="date"
                      placeholder="請選擇回程乘車時間"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12">
                  <el-form-item label="願意共乘" prop="Id">
                    <el-radio-group v-model="temp.Id">
                      <el-radio label="是"></el-radio>
                      <el-radio label="否"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="6">
                  <el-form-item label="車種" prop="Id">
                    <el-select
                      clearable
                      v-model="temp.Id"
                      placeholder="請選擇車種"
                      style="width: 100%"
                    >
                      <el-option :value="1" :label="'男'">男</el-option>
                      <el-option :value="2" :label="'女'">女</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="6">
                  <el-form-item label="輪椅" prop="Id">
                    <el-select
                      clearable
                      v-model="temp.Id"
                      placeholder="請選擇輪椅"
                      style="width: 100%"
                    >
                      <el-option :value="1" :label="'男'">男</el-option>
                      <el-option :value="2" :label="'女'">女</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12">
                  <el-form-item label="陪同人數" prop="Id">
                    <el-select
                      clearable
                      v-model="temp.Id"
                      placeholder="請選擇陪同人數"
                      style="width: 100%"
                    >
                      <el-option :value="1" :label="'男'">男</el-option>
                      <el-option :value="2" :label="'女'">女</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12">
                  <el-form-item label="簡訊號碼" prop="Id">
                    <el-input
                      v-model="temp.Id"
                      placeholder="請輸入簡訊號碼"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="dispatchFooter">
            <el-button style="height: 40px" type="info">立即預約</el-button>
            <el-button style="height: 40px" type="info">新增下個地點</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script
  async
  defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAkLxJzOtyQ6Oyv4e1rTlMxGSixHr0to3Q"
></script>
<script>
import Sticky from "@/components/Sticky";
export default {
  components: {
    Sticky,
  },
  data() {
    return {
      // map
      map: null,
      mapCenter: {
        lat: 25.0374865, // 經度
        lng: 121.5647688, // 緯度
      },
      location: {
        lat: 25.1374865, // 經度
        lng: 121.4247688, // 緯度
      },
      // 表單相關
      labelPosition: "top",
      temp: {
        Id: "",
        Id2: "",
        cuty: "",
        lun: [
          {
            value1: "",
            value2: "",
            value3: "",
            value4: "",
            value5: "",
          },
        ],
      },
      rules: {
        Id: [{ required: true, message: "請輸入個案編號", trigger: "blur" }],
        city: [
          { required: true, message: "請輸入個案編號", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    initMap() {
      let ds = new google.maps.DirectionsService();
      let dD = new google.maps.DirectionsRenderer();
      console.log(ds);

      // 建立地圖
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: this.mapCenter, // 中心點座標
        zoom: 16, // 1-20，數字愈大，地圖愈細：1是世界地圖，20就會到街道
        maxZoom: 20,
        minZoom: 3,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        // roadmap 顯示默認道路地圖視圖。
        // satellite 顯示 Google 地球衛星圖像。
        // hybrid 顯示正常和衛星視圖的混合。
        // terrain 顯示基於地形信息的物理地圖。
        mapTypeId: "roadmap",
      });

      let request = {
        origin: { lat: 25.03401, lng: 121.562428 },
        destination: { lat: 25.037906, lng: 121.549781 },
        travelMode: "DRIVING",
      };

      //   dD.setMap(this.map);

      //   ds.route(request, function (result, status) {
      //     console.log(result, status);

      //     if (status == "OK") {
      //       ds.setDirections(result);
      //     } else {
      //       console.log(status);
      //     }
      //   });

      //   放置marker;
      //   let marker = new google.maps.Marker({
      //     position: location,
      //     map: this.map,
      //   });
    },
  },
  mounted() {
    // console.log(this.$options);
    // this.initMap();
  },
};
</script>

<style lang="scss" scoped>
.allUserDispatch {
  .mainContainer {
    // background: lightblue;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }

  .mapContainer {
    width: 49%;
    height: 100%;
    background: lightcoral;
  }

  .dispatchContainer {
    width: 50%;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 24px;
    padding-top: 12px;
  }

  .caseUserName {
    height: 7%;
    // background: lightseagreen;
    border-bottom: 1px dashed #aaaaaa;
    display: flex;
    font-weight: 700;
    align-items: center;
    font-size: 2rem;
    color: #fd8115;
  }

  .dispatchDetail {
    height: 86%;
    // background: lightsteelblue;
    border-bottom: 1px dashed #aaaaaa;
    overflow: auto;
    overflow-x: hidden;
  }

  .dispatchFooter {
    height: 7%;
    display: flex;
    // background: lightpink;
    justify-content: flex-end;
    align-items: center;
  }

  .unitBTitle {
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: block;
  }

  .unitBContainer {
    width: 100%;
    height: 100%;
    background: forestgreen;
    display: flex;
    flex-wrap: wrap;
    padding-top: 0.5rem;
    justify-content: space-between;
  }

  .unitBBox {
    width: 49%;
    margin-bottom: 0.5rem;
    height: 60px;
    background: wheat;
  }
}
</style>
