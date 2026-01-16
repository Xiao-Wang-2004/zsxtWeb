import { createRouter, createWebHistory } from 'vue-router';
import UnitInfo from '@/views/basic-info/UnitInfo.vue';
import HomePage from '@/views/home/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/basic-info/unit-info',
    name: 'UnitInfo',
    component: UnitInfo
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;