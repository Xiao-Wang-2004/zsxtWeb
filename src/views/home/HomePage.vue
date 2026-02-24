<template>
  <div class="home-page">
    <!-- 顶部标题区域 -->
    <div class="header-section">
      <h1 class="system-title">
        <span class="title-text">注塑生产管理系统</span>
      </h1>
      <p class="welcome-text">Welcome to Injection Molding Production Management System</p>
      <!-- 全屏按钮 -->
      <div class="fullscreen-controls">
        <button 
          class="fullscreen-btn" 
          @click="toggleFullscreen"
          :title="isFullscreen ? '退出全屏' : '进入全屏'"
        >
          <span v-if="!isFullscreen">🗖</span>
          <span v-else>✕</span>
        </button>
      </div>
    </div>
    
    <!-- 菜单图形展示区域 -->
    <div class="menu-graph-container">
      <div class="center-node" @click="navigateTo('/')">
        <div class="node-content">
          <img src="/home2.png" alt="首页" class="node-icon" />
          <span class="node-label">系统首页</span>
        </div>
      </div>
      
      <div 
        v-for="(menu, index) in filteredMenuConfig" 
        :key="menu.name"
        class="menu-node"
        :class="[
          `node-${index}`, 
          { 'active': activeNode === index },
          { 'inactive': activeNode !== null && activeNode !== index }
        ]"
        @mouseenter="handleNodeHover(index, true)"
        @mouseleave="handleNodeHover(index, false)"
        @click="handleMenuClick(menu)"
      >
        <div class="node-content">
          <img 
            :src="getNodeIcon(menu, index)" 
            :alt="menu.name" 
            class="node-icon" 
          />
          <span class="node-label">{{ menu.name }}</span>
        </div>
        
        <!-- 子菜单从父菜单位置分散出去 -->
        <div 
          v-if="menu.children && menu.children.length > 0"
          class="submenu-scatter"
          :class="{ 'show': activeNode === index }"
          :data-menu-index="index"
        >
          <div 
            v-for="(child, childIndex) in menu.children" 
            :key="child.name"
            class="submenu-node"
            :class="`submenu-${childIndex}`"
            :data-parent-index="index"
            @mouseenter="handleSubNodeHover(index, childIndex, true)"
            @mouseleave="handleSubNodeHover(index, childIndex, false)"
            @click.stop="handleSubMenuClick(child)"
          >
            <div class="submenu-content">
              <span class="submenu-label">{{ child.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script>
import { menuConfig } from '../../menuConfig.js';

export default {
  name: 'HomePage',
  data() {
    return {
      menuConfig,
      isFullscreen: false,
      activeNode: null,  // 当前激活的菜单节点索引
      closeTimer: null   // 用于存储关闭定时器的引用
    };
  },
  computed: {
    filteredMenuConfig() {
      // 过滤掉'系统首页'菜单项，只保留基础信息、订单管理、查询统计三个主菜单
      return this.menuConfig.filter(menu => 
        menu.name === '基本信息' ||
        menu.name === '订单管理' || 
        menu.name === '查询管理'
      );
    }
  },
  mounted() {
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange);
  },
  beforeUnmount() {
    // 移除事件监听器
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange);
  },
  methods: {
    
    handleNodeHover(index, isHover) {
      if (isHover) {
        this.activeNode = index;
        // 清除可能存在的关闭定时器
        if (this.closeTimer) {
          clearTimeout(this.closeTimer);
          this.closeTimer = null;
        }
      } else {
        // 添加延迟，避免快速切换时的闪烁
        this.closeTimer = setTimeout(() => {
          if (this.activeNode === index) {
            this.activeNode = null;
          }
          this.closeTimer = null;
        }, 500); // 增加延迟时间到500ms
      }
    },
    
    handleSubNodeHover(parentIndex, childIndex, isHover) {
      // 子菜单悬停时保持父菜单激活状态
      if (isHover) {
        this.activeNode = parentIndex;
        // 清除可能存在的关闭定时器
        if (this.closeTimer) {
          clearTimeout(this.closeTimer);
          this.closeTimer = null;
        }
      } else {
        // 子菜单失去焦点时增加延迟，并存储定时器引用
        this.closeTimer = setTimeout(() => {
          if (this.activeNode === parentIndex) {
            this.activeNode = null;
          }
          this.closeTimer = null;
        }, 500); // 增加到500ms延迟
      }
    },
    
    handleMenuClick(menu) {
      if (menu.path) {
        this.navigateTo(menu.path);
      } else if (menu.children && menu.children.length > 0) {
        // 如果有子菜单，默认跳转到第一个子菜单
        this.navigateTo(menu.children[0].path);
      }
    },
    
    handleSubMenuClick(subMenu) {
      if (subMenu.path) {
        this.navigateTo(subMenu.path);
      }
    },
    
    navigateTo(path) {
      if (path) {
        this.$router.push(path);
      }
    },
    
    toggleFullscreen() {
      if (!this.isFullscreen) {
        // 进入全屏模式
        const element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { // Safari
          element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
          element.msRequestFullscreen();
        }
      } else {
        // 退出全屏模式
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) { // IE/Edge
          document.msExitFullscreen();
        }
      }
    },
    
    handleFullscreenChange() {
      // 检查当前是否处于全屏状态
      const isCurrentlyFullscreen = document.fullscreenElement || 
                                   document.webkitFullscreenElement || 
                                   document.mozFullScreenElement || 
                                   document.msFullscreenElement;
      
      this.isFullscreen = !!isCurrentlyFullscreen;
      // 通过事件向父组件传递全屏状态
      this.$emit('fullscreen-change', this.isFullscreen);
    },
    
    // 获取节点图标 - 根据菜单类型和悬停状态返回对应图标
    getNodeIcon(menu, index) {
      // 系统首页始终使用home2图标
      if (menu.name === '系统首页') {
        return '/home2.png';
      }
      
      // 根据菜单名称和悬停状态返回对应图标
      if (menu.name === '基本信息') {
        return this.activeNode === index ? '/msg.png' : '/msg2.png';
      } else if (menu.name === '订单管理') {
        return this.activeNode === index ? '/order.png' : '/order2.png';
      } else if (menu.name === '查询管理') {
        return this.activeNode === index ? '/refer.png' : '/refer2.png';
      }
      
      // 默认返回原图标
      return menu.icon;
    }
  }
};
</script>

