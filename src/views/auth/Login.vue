<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-section">
        <img src="/log.png" alt="Logo" class="logo-image" />
        <h1 class="system-title">注塑生产系统</h1>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="input-group">
          <el-input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            class="input-field"
            size="large"
            clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="input-group">
          <el-input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="input-field"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="input-group">
          <el-input
            v-model="captcha"
            type="text"
            placeholder="请输入验证码"
            class="input-field"
            size="large"
            maxlength="4"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><Key /></el-icon>
            </template>
            <template #suffix>
              <div class="captcha-suffix" @click="generateCaptcha">
                {{ generatedCaptcha }}
              </div>
            </template>
          </el-input>
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <el-button 
          type="primary" 
          size="large" 
          class="login-button" 
          @click="handleLogin"
          :loading="loading"
        >
          <el-icon><Right /></el-icon>
          登录
        </el-button>
        <div class="guest-login-tip">游客登录默认账号密码为admin</div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { login, getCurrentUser } from '@/api/auth/loginApi';

export default {
  name: 'Login',
  setup() {
    const username = ref('');
    const password = ref('');
    const captcha = ref('');
    const generatedCaptcha = ref('');
    const errorMessage = ref('');
    const loading = ref(false);
    const router = useRouter();

    // 生成随机验证码
    const generateCaptcha = () => {
      const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
      let result = '';
      for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      generatedCaptcha.value = result;
    };

    onMounted(() => {
      generateCaptcha();
      // 设置默认账号密码为admin
      username.value = 'admin';
      password.value = 'admin';
    });

    const handleLogin = async () => {
      // 清空之前的错误消息
      errorMessage.value = '';
      
      // 检查输入是否为空
      if (!username.value.trim() || !password.value.trim() || !captcha.value.trim()) {
        errorMessage.value = '请填写完整信息';
        return;
      }
      
      // 简单验证验证码
      if (captcha.value.toLowerCase() !== generatedCaptcha.value.toLowerCase()) {
        errorMessage.value = '验证码错误';
        
        // 验证码错误时清空验证码输入框并刷新验证码
        captcha.value = '';
        generateCaptcha(); // 重新生成验证码
        return;
      }

      loading.value = true;

      try {
        // 调用登录接口 - 现在传入用户名和密码分别作为参数
        const response = await login(username.value, password.value);

        // 只有当code为200时才视为登录成功
        if (response.code === 200) {
          // 登录成功处理
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userInfo', JSON.stringify(response)); // 存储用户信息

          // 如果响应中包含token,也单独存储
          if (response.data && response.data.token) {
            localStorage.setItem('authToken', response.data.token);
                      
            // 解析token获取用户类型
            try {
              const tokenParts = response.data.token.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                if (payload.type !== undefined) {
                  localStorage.setItem('userType', payload.type.toString());
                }
              }
            } catch (error) {
              console.error('解析token失败:', error);
            }
          } else if (response.data && typeof response.data === 'string') {
            // 特殊情况:如果data字段本身就是一个token字符串
            localStorage.setItem('authToken', response.data);
                      
            // 尝试解析token获取用户类型
            try {
              const tokenParts = response.data.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                if (payload.type !== undefined) {
                  localStorage.setItem('userType', payload.type.toString());
                }
              }
            } catch (error) {
              console.error('解析token失败:', error);
            }
          } else if (response.token) {
            localStorage.setItem('authToken', response.token);
                      
            // 尝试解析token获取用户类型
            try {
              const tokenParts = response.token.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                if (payload.type !== undefined) {
                  localStorage.setItem('userType', payload.type.toString());
                }
              }
            } catch (error) {
              console.error('解析token失败:', error);
            }
          }

          // 获取当前用户信息并存储
          try {
            const currentUserResponse = await getCurrentUser();
            if (currentUserResponse.code === 200 && currentUserResponse.data && currentUserResponse.data.name) {
              // 将用户姓名存储到localStorage中，供UserBar组件使用
              const userInfo = {
                name: currentUserResponse.data.name
              };
              localStorage.setItem('currentUser', JSON.stringify(userInfo));
            }
          } catch (error) {
            console.error('获取当前用户信息失败:', error);
            // 即使获取用户信息失败，仍然跳转到首页
          }

          // 跳转到首页
          router.push('/');
        } else {
          // 如果响应中有错误信息，则显示该信息
          errorMessage.value = response.msg || '登录失败';
          
          // 如果code为500，特别处理
          if (response.code === 500) {
            errorMessage.value = response.msg || '服务器内部错误';
          }
          
          // 登录失败时清空验证码输入框并刷新验证码
          captcha.value = '';
          generateCaptcha();
        }
      } catch (error) {
        console.error('登录失败:', error);
        // 显示来自后端的错误消息
        errorMessage.value = error.message || '登录失败，请重试';
        
        // 登录失败时清空验证码输入框并刷新验证码
        captcha.value = '';
        generateCaptcha();
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      captcha,
      generatedCaptcha,
      errorMessage,
      loading,
      handleLogin,
      generateCaptcha
    };
  }
};
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: url('/login.png');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
}

.login-box {
  width: 400px;
  padding: 40px;
  border-radius: 15px;
  background-color: rgba(18, 84, 156, 0.75); /* 颜色为18, 84, 156半透明 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  color: white;
}

.logo-image {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  opacity: 0.9;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
}

.system-title {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  margin: 0;
  text-align: center;
}

.login-form .input-group {
  margin-bottom: 20px;
  position: relative;
}

.input-field {
  width: 100%;
  border-radius: 8px;
}

.captcha-suffix {
  background-color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  color: #12549c;
  cursor: pointer;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 5px;
  user-select: none;
}

.login-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 10px;
  background: linear-gradient(135deg, #0d6efd, #0b5ed7);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
}

.login-button:hover {
  background: linear-gradient(135deg, #0b5ed7, #0a56c5);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(13, 110, 253, 0.4);
}

.login-button:deep(.el-button__content) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 0px;
  margin-bottom: 10px;
  margin-left: 5px;
  text-align: left;
  min-height: 20px;
  display: block;
  font-weight: 500;
  background-color: rgba(231, 76, 60, 0.1);
  padding: 10px 10px;
  border-radius: 4px;
  border-left: 3px solid #e74c3c;
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% {transform: translateX(0);}
  25% {transform: translateX(-2px);}
  75% {transform: translateX(2px);}
}

.guest-login-tip {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-align: center;
  margin-top: 15px;
  font-weight: 400;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}
</style>