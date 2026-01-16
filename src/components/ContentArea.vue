<template>
  <div class="content-area">
    <header class="page-header">
      <h2>{{ pageTitle }}</h2>
    </header>
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

.page-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.page-content {
  min-height: calc(100vh - 100px);
}
</style>