import { createRouter, createWebHistory } from 'vue-router';
import UnitInfo from '@/views/basic-info/UnitInfo.vue';
import MoldInfo from '@/views/basic-info/MoldInfo.vue';
import HomePage from '@/views/home/HomePage.vue';
import Login from '@/views/auth/Login.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import MoldNumber from "@/views/basic-info/MoldNumber.vue";
import NumberInfo from "@/views/basic-info/NumberInfo.vue";
import MachineInfo from "@/views/basic-info/MachineInfo.vue";
import ProductInfo from "@/views/basic-info/ProductInfo.vue";
import Create from "@/views/order/Create.vue";
import InLibrary from "@/views/order/InLibrary.vue";
import OutLibrary from "@/views/order/OutLibrary.vue";
import Progress from "@/views/order/Progress.vue";
import OrderRefer from "@/views/refer/OrderRefer.vue";

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
  },
  {
    path: '/basic-info/machine-info',
    name: 'MachineInfo',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'MachineInfoPage',
        component: MachineInfo,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/basic-info/product-info',
    name: 'ProductInfo',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'ProductInfoPage',
        component: ProductInfo,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/order/create',
    name: 'OrderCreate',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'OrderCreatePage',
        component: Create,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/order/in-library',
    name: 'OrderInLibrary',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'OrderInLibraryPage',
        component: InLibrary,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/order/out-library',
    name: 'OrderOutLibrary',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'OrderOutLibraryPage',
        component: OutLibrary,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/order/progress',
    name: 'OrderProgress',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'OrderProgressPage',
        component: Progress,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/refer/order-refer',
    name: 'OrderRefer',
    component: MainLayout,
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'OrderReferPage',
        component: OrderRefer,
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