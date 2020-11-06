<template>
  <div id="app">
    <!-- <button @click="send">send</button> -->
    <!-- <span v-if="signalRMsg">{{ signalRMsg }}</span> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as signalR from "@aspnet/signalr";
export default {
  name: "App",
  data() {
    return {
      connection: null,
      hubConnection: new signalR.HubConnectionBuilder()
        .withUrl("http://openauth.1966.org.tw/api/chatHub")
        .build(),
      signalRMsg: null,
    };
  },
  computed: {
    ...mapGetters(["oidcIsAuthenticated"]),
  },
  methods: {
    userLoaded: function (e) {
      console.log(
        "I am listening to the user loaded event in vuex-oidc",
        e.detail
      );
    },
    connectHub() {
      const vm = this;
      vm.hubConnection
        .start()
        .then(() => {
          console.log("signalR success connect");
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
    send() {
      const vm = this;
      vm.hubConnection
        .invoke("SendMessage", "ccccc", "bbbbb")
        .then(() => {
          console.log("SendMessage success");
        })
        .catch(function (err) {
          return console.error(err);
        });
    },
  },
  mounted() {
    console.log("app.vue mounted");
    window.addEventListener("vuexoidc:userLoaded", this.userLoaded);
    // console.log("defaultorgid", this.defaultorgid);
    this.connectHub();
    // //1、首先我们实例化一个连接器
    //  this.connection = new signalR.HubConnectionBuilder()
    //      //然后配置通道路由
    //      .withUrl('/api/chatHub')
    //      //日志信息
    //      .configureLogging(signalR.LogLevel.Information)
    //      //创建
    //      .build();
  },
  destroyed() {
    window.removeEventListener("vuexoidc:userLoaded", this.userLoaded);
  },
};
</script>
