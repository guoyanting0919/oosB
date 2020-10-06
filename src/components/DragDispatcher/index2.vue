<template>
  <div class="dragDispatcherContainer">
    <div class="orderContainer">
      <div draggable="true" class="orderBox" @dragstart="test($event)"></div>
      <div class="orderBox"></div>
      <div class="orderBox"></div>
      <div class="orderBox"></div>
    </div>
    <div class="outsideContainer">
      <div class="driverTimeCard">
        <p>車輛</p>
        <p>時間</p>
      </div>

      <!-- driver fake box -->
      <div class="driverFakeBox">
        <div class="driverCard" v-for="(item, key) in dragData" :key="key">
          {{ key }}
          <!-- <div class="orderBox" draggable="true"></div> -->
        </div>
      </div>

      <!-- time fake box -->
      <div class="timeFakeBox">
        <div class="timeCard" v-for="item in timelist" :key="item">
          {{ item }}
        </div>
      </div>
      <!-- @mousedown.prevent="mouseDownHandler"
        @mouseup.prevent="mouseUpHandler"
        @mouseleave.prevent="mouseUpHandler"
        @mousemove.prevent="ToScroll" -->
      <div class="distatchContainer" @dragover.prevent>
        <div class="driverBox">
          <!-- 司機迴圈 -->
          <div
            @mouseenter="driverMouseUp"
            @dragend="driverDragleave"
            :class="{ active: isActive }"
            class="driver"
            draggable="true"
            v-for="(driver, key) in dragData"
            :key="key"
          >
            <!-- <div class="driverCard">司機</div> -->
            <!-- 時間迴圈 -->
            <div
              @mouseenter="driverMouseUp"
              @dragover.self="showShadow"
              @dragleave.self="clearShadow"
              @dragend.self="clearShadow"
              @drop="driverDrop($event, driver, time, key, key2)"
              v-for="(time, key2) in driver"
              :key="key2"
              class="timeBox"
            >
              <div
                @mouseenter="driverMouseUp"
                @dragover.self="showShadow"
                @dragleave="clearShadow"
                @dragend="clearShadow"
                @drop="driverDrop($event, driver, time, key, key2)"
                class="whiteDriverTime"
              >
                {{ key + "" + key2 }}
              </div>
              <!-- <el-button @click="click(item, item2)">{{ key }}</el-button> -->
              <template v-if="time">
                <div
                  @mouseenter.stop="test2()"
                  @dragend="test()"
                  @mouseleave="test()"
                  @drop.stop="driverDropD($event, driver, time, key, key2)"
                  class="dispatchCard"
                  draggable="true"
                >
                  <div class="dispatchCardTitle">
                    <p>6分</p>
                    <p>NEW</p>
                  </div>
                  <p>王小明</p>
                  <p>王小明</p>
                  <p>王小明</p>
                  <p>王小明</p>
                  <p>{{ time.Id }}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IScroll from "iscroll/build/iscroll-probe";
