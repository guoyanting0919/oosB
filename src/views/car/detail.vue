<template>
  <div class="flex-column carDetail">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-button type="info" size="mini" @click="handleEdit">編輯車輛資料</el-button>
        <el-button type="info" size="mini">列印</el-button>
        <el-button type="info" plain size="mini">回列表</el-button>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="檢視車輛資料"></Title>
      <div class="bg-white formContainer">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="temp"
          :rules="rules"
          ref="form"
        >
          <SubTitle title="基本資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <div class="uploadPic" style="margin-top:1.5rem"></div>
            </el-col>
            <el-col :sm="12" :md="18">
              <el-row :gutter="16">
                <el-col :sm="12" :md="8">
                  <div class="detailLabel">車牌號碼</div>
                  <div class="detailValue">{{temp.Id}}</div>
                </el-col>
                <el-col :sm="12" :md="8">
                  <div class="detailLabel">車輛類別</div>
                  <div class="detailValue">{{temp.Id}}</div>
                </el-col>
                <el-col :sm="12" :md="8">
                  <div class="detailLabel">車身顏色</div>
                  <div class="detailValue">{{temp.Id}}</div>
                </el-col>
                <el-col :sm="12" :md="8">
                  <div class="detailLabel">廠牌型號</div>
                  <div class="detailValue">{{temp.Id}}</div>
                </el-col>
                <el-col :sm="12" :md="8">
                  <div class="detailLabel">車輛來源</div>
                  <div class="detailValue">{{temp.Id}}</div>
                </el-col>
                <el-col :sm="12" :md="8">
                  <div class="detailLabel">捐贈單位</div>
                  <div class="detailValue">{{temp.Id}}</div>
                </el-col>
                <el-col :sm="12" :md="8">
                  <div class="detailLabel">座椅數量</div>
                  <div class="detailValue">{{temp.Id}}</div>
                </el-col>
                <el-col :sm="12" :md="8">
                  <div class="detailLabel">輪椅數量</div>
                  <div class="detailValue">{{temp.Id}}</div>
                </el-col>
                <el-col :sm="12" :md="8">
                  <div class="detailLabel">車身高度</div>
                  <div class="detailValue">{{temp.Id}}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <div class="detailLabel">司機姓名</div>
              <div class="detailValue">{{temp.Id}}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">可否派發</div>
              <div class="detailValue">{{temp.Id}}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">出廠年月</div>
              <div class="detailValue">{{temp.Id}}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">最後驗車日</div>
              <div class="detailValue">{{temp.Id}}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">車輛審核</div>
              <div class="detailValue">{{temp.Id}}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">車輛設備</div>
              <div class="detailValue">{{temp.Id}}</div>
            </el-col>
            <el-col :sm="12" :md="12">
              <div class="detailLabel">車行</div>
              <div class="detailValue">{{temp.Id}}</div>
            </el-col>
          </el-row>

          <SubTitle title="保險"></SubTitle>
          <div class="tableContainer">
            <div class="tableHeader">
              <div class="headerCheckBox">保險類型</div>
              <div class="expireDate">保險到期日</div>
            </div>
            <div v-for="item in 2" :key="item" style="border-bottom:1px solid #ddd;display:flex">
              <p class="typeBox">乘客險</p>
              <p class="expireBox">2020-02-12</p>
            </div>
          </div>

          <SubTitle title="備註"></SubTitle>
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="temp.Id"></el-input>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
export default {
  name: "carDetail",
  components: {
    Sticky,
    Title,
    SubTitle,
  },
  data() {
    return {
      labelPosition: "top",
      temp: {
        Id: "124",
        cuty: "",
        Type: [],
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
    handleEdit() {
      // console.log();
      this.$router.push(`/car/edit/${this.$route.params.id}`);
    },
  },
  mounted() {
    // console.log(this.$route);
  },
};
</script>

<style lang='scss' scoped>
.formContainer {
  padding: 8px 16px;
  overflow: auto;
}

.formTitle:nth-child(1) {
  margin-top: 1rem;
}
.uploadPic {
  width: 240px;
  height: 240px;
  background: #ffe6d1;
  margin: auto;
}
.tableContainer {
  width: 100%;
  // background: lightcoral;
}
.tableHeader {
  display: flex;
}
.headerCheckBox {
  border-right: 1px solid #fff;
}
.headerCheckBox,
.expireDate {
  width: 50%;
  text-align: center;
  padding: 1rem 0;
  background: #fafafa;
  font-size: 13px;
  font-weight: 700;
  box-sizing: border-box;
}
.expireDateBox {
  width: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.detailLabel {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.detailValue {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #606266;
  border-bottom: 1px dashed #fd8115;
  margin-bottom: 1rem;
}
.dataContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3rem;
  flex-wrap: wrap;
}
.dataCard {
  width: 210px;
  margin-top: 0.5rem;
  height: 300px;
  background: #fff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 0;
  justify-content: space-around;

  .iconfont {
    font-size: 70px;
    color: #fd8115;
    font-weight: 500;
  }
  .cardDetail {
    font-size: 24px;
  }
  .cardCount {
    color: #fd8115;
    font-size: 24px;
    font-weight: 700;
  }
}
.typeBox,
.expireBox {
  width: 50%;
  text-align: center;
  padding: 1rem;
  font-size: 14px;
  color: #606266;
}
</style>