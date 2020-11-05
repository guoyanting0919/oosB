<template>
  <div class="dashboard">
    <!-- 一般的主頁 -->
    <div v-if="!state">
      <el-input
        style="width: 200px"
        v-model="input"
        placeholder="dashBoard"
        @keydown.native.enter="handleKeydown"
      ></el-input>
    </div>
    <!-- cbsd的主頁 -->

    <div v-else class="trelloContainer bg-white customScrollBar">
      <div style="display: flex">
        <el-input style="200px" v-model="userName"></el-input>
        <el-input style="200px" v-model="message"></el-input>
        <el-button @click="send">send</el-button>
      </div>
      <div class="problemListContainer">
        <!-- 待處理 -->
        <div class="problemList">
          <Title title="新增巴士路線"></Title>
          <draggable
            :list="dataStatus0"
            v-if="sortData"
            class="draggableContainer"
            group="stop"
            :options="{
              animation: 300,
              group: 'people',
              scroll: true,
              scrollSpeed: 2000,
              scrollSensitivity: 10,
            }"
          >
            <transition-group>
              <div
                v-for="(stop, index) in dataStatus0"
                :key="stop.id"
                class="graggableItem"
                :index="index"
              >
                <span class="stopName">
                  {{ stop.name }}
                </span>
              </div>
            </transition-group>
          </draggable>
        </div>

        <!-- 處理中 -->
        <div class="problemList">
          <Title title="新增巴士路線"></Title>
          <draggable
            :list="dataStatus1"
            v-if="sortData"
            class="draggableContainer"
            group="stop"
            :options="{
              animation: 300,
              group: 'people',
              scroll: true,
              scrollSpeed: 2000,
              scrollSensitivity: 10,
            }"
          >
            <transition-group>
              <div
                v-for="(stop, index) in dataStatus1"
                :key="stop.id"
                class="graggableItem"
                :index="index"
              >
                <span class="stopName">
                  {{ stop.name }}
                </span>
              </div>
            </transition-group>
          </draggable>
        </div>

        <!-- 已完成 -->
        <div class="problemList">
          <Title title="新增巴士路線3"></Title>
          <draggable
            :list="dataStatus2"
            v-if="sortData"
            class="draggableContainer"
            group="stop"
            :options="{
              animation: 300,
              group: 'people',
              scroll: true,
              scrollSpeed: 2000,
              scrollSensitivity: 10,
            }"
          >
            <transition-group>
              <div
                v-for="(stop, index) in dataStatus2"
                :key="stop.id"
                class="graggableItem"
                :index="index"
              >
                <span class="stopName">
                  {{ stop.name }}
                </span>
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Title from "@/components/ConsoleTableTitle";
import * as signalR from "@aspnet/signalr";
export default {
  components: {
    draggable,
    Title,
  },
  data() {
    return {
      // signalR
      hubConnection: new signalR.HubConnectionBuilder()
        .withUrl("http://openauth.1966.org.tw/api/chatHub")
        .build(),
      signalRMsg: null,
      userName: "",
      message: "",

      sortData: [
        {
          name: "John",
          id: 1,
          status: 0,
        },
        {
          name: "Joao",
          id: 2,
          status: 0,
        },
        {
          name: "Jean",
          id: 3,
          status: 1,
        },
        {
          name: "Gerard",
          id: 4,
          status: 2,
        },
      ],
      dataStatus0: [],
      dataStatus1: [],
      dataStatus2: [],

      input: "",
      state: window.localStorage.getItem("CBSD_ADMIN"),
      url: "https://trello.com/b/mHsiq7jW/%E5%B0%96%E7%9F%B3",
    };
  },
  methods: {
    // signalR
    send() {
      const vm = this;
      vm.hubConnection
        .invoke("SendMessage", vm.userName, vm.message)
        .then(() => {
          console.log("SendMessage success");
        })
        .catch(function (err) {
          return console.error(err);
        });
    },
    connectHub() {
      const vm = this;
      vm.hubConnection
        .start()
        .then((res) => {
          console.log(res, "success connect");
          vm.get();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    get() {
      const vm = this;
      vm.hubConnection.on("ReceiveMessage", function (user, msg) {
        console.info("update success!", user, msg);
        vm.signalRMsg = `${user} : ${msg}`;
        vm.$alertT.fire({
          icon: "info",
          title: vm.signalRMsg,
        });
      });
    },

    // no
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleKeydown() {
      if (this.input === "cbsd") {
        window.localStorage.setItem("CBSD_ADMIN", "true");

        window.location.reload();
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    },
  },
  mounted() {
    this.connectHub();
    // this.restaurants = this.loadAll();
    this.sortData.forEach((data) => {
      switch (data.status) {
        case 0:
          this.dataStatus0.push(data);
          break;
        case 1:
          this.dataStatus1.push(data);
          break;
        case 2:
          this.dataStatus2.push(data);
          break;

        default:
          break;
      }
    });
  },
};
</script>
<style scoped lang='scss'>
.trelloContainer {
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
}

.problemList {
  padding: 1rem;
  width: 30%;
}

.draggableContainer {
  overflow: auto;
  overflow-y: hidden;
  height: 100%;
  width: 100%;
  background: rgb(255, 237, 203);
  min-height: 400px !important;
  min-width: 200px;

  span {
    min-height: 20px;
    display: block;
    min-width: 200px;
    // display: flex;
    // flex-wrap: wrap;
  }
}
.problemListContainer {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 900px;
}
.graggableItem {
  cursor: move;
  display: flex;
  height: 95%;
  box-sizing: border-box;
  // flex-direction: column;
  background: #fd8115;
  border-radius: 8px;
  color: #fff;
  font-weight: 700;
  padding: 0.5rem;
  margin: 0.5rem;
  position: relative;
}
.stopIndex {
  height: 20% !important;
  display: block;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}
.stopName {
  // -webkit-writing-mode: vertical-lr;
  // writing-mode: vertical-lr;
}
</style>