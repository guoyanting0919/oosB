<template>
  <div class="flex-column carUse">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- 區域選擇 -->
        <el-select
          size="mini"
          v-model="value"
          clearable
          placeholder="請選擇區域"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 公司選擇 -->
        <el-select
          size="mini"
          v-model="value"
          clearable
          placeholder="請選擇公司"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <!-- 日期選擇 -->
        <el-date-picker
          size="mini"
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="開始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <!-- 車輛使用率比較表 -->
      <div class="carUseContainer">
        <Title title="車輛使用率比較表"></Title>
        <ve-histogram
          :data="chartData"
          :settings="chartSettings"
        ></ve-histogram>
      </div>

      <!-- 車輛使用率 -->
      <div class="carContainer">
        <Title title="車輛使用率"></Title>
        <div class="carBoxies">
          <div class="carBox" v-for="item in 5" :key="item">
            <p>NAM-03</p>
            <p>豐均國際租賃有限公司</p>
            <ve-ring
              class="carChart"
              :data="chartData2"
              :settings="chartSettings2"
            ></ve-ring>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from "@/components/Sticky";
import Title from "@/components/ConsoleTableTitle";
export default {
  name: "carUse",
  components: {
    Sticky,
    Title,
  },
  data() {
    this.chartSettings = {
      metrics: ["使用率"],
      dimension: ["車牌"],
      yAxisName: ["單位(%)"],
    };
    this.chartSettings2 = {
      radius: [40, 80],
      offsetY: 120,
      dimension: "日期",
      metrics: "访问用户",
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
        columns: ["車牌", "使用率"],
        rows: [
          { 車牌: "xc9dc", 使用率: 32 },
          { 車牌: "dasd93", 使用率: 26 },
          { 車牌: "dasd3", 使用率: 76 },
          { 車牌: "gher4", 使用率: 49 },
          { 車牌: "mmbvr", 使用率: 33 },
          { 車牌: "049jfd", 使用率: 78 },
        ],
      },
      chartData2: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "使用率", 访问用户: 30 },
          { 日期: "未使用率", 访问用户: 70 },
        ],
      },
    };
  },
};
</script>

<style lang="scss"></style>
