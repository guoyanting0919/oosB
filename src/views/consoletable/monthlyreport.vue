<template>
  <div class="flex-column monthlyReport">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 區域選擇 -->
        <el-select size="mini" v-model="value" clearable placeholder="請選擇區域">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 公司選擇 -->
        <el-select size="mini" v-model="value" clearable placeholder="請選擇公司">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 日期選擇 -->
        <el-date-picker size="mini" v-model="value1" type="month" placeholder="選擇年月"></el-date-picker>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <!-- 區域月報表 -->
      <div class="monthlyContainer">
        <Title title="區域月報表"></Title>
        <div class="returnBox" v-for="(item, index) in 15" :key="index">
          <ve-bar height="300px" :data="chartData"></ve-bar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
export default {
  name: "monthlyReport",
  components: {
    Sticky,
    Title,
  },
  data() {
    this.chartSettings = {
      metrics: ["金額"],
      dimension: ["已完成", "空趟", "未執行", "總趟數"],
    };
    return {
      value: "",
      value1: "",
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
      chartData: {
        columns: ["地區", "已完成", "空趟", "未執行", "總趟數"],
        rows: [{ 地區: "新莊區", 已完成: 20, 空趟: 4, 未執行: 3, 總趟數: 84 }],
      },
    };
  },
};
</script>

<style lang="scss">
.returnBox {
  background: #fff;
  padding: 1rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
}
</style>