import moment from "moment";
import dispatchs from "@/assets/dispatch";
export default {
  props: {
    start: {
      //開始時間
      type: String,
      default: "05:00",
    },
    end: {
      //結束時間
      type: String,
      default: "23:45",
    },
    step: {
      //間隔時間(分)
      type: Number,
      default: 15,
    },
  },
  data() {
    return {
      canDrag: true,
      scroll: null,
      dragData: "",
      driverList: ["YT", "阿華", "安哥", "阿智", "冰鳥"],
      dispatchData: "",
      isActive: false,
      ele: document.querySelectorAll(".distatchContainer")[0],
      pos: { top: 0, left: 0, x: 0, y: 0 },
      isDown: false,
      realDispatchList: [],
      sensitivity: 1,
    };
  },
  computed: {
    timelist() {
      let ctime = moment().format("YYYY-MM-DD") + " " + this.start;
      let arr = [moment(ctime).format("HH:mm")];
      while (
        moment(ctime).isBefore(moment().format("YYYY-MM-DD") + " " + this.end)
      ) {
        ctime = moment(ctime).add(this.step, "minutes");
        arr.push(moment(ctime).format("HH:mm"));
      }
      return arr;
    },
  },
  methods: {
    dragSetting() {
      const vm = this;
      this.scroll = new IScroll(".distatchContainer", {
        mouseWheel: true, // 允许鼠标滚轮
        scrollX: true,
        scrollY: true,
        probeType: 3,
        momentum: false,
      });

      this.scroll.on("scroll", function () {
        if (vm.canDrag) {
          document.querySelectorAll(".timeFakeBox")[0].style.transform =
            "translate(0px," + this.y + "px) ";
          document.querySelectorAll(".driverFakeBox")[0].style.transform =
            "translate(" + this.x + "px,0px) ";
        } else {
          return;
        }
      });
    },
    mouseDownHandler(e) {
      let ele = document.querySelectorAll(".distatchContainer")[0];
      // console.log(ele.scrollLeft);
      this.pos = {
        // The current scroll
        left: ele.scrollLeft,
        top: ele.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
      };
      //   ele.scrollLeft = ele.scrollLeft + 100;
      this.isDown = true;
    },
    mouseUpHandler() {
      //console.log(e.which)
      this.isDown = false;
    },
    ToScroll(e) {
      /*if(this.isDown) {
        document.querySelectorAll(".contentD")[0].scrollTo({
          top: 0,
          left: document.querySelectorAll(".contentD")[0].scrollLeft-=event.movementX,
          behavior: 'smooth'
        });
      }*/
      //console.log(e)
      if (!this.isDown) return 0;
      let ele = document.querySelectorAll(".distatchContainer")[0];
      const dx = e.clientX - this.pos.x;
      const dy = e.clientY - this.pos.y;

      // Scroll the element
      ele.scrollTop = this.pos.top - dy * this.sensitivity;
      ele.scrollLeft = this.pos.left - dx * this.sensitivity;
    },
    driverDragleave() {
      //   console.log("a");
    },
    driverMouseUp() {
      //   console.log("a");
    },
    driverDrop(e, driver, time, key, key2) {
      console.log(e, driver, time, key, key2);
      this.isActive = true;
      e.target.style.background = "#fff";
    },
    driverDropD() {
      console.log("aaaa");
    },
    test() {
      this.scroll.enabled = true;
    },
    test2() {
      console.log("a");
      // this.canDrag = false;
      this.scroll.enabled = !this.scroll.enabled;
      console.log(this.scroll.enabled);
      // this.scroll = {};
      // console.log(this.scroll);
    },
    showShadow(e) {
      //   this.isActive = true;
      // e.target.style.boxShadow = "inset 0px 0px 20px #888";
      e.target.style.background = "#00000057";
    },
    clearShadow(e) {
      // e.target.style.boxShadow = "none";
      e.target.style.background = "#fff";
    },
  },
  created() {
    let resObj = {};
    this.driverList.forEach((item) => {
      resObj[`${item}`] = this.timelist.reduce((a, b) => ((a[b] = ""), a), {});
      let restore = (dispatchs.response ?? []).filter(
        (item1) => item1.DespatchDetails?.[0]?.DriverName === item
      );

      (restore ?? []).forEach((item2) => {
        resObj[`${item}`][
          `${moment(item2.DespatchDetails?.[0]?.Despatch?.StartDate).format(
            "HH:mm"
          )}`
        ] = item2.DespatchDetails?.[0]?.Despatch;
      });
    });
    this.dragData = resObj;
    this.dispatchData = dispatchs;
    console.log(resObj);
  },
  mounted() {
    this.dragSetting();
  },
};
</script>

<style lang="scss" scoped>
.dragDispatcherContainer {
  display: flex;
  height: calc(100vh - 104px);
  width: 100%;
  background: lightcyan;
  padding: 1rem;

  .orderContainer {
    width: 25%;
    min-height: 100%;
    padding-top: 1rem;
    background: lightgreen;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-right: 2rem;
  }

  .orderBox {
    width: 90px;
    height: 100px;
    background: lightseagreen;
    margin-bottom: 1rem;
  }

  .outsideContainer {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    width: 100%;
    position: relative;
  }

  .driverTimeCard {
    position: absolute;
    width: 100px;
    height: 100px;
    background: #fff;
    z-index: 999;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .driverFakeBox {
    display: flex;
    // min-width: 100%;
    background: forestgreen;
  }

  .driverCard {
    background: lemonchiffon;
    height: 100px;
    z-index: 999;
    // position: fixed;
    width: 320px;
    border: 1px solid #ddd;

    &:nth-child(1) {
      // background: brown;
      margin-left: 100px;
    }
  }

  .timeFakeBox {
    width: 100px;
    // background: lime;
  }

  .timeCard {
    margin-bottom: 72px;
    text-align: center;
    transform: translateY(-8px);

    &:nth-child(1) {
      transform: translateY(0px);
    }
  }

  .distatchContainer {
    width: calc(100% - 100px);
    height: 100%;
    background: lightpink;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
  }

  .driver {
    width: 320px;
    // height: 100px;
    background: lightskyblue;
    // margin: 1rem;
    position: relative;
    // padding-top: 100px;

    &.active {
      background: lime;
    }
  }

  .driverBox {
    // width: 2000px;
    display: flex;
  }

  .timeBox {
    height: 90px;
    width: 320px;
    background: #fff;
    border: 1px solid #ddd;
    box-sizing: border-box;
    transition: 0.3s;
    // background: magenta;
    // margin-bottom: 1rem;
    // margin-top: 100px;
  }

  .dispatchCard {
    background: #ffefde;
    padding: 0.5rem;
    border: 2px solid #fa8c16;
    border-top: 5px solid #fa8c16;
    border-radius: 0px 0px 8px 8px;
    width: 33%;
    z-index: 1;
    transition: 0.3s;
    height: 90px;
    overflow: hidden;

    &:hover {
      // transform: translate(4px, -4px);
      z-index: 2;
      height: auto;
    }
  }

  .dispatchCardTitle {
    display: flex;
    justify-content: space-between;
  }

  .whiteDriverTime {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 2rem;
    line-height: 90px;
    letter-spacing: 2px;
    font-weight: 700;
    color: #fff;
    transition: 0.3s;
    position: absolute;
    width: 100%;
  }
}
</style>
