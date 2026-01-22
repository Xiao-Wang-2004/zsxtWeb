import { createRouter, createWebHistory } from 'vue-router';
import UnitInfo from '@/views/basic-info/UnitInfo.vue';
import MoldInfo from '@/views/basic-info/MoldInfo.vue';
import HomePage from '@/views/home/HomePage.vue';
import Login from '@/views/auth/Login.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import MoldNumber from "@/views/basic-info/MoldNumber.vue";
import NumberInfo from "@/views/basic-info/NumberInfo.vue";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false } // 登录页不需要认证
  },
  {
    path: '/',
    name: 'Home',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'HomePage',
        component: HomePage,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/basic-info/unit-info',
    name: 'UnitInfo',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'UnitInfoPage',
        component: UnitInfo,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/basic-info/mold-info',
    name: 'MoldInfo',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'MoldInfoPage',
        component: MoldInfo,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/basic-info/mold-number',
    name: 'MoldNumber',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'MoldNumberPage',
        component: MoldNumber,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/basic-info/number-info',
    name: 'NumberInfo',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'NumberInfoPage',
        component: NumberInfo,
        meta: { requiresAuth: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局路由守卫：检查是否已登录
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // 如果目标页面需要认证且用户未登录，则重定向到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.path === '/login' && isLoggedIn) {
    // 如果用户已登录并尝试访问登录页，则重定向到首页
    next('/');
  } else {
    next();
  }
});

export default router;