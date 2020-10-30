<template>
  <div class="flex-column editCaseUserRole">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 權限按鈕 -->
        <el-button
          size="mini"
          @click="$router.push('/selfpayuser/index')"
          type="success"
          plain
          >回上頁</el-button
        >
      </div>
    </sticky>

    <div class="app-container flex-item">
      <Title title="檢視白牌個案資料"></Title>
      <div class="formContainer bg-white customScrollBar">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="temp"
          ref="form"
        >
          <SubTitle title="基本資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="3">
              <div class="detailLabel">姓名</div>
              <div class="detailValue">{{ basicTemp.name }}</div>
            </el-col>
            <el-col :sm="12" :md="3">
              <div class="detailLabel">性別</div>
              <div class="detailValue">{{ basicTemp.sex | sexFilter }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">身分證字號</div>
              <div class="detailValue">{{ basicTemp.uid }}</div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">生日</div>
              <div class="detailValue">
                {{ basicTemp.birthday | dateFilter }}
              </div>
            </el-col>
            <el-col :sm="12" :md="6">
              <div class="detailLabel">手機</div>
              <div class="detailValue">
                {{ basicTemp.phone }}
              </div>
            </el-col>
          </el-row>

          <SubTitle title="白牌資料"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="24" :md="24">
              <div class="detailLabel">居住地</div>
              <div class="detailValue">
                {{ temp.county }}{{ temp.district }}{{ temp.addr }}
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
import SubTitle from "@/components/SubTitle";
import moment from "moment";
import * as taiwan from "@/assets/taiwan.js";
import * as users from "@/api/users";
import * as selfPayUsers from "@/api/selfPayUsers";
export default {
  name: "allUserAdd",
  components: {
    Sticky,
    Title,
    SubTitle,
  },
  data() {
    return {
      taiwanCity: "",
      // 表單相關
      labelPosition: "top",
      basicTemp: {
        name: "",
        birthday: "",
        uid: "",
        sex: "",
      },
      temp: {
        userId: "", //用戶id
        id: "", //身份id
        county: "", //居住縣市
        district: "", //居住區域
        addr: "", //居住地址
      },
    };
  },
  methods: {
    // 獲取用戶基本資料
    async getUserBasic() {
      const vm = this;
      await users
        .getClient({ id: vm.$route.params.id.split("-")[0] })
        .then((res) => {
          vm.basicTemp = Object.assign({}, res.result); // copy obj
          window.setTimeout(() => {
            vm.$refs.form.clearValidate();
          }, 100);
        });
    },
    // 獲取白牌資料
    getSelfPayUser() {
      const vm = this;
      selfPayUsers
        .get({ id: vm.$route.params.id.split("-")[1] })
        .then((res) => {
          vm.temp = Object.assign({}, res.result); // copy obj
        });
    },
  },

  filters: {
    sexFilter(sex) {
      if (sex) {
        return "男";
      } else {
        return "女";
      }
    },
    dateFilter(date) {
      let res = moment(date).format("YYYY-MM-DD");
      return res;
    },
  },

  async mounted() {
    this.getUserBasic();
    this.taiwanCity = taiwan.cityAndCountiesLite;
    this.getSelfPayUser();
  },
};
</script>

<style lang="scss" scoped>
.wealBtn {
  padding: 4px 8px;
}
.formTitle {
  font-size: 18px;
  color: #fd8115;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 1rem;
  // transform: translateX(-8px);
  padding-bottom: 0.5rem;
  // border-bottom: 1px solid #fd8115;
  display: flex;

  .timeSelect {
    margin-right: 1rem;
    font-size: 16px;
    padding: 0px 16px;
    border: 1px solid #fd8115;
    display: flex;
    align-items: center;
    justify-content: center;
  }
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
</style>
