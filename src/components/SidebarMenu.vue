<template>
  <div class="sidebar-menu">
    <div class="menu-header">
      <h3>注塑生产系统</h3>
    </div>
    <ul class="menu-list">
      <li v-for="(menu, index) in menuConfig" :key="index" class="menu-item">
        <div v-if="menu.children && menu.children.length > 0" class="menu-parent" @click="toggleMenu(index)">
          <span class="menu-icon">
            <img v-if="menu.icon.startsWith('http') || menu.icon.includes('.png') || menu.icon.includes('.jpg') || menu.icon.includes('.svg')" 
                 :src="menu.icon" 
                 :alt="menu.name" 
                 class="icon-img" />
            <span v-else>{{ menu.icon }}</span>
          </span>
          <span>{{ menu.name }}</span>
          <span class="menu-toggle" :class="{ 'rotated': isOpen[index] }">▾</span>
        </div>
        <div v-else class="menu-parent no-children" @click="navigateTo(menu.path)">
          <span class="menu-icon">
            <img v-if="menu.icon.startsWith('http') || menu.icon.includes('.png') || menu.icon.includes('.jpg') || menu.icon.includes('.svg')" 
                 :src="menu.icon" 
                 :alt="menu.name" 
                 class="icon-img" />
            <span v-else>{{ menu.icon }}</span>
          </span>
          <span>{{ menu.name }}</span>
        </div>
        <transition name="slide">
        <ul v-show="menu.children && menu.children.length > 0 && isOpen[index]" class="submenu-list">
          <li
            v-for="(child, childIndex) in menu.children"
            :key="childIndex"
            class="submenu-item"
            @click="navigateTo(child.path)"
          >
            {{ child.name }}
          </li>
        </ul>
        </transition>
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { menuConfig } from '@/menuConfig.js';

export default {
  name: 'SidebarMenu',
  setup() {
    const isOpen = reactive({});
    const router = useRouter();
    
    const toggleMenu = (index) => {
      // 切换菜单项的展开/收起状态
      if (isOpen[index]) {
        isOpen[index] = false;
      } else {
        isOpen[index] = true;
      }
    };
    
    const navigateTo = (path) => {
      if (path) {
        router.push(path);
      }
    };
    
    return {
      menuConfig,
      isOpen,
      toggleMenu,
      navigateTo
    };
  }
};
</script>

<style scoped>
.sidebar-menu {
  width: 250px;
  background: linear-gradient(to bottom, #2c3e50, #1a2530);
  height: 100vh;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.1);
  padding: 0;
  color: #ecf0f1;
}

.menu-header {
  padding: 25px 20px;
  background: linear-gradient(to right, #3498db, #2980b9);
  margin-bottom: 0px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-header h3 {
  margin: 0;
  font-size: 20px;
  color: white;
  font-weight: 600;
  letter-spacing: 0px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 0px;
}

.menu-parent {
  padding: 20px 20px;
  font-weight: 500;
  color: #ecf0f1;
  cursor: pointer;
  background-color: rgba(44, 62, 80, 0.7);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.menu-parent:hover {
  background: linear-gradient(to right, rgba(52, 152, 219, 0.2), rgba(52, 152, 219, 0.1));
  border-left: 3px solid #3498db;
  padding-left: 22px;
  color: #ffffff;
  transform: translateX(3px);
}

.menu-parent.no-children {
  justify-content: flex-start;
}

.menu-icon {
  margin-right: 10px;
  font-size: 16px;
  width: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.menu-toggle {
  font-size: 16px;
  transition: transform 0.3s ease;
  user-select: none;
  width: 20px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #bdc3c7;
  margin-left: auto;
  position: relative;
}

.menu-toggle::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid currentColor;
  transition: all 0.3s ease;
}

.menu-toggle.rotated {
  transform: rotate(180deg);
  color: #3498db;
}

.menu-toggle.rotated::before {
  border-top: 8px solid #3498db;
}

.submenu-list {
  list-style: none;
  padding-left: 25px;
  margin: 0px 0;
  background: linear-gradient(to bottom, rgba(30, 40, 50, 0.4), rgba(20, 30, 40, 0.4));
  border-radius: 0 0 5px 5px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.submenu-item {
  padding: 12px 20px 12px 30px;
  cursor: pointer;
  border-radius: 4px;
  margin: 3px 10px;
  transition: all 0.3s ease;
  color: #a0aec0;
  position: relative;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: rgba(30, 40, 50, 0.3);
}

.submenu-item:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: transparent;
  border-radius: 3px 0 0 3px;
  transition: all 0.3s ease;
}

.submenu-item:hover {
  background: linear-gradient(to right, rgba(52, 152, 219, 0.3), rgba(52, 152, 219, 0.2));
  color: #ffffff;
  padding-left: 35px;
  transform: translateX(3px);
}

.submenu-item:hover:before {
  background: linear-gradient(to bottom, #3498db, #1abc9c);
}

.submenu-item:active {
  transform: scale(0.98);
}

/* 子菜单展开/收起动画 */
.slide-enter-active, .slide-leave-active {
  max-height: 200px;
  overflow: hidden;
  transition: max-height 0.3s ease;
  opacity: 1;
}

.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>