<style scoped>
.home-page {
  height: 100%;
  width: calc(100%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  margin-left: 0px;
}

/* 背景装饰 */
.home-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

/* 顶部标题区域 */
.header-section {
  text-align: center;
  margin: 0;
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 0 20px;
  box-sizing: border-box;
}

.system-title {
  font-size: clamp(1.8rem, 4vw, 3.2rem);
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  animation: fadeInDown 1s ease-out;
}

.welcome-text {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.5px;
  animation: fadeInUp 1s ease-out 0.3s both;
}

/* 全屏控制按钮 */
.fullscreen-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 30;
}

.fullscreen-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.fullscreen-btn:active {
  transform: scale(0.95);
}

/* 菜单图形容器 */
.menu-graph-container {
  position: absolute;
  top: 80%;  /* 从75%改为80%，进一步下移 */
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(700px, 85vw);
  height: min(400px, 60vh);
  perspective: 1000px;
  max-width: 85vw;
  max-height: 60vh;
}

/* 中心节点 */
.center-node {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.2),
    0 0 0 8px rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 20;
  animation: pulse 2s infinite alternate;
}

.center-node:hover {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.3),
    0 0 0 12px rgba(255, 255, 255, 0.4);
}

.node-content {
  text-align: center;
}

.node-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.node-label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  display: block;
}

/* 主菜单节点 */
.menu-node {
  position: absolute;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 15;
}

/* 激活状态 - 放大突出 */
.menu-node.active {
  transform: scale(1.4);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.3),
    0 0 0 10px rgba(255, 255, 255, 0.6);
  z-index: 30;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.menu-node.active .node-label {
  color: white;
  font-weight: bold;
}

