<template>
  <div id="app">
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
      this.hubConnection
        .start()
        .then((res) => {
          console.log(res, "success connect");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    window.addEventListener("vuexoidc:userLoaded", this.userLoaded);
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
