<script setup>
import { ref, onMounted } from 'vue';

const responseText = ref('');

const fetchUserData = async () => {
  try {
    const res = await fetch('/api/test/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 添加凭据以支持跨域请求中的认证
      credentials: 'include',
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.text();
    console.log('Response received:', data);  // 调试信息
    responseText.value = data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    responseText.value = `Error: ${error.message}`;  // 显示错误信息到页面
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div>{{ responseText }}</div>
</template>

<style scoped>

</style>