.menu-node.active .node-icon {
  filter: brightness(0) invert(1);
}

/* 非激活状态 - 缩小移动 */
.menu-node.inactive {
  transform: scale(0.7);
  opacity: 0.6;
  z-index: 10;
}

/* 节点位置定位 - 默认状态 */
.node-0 { top: 50%; left: 50%; transform: translate(calc(-50% + 170px), -50%); }
.node-1 { top: 50%; left: 50%; transform: translate(calc(-50% - 170px), -50%); }
.node-2 { top: 50%; left: 50%; transform: translate(-50%, calc(-50% - 150px)); }

/* 节点位置定位 - 激活状态 */
.node-0.active { transform: translate(calc(-50% + 170px), -50%) scale(1.4); }
.node-1.active { transform: translate(calc(-50% - 170px), -50%) scale(1.4); }
.node-2.active { transform: translate(-50%, calc(-50% - 150px)) scale(1.4); }

/* 节点位置定位 - 非激活状态 */
.node-0.inactive { transform: translate(calc(-50% + 250px), -50%) scale(0.7); }
.node-1.inactive { transform: translate(calc(-50% - 250px), -50%) scale(0.7); }
.node-2.inactive { transform: translate(-50%, calc(-50% - 200px)) scale(0.7); }

/* 子菜单分散容器 - 从父菜单位置开始 */
.submenu-scatter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  z-index: 20 !important; /* 强制确保容器层级 */
  /* 扩大整体感应区域 */
  padding: 30px;
  margin: -30px;
  /* 调试用边框 */
  /* border: 1px solid red; */
}

