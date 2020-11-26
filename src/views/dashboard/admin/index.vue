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
      <div class="settingContainer" style="display: flex">
        <el-input
          style="width: 200px"
          v-model="userName"
          placeholder="userName"
        ></el-input>
        <el-input
          style="width: 200px"
          v-model="message"
          placeholder="message"
        ></el-input>
        <el-input
          style="width: 200px"
          v-model="groupName"
          placeholder="groupName"
        ></el-input>
        <el-button @click="send">send</el-button>
        <el-button @click="addToGroup">addToGroup</el-button>
        <el-button @click="sendToGroup">sendToGroup</el-button>
      </div>
      <div class="settingContainer">
        <el-input
          style="width: 200px"
          v-model="temp.title"
          placeholder="title"
        ></el-input>
        <el-input
          style="width: 200px"
          v-model="temp.contents"
          placeholder="newList"
        ></el-input>
        <el-button @click="handleAdd">send</el-button>
      </div>
      <div class="problemListContainer">
        <!-- 待處理 -->
        <div class="problemList">
          <Title title="新增巴士路線"></Title>
          <draggable
            :list="dataStatus0"
            @change="handleChange0"
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
                  {{ stop.title }}
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
            @change="handleChange1"
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
                  {{ stop.title }}
                </span>
              </div>
            </transition-group>
          </draggable>
        </div>

        <!-- 已完成 -->
        <div class="problemList">
          <Title title="新增巴士路線3"></Title>
          <draggable
            @change="handleChange2"
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
                  {{ stop.title }}
                </span>
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>

    <!-- <vue-esign
      ref="esign"
      :width="800"
      :height="300"
      :isCrop="isCrop"
      :lineWidth="lineWidth"
      :lineColor="lineColor"
      :bgColor.sync="bgColor"
    />
    <button @click="handleReset">清空画板</button>
    <button @click="handleGenerate">生成图片</button> -->
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Title from "@/components/ConsoleTableTitle";
import * as signalR from "@aspnet/signalr";
import * as trello from "@/api/trello";
import { mapGetters } from "vuex";
export default {
  components: {
    draggable,
    Title,
  },
  data() {
    return {
      lineWidth: 4,
      lineColor: "#fff",
      bgColor: "#000",
      resultImg: "",
      isCrop: false,
      // trello
      temp: {
        id: "",
        title: "",
        contents: "",
        status: 0,
      },
      // 表單相關
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 999,
        key: undefined,
      },
      // signalR
      hubConnection: new signalR.HubConnectionBuilder()
        .withUrl("http://openauth.1966.org.tw/api/chatHub")
        .build(),
      signalRMsg: null,
      userName: "",
      message: "",
      groupName: "",
      newList: "",

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
  computed: {
    ...mapGetters(["defaultorgid"]),
  },
  methods: {
    handleReset() {
      this.$refs.esign.reset();
    },
    handleGenerate() {
      this.$refs.esign
        .generate()
        .then((res) => {
          this.resultImg = res;
        })
        .catch((err) => {
          alert(err); // 画布没有签字时会执行这里 'Not Signned'
        });
    },
    getList() {
      const vm = this;
      trello.load(vm.listQuery).then((res) => {
        vm.list = res.data;
        vm.list.forEach((data) => {
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
      });
    },
    // trello
    handleAdd() {
      const vm = this;
      trello.add(vm.temp).then((res) => {
        console.log(res);
      });
    },
    handleChange0(a) {
      let temp = a.added?.element;
      if (temp) {
        temp.status = Number(0);
        trello.update(temp).then((res) => {
          console.log(res);
        });
      }
    },
    handleChange1(a) {
      let temp = a.added?.element;
      if (temp) {
        temp.status = Number(1);
        trello.update(temp).then((res) => {
          console.log(res);
        });
      }
    },
    handleChange2(a) {
      let temp = a.added?.element;
      if (temp) {
        temp.status = Number(2);
        trello.update(temp).then((res) => {
          console.log(res);
        });
      }
    },
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
    addToGroup() {
      const vm = this;
      vm.hubConnection
        .invoke("AddToGroup", vm.groupName)
        .then(() => {
          console.log("addToGroup success");
        })
        .catch(function (err) {
          return console.error(err);
        });
    },
    sendToGroup() {
      const vm = this;
      vm.hubConnection
        .invoke("SendMessageToGroupAsync", vm.groupName, "z")
        .then(() => {
          console.log("SendMessageToGroupAsync success");
        })
        .catch(function (err) {
          return console.error(err);
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
    // this.connectHub();
    this.getList();
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

.settingContainer {
  display: flex;
  justify-content: space-around;
  width: 100%;
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
    min-height: 40px;
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