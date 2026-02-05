<template>
  <div class="main-layout">
    <SidebarMenu class="sidebar" />
    <div class="main-content">
      <UserBar class="user-bar" />
      <div class="content-wrapper">
        <div class="page-title">{{ pageTitle }}</div>
        <div class="content-area">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarMenu from '../components/SidebarMenu.vue';
import UserBar from '../components/UserBar.vue';

export default {
  name: 'MainLayout',
  components: {
    SidebarMenu,
    UserBar
  },
  computed: {
    pageTitle() {
      // 根据当前路由确定页面标题
      const routeMap = {
        '/basic-info/unit-info': '单位信息',
        '/basic-info/mold-info': '模具信息',
        '/basic-info/mold-number': '模具料号',
        '/basic-info/number-info': '原料信息',
        '/basic-info/machine-info': '机台设备',
        '/basic-info/product-info': '产品信息',
        '/order/create': '订单生成',
      };
      return routeMap[this.$route.path] || '页面';
    }
  }
};
</script>

<style>
.main-layout {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.sidebar {
  flex-shrink: 0;
  width: 250px;
  height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
}

.user-bar {
  flex-shrink: 0;
  border-bottom: 1px solid #dee2e6;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: rgb(236, 240, 245);
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  font-weight: 500; /* 变细字体 */
}

.content-area {
  flex: 1;
  overflow-y: auto;
}
</style>