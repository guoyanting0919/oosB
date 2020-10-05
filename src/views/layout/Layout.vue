<template>
  <div class="app-wrapper" :class="classObj">
    <!-- <div class="globalSearchOrder">
      <i class="iconfont icon-search"></i>
      <input
        placeholder="快速搜尋訂單編號"
        class="searchOrderInput"
        type="text"
        v-model="orderId"
        @keydown.enter="handleSearch"
      />
    </div> -->
    <el-container class="flex-column">
      <el-header height="64px">
        <navbar></navbar>
      </el-header>
      <el-container class="flex-row flex-item">
        <sidebar class="sidebar-container"></sidebar>
        <div class="main-container flex-item">
          <tags-view class="custom-tags-view"></tags-view>
          <app-main></app-main>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
  },
  data() {
    return {
      orderId: "",
    };
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("CloseSideBar", { withoutAnimation: false });
    },
    handleSearch() {
      console.log(this.orderId);
      this.$router.push(`/allorder/detail/${this.orderId}?type=first`);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.el-header {
  padding: 0;
  line-height: 64px;
  background-color: #333;
  width: 100%;
  z-index: 100;
}
.el-container .sidebar-container {
  height: auto !important;
}

.el-container .main-container {
  margin-left: 0 !important;
  overflow: hidden;
}
.custom-tags-view {
  margin-top: 0 !important;
}
.globalSearchOrder {
  min-width: 50px;
  height: 50px;
  position: absolute;
  transition: 0.5s;
  background: #ffd28f;
  opacity: 0.6;
  border-radius: 200px;
  right: 1rem;
  bottom: 2rem;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;

  .icon-search {
    transform: translateX(2.5px);
    // transform: translateY(-1px);
  }

  .searchOrderInput {
    width: 0px;
    // opacity: 0;
    background: transparent;
    // border: 1px solid #fff;
    border: none;
    transition: 0.5s;

    &:focus {
      width: 200px;
      // border: 1px solid #fff;
      outline: none;
      padding-left: 0.5rem;
    }
  }

  &:hover,
  &:focus {
    opacity: 0.8;
    .searchOrderInput {
      width: 200px;
      padding-left: 0.5rem;
      opacity: 0.8;
    }
  }
}
</style>
