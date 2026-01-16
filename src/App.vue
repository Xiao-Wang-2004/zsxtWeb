<template>
  <div class="app-container">
    <SidebarMenu class="sidebar" />
    <ContentArea class="content" />
  </div>
</template>

<script>
import SidebarMenu from './components/SidebarMenu.vue';
import ContentArea from './components/ContentArea.vue';

export default {
  name: 'App',
  components: {
    SidebarMenu,
    ContentArea
  }
};
</script>

<style>
.app-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.sidebar {
  flex-shrink: 0;
}

.content {
  flex: 1;
  overflow-y: auto;
}
</style>