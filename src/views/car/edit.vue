<template>
  <div class="flex-column carEdit">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-button type="info" plain size="mini">回列表</el-button>
        <el-button type="success" size="mini">儲存</el-button>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="編輯車輛"></Title>
      <div class="bg-white formContainer customScrollBar">
        <el-form
          :label-position="labelPosition"
          label-width="200px"
          :model="temp"
          :rules="rules"
          ref="form"
        >
          <SubTitle title="基本資料編輯"></SubTitle>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <div class="uploadPic"></div>
            </el-col>
            <el-col :sm="12" :md="18">
              <el-row :gutter="16">
                <el-col :sm="12" :md="8">
                  <el-form-item label="車牌號碼" prop="Id">
                    <el-input
                      v-model="temp.Id"
                      placeholder="請輸入車牌號碼"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="車輛類別" prop="Id">
                    <el-select
                      v-model="temp.Id"
                      placeholder="請選擇車輛類別"
                      style="width:100%"
                    >
                      <el-option :value="1" :label="'可派發'">可派發</el-option>
                      <el-option :value="2" :label="'不可派發'"
                        >不可派發</el-option
                      >
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="車輛顏色" prop="Id">
                    <el-input
                      v-model="temp.Id"
                      placeholder="請輸入車輛顏色"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="廠牌型號" prop="Id">
                    <el-input
                      v-model="temp.Id"
                      placeholder="請輸入廠牌型號"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="車輛來源" prop="Id">
                    <el-select
                      v-model="temp.Id"
                      placeholder="請選擇車輛來源"
                      style="width:100%"
                    >
                      <el-option :value="1" :label="'可派發'">可派發</el-option>
                      <el-option :value="2" :label="'不可派發'"
                        >不可派發</el-option
                      >
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="捐贈單位" prop="Id">
                    <el-input
                      v-model="temp.Id"
                      placeholder="請輸入捐贈單位"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="座椅數量" prop="Id">
                    <el-input-number
                      v-model="temp.Id"
                      :min="0"
                      :max="10"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="輪椅數量" prop="Id">
                    <el-input-number
                      v-model="temp.Id"
                      :min="0"
                      :max="10"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="車身高度" prop="Id">
                    <el-input
                      v-model="temp.Id"
                      placeholder="請輸入捐贈單位"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :sm="12" :md="6">
              <el-form-item label="司機姓名" prop="Id">
                <el-input
                  v-model="temp.Id"
                  placeholder="請輸入司機姓名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="可否派發" prop="Id">
                <el-select
                  v-model="temp.Id"
                  placeholder="請選擇可否派發"
                  style="width:100%"
                >
                  <el-option :value="1" :label="'可派發'">可派發</el-option>
                  <el-option :value="2" :label="'不可派發'">不可派發</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="出廠年月" prop="Id">
                <el-date-picker
                  v-model="temp.Id"
                  type="date"
                  placeholder="請選擇出廠年月"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="最後驗車日" prop="Id">
                <el-date-picker
                  v-model="temp.Id"
                  type="date"
                  placeholder="請選擇最後驗車日"
                  style="width:100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="6">
              <el-form-item label="車輛審核" prop="Id">
                <el-radio-group v-model="temp.Type">
                  <el-radio label="是"></el-radio>
                  <el-radio label="否"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :md="18">
              <el-form-item label="車輛設備" prop="Id">
                <el-checkbox label="GPS" name="type"></el-checkbox>
                <el-checkbox label="車機" name="type"></el-checkbox>
                <el-checkbox label="攝影機" name="type"></el-checkbox>
                <el-checkbox label="滅火器" name="type"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <SubTitle title="保險"></SubTitle>
          <div class="tableContainer">
            <div class="tableHeader">
              <div class="headerCheckBox">保險類型</div>
              <div class="expireDate">保險到期日</div>
            </div>
            <el-checkbox-group v-model="temp.Type">
              <div
                v-for="item in 2"
                :key="item"
                style="border-bottom:1px solid #ddd;display:flex"
              >
                <el-checkbox
                  label="乘客險"
                  name="type"
                  style="width:50%;text-align:center;padding:1rem"
                ></el-checkbox>
                <div class="expireDateBox">
                  <el-date-picker
                    style="width:70%"
                    v-model="temp.Id"
                    type="date"
                    size="mini"
                    placeholder="選擇日期"
                  ></el-date-picker>
                </div>
              </div>
            </el-checkbox-group>
          </div>

          <SubTitle title="備註"></SubTitle>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.Id"
          ></el-input>
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
  name: "carEdit",
  components: {
    Sticky,
    Title,
    SubTitle,
  },
  data() {
    return {
      labelPosition: "top",
      temp: {
        Id: "",
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
};
</script>

<style lang="scss" scoped>
.formTitle:nth-child(1) {
  margin-top: 1rem;
}
.uploadPic {
  width: 240px;
  height: 240px;
  background: #ffe6d1;
  margin: auto;
  margin-top: 1.5rem;
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
</style>