.submenu-scatter.show {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

/* 子菜单节点 */
.submenu-node {
  position: absolute;
  width: 80px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
  transform: scale(0.5);
  z-index: 25 !important; /* 强制确保子菜单可见 */
  /* 调试用边框 */
  /* border: 1px solid yellow; */
}

.submenu-scatter.show .submenu-node {
  opacity: 1;
  transform: scale(1);
}

.submenu-node:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.submenu-content {
  text-align: center;
}

.submenu-label {
  font-size: 12px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
}

/* 子菜单从各自父菜单位置分散出去 - 自适应间距设计 */
/* 根据子菜单数量动态调整间距，避免拥挤 */

/* 基本信息菜单 (node-0) - 6个子菜单，较大间距 */
.node-0 .submenu-0 { top: -120px; left: 150px; }
.node-0 .submenu-1 { top: -70px; left: 180px; }
.node-0 .submenu-2 { top: -20px; left: 190px; }
.node-0 .submenu-3 { top: 30px; left: 180px; }
.node-0 .submenu-4 { top: 80px; left: 150px; }
.node-0 .submenu-5 { top: 130px; left: 120px; }

/* 订单管理菜单 (node-1) - 4个子菜单，中等间距 */
.node-1 .submenu-0 { top: -100px; right: 150px; }
.node-1 .submenu-1 { top: -50px; right: 170px; }
.node-1 .submenu-2 { top: 0px; right: 170px; }
.node-1 .submenu-3 { top: 50px; right: 150px; }

/* 查询管理菜单 (node-2) - 子菜单靠近父菜单，增加子菜单间距离 */
.node-2 .submenu-0 { bottom: 120px; left: -120px; }
.node-2 .submenu-1 { bottom: 140px; left: -60px; }
.node-2 .submenu-2 { bottom: 160px; left: 0px; }

/* 子菜单分散动画延迟 - 营造依次飞出的效果 */
/* 基本信息 (6个子菜单) - 从右侧行列式分散 */
.node-0 .submenu-scatter.show .submenu-0 { transition-delay: 0.1s; }
.node-0 .submenu-scatter.show .submenu-1 { transition-delay: 0.15s; }
.node-0 .submenu-scatter.show .submenu-2 { transition-delay: 0.2s; }
.node-0 .submenu-scatter.show .submenu-3 { transition-delay: 0.25s; }
.node-0 .submenu-scatter.show .submenu-4 { transition-delay: 0.3s; }
.node-0 .submenu-scatter.show .submenu-5 { transition-delay: 0.35s; }

/* 订单管理 (4个子菜单) - 从左侧行列式分散 */
.node-1 .submenu-scatter.show .submenu-0 { transition-delay: 0.1s; }
.node-1 .submenu-scatter.show .submenu-1 { transition-delay: 0.18s; }
.node-1 .submenu-scatter.show .submenu-2 { transition-delay: 0.26s; }
.node-1 .submenu-scatter.show .submenu-3 { transition-delay: 0.34s; }

/* 查询管理 (3个子菜单) - 从上方横向分散 */
.node-2 .submenu-scatter.show .submenu-0 { transition-delay: 0.1s; }
.node-2 .submenu-scatter.show .submenu-1 { transition-delay: 0.2s; }
.node-2 .submenu-scatter.show .submenu-2 { transition-delay: 0.3s; }

/* 动画效果 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.2),
      0 0 0 8px rgba(255, 255, 255, 0.3);
  }
  100% {
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.2),
      0 0 0 12px rgba(255, 255, 255, 0.2);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .menu-graph-container {
    width: 90vw;
    height: min(400px, 60vh);
    top: 85%;  /* 平板端进一步下移 */
  }
  
  .system-title {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 0;
  }
  
  .fullscreen-controls {
    top: 10px;
    right: 10px;
  }
  
  .fullscreen-btn {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }
  
  .menu-graph-container {
    height: min(300px, 50vh);
    width: 95vw;
    top: 90%;  /* 移动端进一步下移 */
  }
  
  .system-title {
    font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  }
  
  .header-section {
    top: 5px;
    padding: 0 10px;
  }
  
  .node-0 { transform: translate(calc(-50% + 100px), -50%); }
  .node-1 { transform: translate(calc(-50% - 100px), -50%); }
  .node-2 { transform: translate(-50%, calc(-50% - 110px)); }
  
  /* 移动端激活状态 */
  .node-0.active { transform: translate(calc(-50% + 100px), -50%) scale(1.4); }
  .node-1.active { transform: translate(calc(-50% - 100px), -50%) scale(1.4); }
  .node-2.active { transform: translate(-50%, calc(-50% - 110px)) scale(1.4); }
  
  /* 移动端非激活状态 */
  .node-0.inactive { transform: translate(calc(-50% + 150px), -50%) scale(0.7); }
  .node-1.inactive { transform: translate(calc(-50% - 150px), -50%) scale(0.7); }
  .node-2.inactive { transform: translate(-50%, calc(-50% - 150px)) scale(0.7); }
  
  /* 移动端子菜单分散调整 - 自适应间距 */
  /* 基本信息 - 6个子菜单，适当间距 */
  .node-0 .submenu-0 { top: -90px; left: 110px; }
  .node-0 .submenu-1 { top: -50px; left: 130px; }
  .node-0 .submenu-2 { top: -10px; left: 140px; }
  .node-0 .submenu-3 { top: 30px; left: 130px; }
  .node-0 .submenu-4 { top: 70px; left: 110px; }
  .node-0 .submenu-5 { top: 110px; left: 90px; }
  
  /* 订单管理 - 4个子菜单，中等间距 */
  .node-1 .submenu-0 { top: -70px; right: 110px; }
  .node-1 .submenu-1 { top: -30px; right: 125px; }
  .node-1 .submenu-2 { top: 10px; right: 125px; }
  .node-1 .submenu-3 { top: 50px; right: 110px; }
  
  /* 查询管理 - 子菜单靠近父菜单，增加子菜单间距离 */
  .node-2 .submenu-0 { bottom: 100px; left: -100px; }
  .node-2 .submenu-1 { bottom: 115px; left: -50px; }
  .node-2 .submenu-2 { bottom: 130px; left: 0px; }
  
  .center-node {
    width: 80px;
    height: 80px;
  }
  
  .menu-node {
    width: 70px;
    height: 70px;
  }
  
  .node-icon {
    width: 30px;
    height: 30px;
  }
  
  .node-label {
    font-size: 12px;
  }
}
</style>