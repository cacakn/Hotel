<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeIndex"
      router
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
    >
      <!-- <el-menu-item index="/dashboard">
        <i class="el-icon-service"></i>
        <span slot="title">Dashboard</span>
      </el-menu-item>-->

      <el-submenu index="/users">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span slot="title">用户管理</span>
        </template>
        <el-menu-item index="/users">
          <i class="el-icon-menu"></i>用户列表
        </el-menu-item>
      </el-submenu>
      <el-submenu index="/rights">
        <template slot="title">
          <i class="el-icon-lock"></i>
          <span slot="title">权限管理</span>
        </template>
        <el-menu-item index="/roles">
          <i class="el-icon-menu"></i>角色列表
        </el-menu-item>
        <el-menu-item index="/rights">
          <i class="el-icon-menu"></i>权限列表
        </el-menu-item>
      </el-submenu>
      <!-- <el-submenu index="/good">
        <template slot="title">
          <i class="el-icon-shopping-bag-2"></i>
          <span slot="title">商品管理</span>
        </template>
        <el-menu-item index="/goods">
          <i class="el-icon-menu"></i>商品列表
        </el-menu-item>
        <el-menu-item index="/goods2">
          <i class="el-icon-menu"></i>分类参数
        </el-menu-item>
        <el-menu-item index="/categories">
          <i class="el-icon-menu"></i>商品分类
        </el-menu-item>
      </el-submenu>-->
      <el-submenu index="/orders">
        <template slot="title">
          <i class="el-icon-s-order"></i>
          <span slot="title">订单管理</span>
        </template>
        <el-menu-item index="/goodorders">
          <i class="el-icon-menu"></i>商品订单
        </el-menu-item>
        <el-menu-item index="/roomOrders">
          <i class="el-icon-menu"></i>房间订单
        </el-menu-item>
        <el-menu-item index="/userOrders">
          <i class="el-icon-menu"></i>用户订单
        </el-menu-item>
      </el-submenu>

      <el-submenu index="/rooms">
        <template slot="title">
          <i class="el-icon-office-building"></i>
          <span slot="title">酒店管理</span>
        </template>
        <el-menu-item index="/rooms">
          <i class="el-icon-s-home"></i>房间管理
        </el-menu-item>
        <el-menu-item index="/commodity">
          <i class="el-icon-shopping-bag-1"></i>商品管理
        </el-menu-item>
        <el-menu-item index="/restaurant">
          <i class="el-icon-fork-spoon"></i>餐厅管理
        </el-menu-item>
        <el-menu-item index="/equipment">
          <i class="el-icon-bicycle"></i>健身器材管理
        </el-menu-item>
        <el-menu-item index="/features">
          <i class="el-icon-trophy-1"></i>酒店特色管理
        </el-menu-item>
        <el-menu-item index="/history">
          <i class="el-icon-reading"></i>酒店历史管理
        </el-menu-item>
        <el-menu-item index="/background">
          <i class="el-icon-picture"></i>背景图片管理
        </el-menu-item>
        <el-menu-item index="/peoplepicture">
          <i class="el-icon-s-custom"></i>人脸库管理
        </el-menu-item>
        <el-menu-item index="/realnameverification">
          <i class="el-icon-camera"></i>实名核验管理
        </el-menu-item>
      </el-submenu>

      <el-submenu index="/charts">
        <template slot="title">
          <i class="el-icon-view"></i>
          <span slot="title">统计管理</span>
        </template>
        <el-menu-item index="/charts/diagram">
          <i class="el-icon-menu"></i>访客统计
        </el-menu-item>
        <el-menu-item index="/charts/slider">
          <i class="el-icon-menu"></i>详细统计
        </el-menu-item>
      </el-submenu>
      <el-submenu index="/list">
        <template slot="title">
          <i class="el-icon-location-outline"></i>
          <span slot="title">回收管理</span>
        </template>
        <el-menu-item index="/list">
          <i class="el-icon-menu"></i>用户回收
        </el-menu-item>
        <el-menu-item index="/list1">
          <i class="el-icon-menu"></i>权限回收
        </el-menu-item>
        <el-menu-item index="/list2">
          <i class="el-icon-menu"></i>角色回收
        </el-menu-item>
        <el-menu-item index="/list3">
          <i class="el-icon-menu"></i>房间回收
        </el-menu-item>
        <el-menu-item index="/list4">
          <i class="el-icon-menu"></i>餐厅回收
        </el-menu-item>
        <el-menu-item index="/list5">
          <i class="el-icon-menu"></i>图片回收
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/setting">
        <i class="el-icon-setting"></i>
        <span slot="title">意见反馈</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Sidebar",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["sidebar"]),
    isCollapse() {
      return !this.sidebar.opened;
    },
    activeIndex() {
      const thisRoutPath = this.$route.path;
      if (this.$route.name === "details") {
        return "/tables/details";
      }
      return thisRoutPath;
    }
  },
  methods: {}
};
</script>

<style scoped>
.sidebar {
  background-color: rgb(84, 92, 100);
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
  height: 100%;
  /* background-color: grey !important; */
}

.el-menu-vertical-demo {
  min-height: 100vh;
  height: 100%;
}

.el-menu-item.is-active,
.el-submenu.is-active >>> .el-submenu__title {
  background: #484e5c !important;
}

.el-submenu .el-menu-item {
  padding-left: 40px !important;
  min-width: auto;
}
.el-submenu.is-active .el-menu-item {
  background: #484e5c !important;
}
.el-submenu.is-active .el-menu-item.is-active {
  background: #3a4046 !important;
}
.el-submenu .el-menu-item:hover {
  padding-left: 40px !important;
  background: rgb(67, 74, 80) !important;
}
.el-menu-item i {
  padding-bottom: 4px;
}

.el-submenu__title i {
  padding-bottom: 4px;
}

@media all and (max-width: 768px) {
  .el-menu--collapse {
    width: 0;
    overflow: hidden;
  }
}
</style>
