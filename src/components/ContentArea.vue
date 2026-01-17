<template>
  <div class="content-area">
    <div class="page-title">{{ pageTitle }}</div>
    <div class="page-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentArea',
  computed: {
    pageTitle() {
      // 根据当前路由确定页面标题
      const routeMap = {
        '/basic-info/unit-info': '单位信息',
        '/': '首页'
      };
      return routeMap[this.$route.path] || '页面';
    }
  }
};
</script>

<style scoped>
.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  height: 100vh;
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.page-content {
  min-height: calc(100vh - 100px);
}
</style>