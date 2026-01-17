<template>
  <div class="user-bar">
    <div class="spacer"></div>
    <div class="user-actions">
      <span class="user-name">当前用户: {{ userName }}</span>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserBar',
  data() {
    return {
      userName: '未知用户'
    };
  },
  created() {
    // 组件创建时加载用户信息
    this.loadCurrentUser();
    
    // 监听storage事件，以便在其他标签页登录/登出时更新用户信息
    window.addEventListener('storage', this.handleStorageChange);
  },
  mounted() {
    // 组件挂载时再次加载用户信息，确保显示最新信息
    this.loadCurrentUser();
  },
  beforeUnmount() {
    // 移除事件监听器
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    loadCurrentUser() {
      // 从localStorage获取当前用户信息
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser && currentUser.name) {
            this.userName = currentUser.name;
          }
        } catch (error) {
          console.error('解析用户信息失败:', error);
        }
      } else {
        // 如果没有存储的用户信息，尝试从userInfo中获取
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);
            if (userInfo && userInfo.data && userInfo.data.name) {
              this.userName = userInfo.data.name;
              // 同时存到currentUser中，方便后续使用
              localStorage.setItem('currentUser', JSON.stringify({name: userInfo.data.name}));
            }
          } catch (error) {
            console.error('解析用户信息失败:', error);
          }
        }
      }
    },
    handleStorageChange(event) {
      // 当localStorage发生变化时，重新加载用户信息
      if (event.key === 'currentUser' || event.key === 'userInfo' || event.key === 'isLoggedIn') {
        this.loadCurrentUser();
      }
    },
    handleLogout() {
      // 清除本地存储的登录信息
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      
      // 跳转到登录页面
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.user-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.spacer {
  flex: 1; /* 这个元素会占据左侧所有可用空间 */
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px; /* 在用户信息和退出按钮之间添加间距 */
}

.user-name {
  color: #495057;
  font-weight: 500;
  font-size: 15px;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #e9ecef; /* 浅灰色背景 */
  color: #495057; /* 深灰色文字 */
  border: 1px solid #ced4da; /* 边框颜色 */
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background-color: #dde0e3; /* 悬停时稍微深一些的灰色 */
  color: #343a40;
  border-color: #adb5bd;
}
</style>