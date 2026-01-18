<template>
  <div class="content-area">
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
  padding: 0px;
  overflow-y: auto;
  height: 100vh;
  background-color: rgb(236, 240, 245);
}

.page-title {
  margin: 0;
  color: #333;
  font-size: 10px;
  font-weight: bold;
  margin-bottom: 0px;
  padding-bottom: 0px;
  border-bottom: 0px solid #eee;
}

.page-content {
  min-height: calc(100vh - 100px);
}
</style>