<template>
  <div class="home-page">
    <h1>

      系统首页还未开发
    </h1>
    <p>欢迎使用管理系统</p>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
};
</script>

<style scoped>
.home-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.home-page h1 {
  color: #333;
  font-size: 28px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.home-icon {
  width: 32px;
  height: 32px;
  vertical-align: middle;
}

.home-page p {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
}

.welcome-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-card h2 {
  margin-top: 0;
  color: #444;
  font-size: 20px;
}

.welcome-card ul {
  padding-left: 20px;
}

.welcome-card li {
  margin-bottom: 10px;
  line-height: 1.5;
}
</style>