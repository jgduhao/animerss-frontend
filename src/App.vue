<template>
  <div id="nav">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          :router="enableRouter"
        >
          <el-menu-item index="/">动画列表</el-menu-item>
          <el-menu-item index="RssFeed">RSS订阅设置</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  setup() {},
  data() {
    return {
      activeIndex: "/",
      enableRouter: true,
    };
  },
  methods: {
    handleSelect(key) {
      this.activeIndex = key;
    },
  },
};
</script>
