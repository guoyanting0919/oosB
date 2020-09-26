<template>
  <div class="flex-column driverAdd">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-button type="info" plain size="mini">回列表</el-button>
        <el-button type="success" size="mini">儲存</el-button>
      </div>
    </sticky>
    <div class="app-container flex-item">
      <Title title="新增司機"></Title>
      <div class="bg-white formContainer">
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
                  <el-form-item label="姓名" prop="Id">
                    <el-input v-model="temp.Id" placeholder="請輸入姓名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="身分證字號" prop="Id">
                    <el-input v-model="temp.Id" placeholder="請輸入身分證字號"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="手機" prop="Id">
                    <el-input v-model="temp.Id" placeholder="請輸入手機"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :md="8">
                  <el-form-item label="可否派發" prop="Id">
                    <el-select v-model="temp.Id" placeholder="請選擇可否派發" style="width:100%">
                      <el-option :value="1" :label="'可派發'">可派發</el-option>
                      <el-option :value="2" :label="'不可派發'">不可派發</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <SubTitle title="駕照"></SubTitle>
          <div class="tableContainer">
            <div class="tableHeader">
              <div class="headerCheckBox">駕駛類型</div>
              <div class="expireDate">駕照到期日</div>
            </div>
            <el-checkbox-group v-model="temp.Type">
              <div v-for="item in 2" :key="item" style="border-bottom:1px solid #ddd;display:flex">
                <el-checkbox
                  label="職業小客車"
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

          <SubTitle title="保險"></SubTitle>
          <div class="tableContainer">
            <div class="tableHeader">
              <div class="headerCheckBox">保險類型</div>
              <div class="expireDate">保險到期日</div>
            </div>
            <el-checkbox-group v-model="temp.Type">
              <div v-for="item in 2" :key="item" style="border-bottom:1px solid #ddd;display:flex">
                <el-checkbox
                  label="勞保"
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

          <SubTitle title="證照"></SubTitle>
          <div class="tableContainer">
            <div class="tableHeader">
              <div class="headerCheckBox">持有證照</div>
              <div class="expireDate">證照到期日</div>
            </div>
            <el-checkbox-group v-model="temp.Type">
              <div v-for="item in 2" :key="item" style="border-bottom:1px solid #ddd;display:flex">
                <el-checkbox
                  label="計程車執業登記證"
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
  name: "driverAdd",
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

<style lang='scss' scoped>
.formContainer {
  padding: 8px 16px;
  // overflow: auto;
  height: auto;
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
</style>