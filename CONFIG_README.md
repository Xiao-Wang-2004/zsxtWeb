# 统一配置管理系统说明

## 概述
本项目现已采用统一的配置管理方式，所有环境相关的配置都集中在一处管理，便于维护和修改。

## 配置文件位置
```
src/
└── config/
    └── index.js          # 统一配置管理中心
```

## 配置结构

### 主要配置项

```javascript
{
  // 当前环境 ('development' | 'production')
  ENV: 'development',
  
  // API相关配置
  API: {
    BASE_URL: '/api',           // 开发环境使用代理，生产环境使用真实地址
    TIMEOUT: 10000,             // 请求超时时间(ms)
    HEADERS: {                  // 默认请求头
      'Content-Type': 'application/json'
    }
  },
  
  // 应用配置
  APP: {
    PORT: 18080,               // 应用端口
    TITLE: '注塑系统',          // 应用标题
    VERSION: '1.0.0'           // 应用版本
  },
  
  // 加密配置
  CRYPTO: {
    KEY: 'ZSXT_DEFAULT_CRYPTO_KEY_20241234',  // AES加密密钥
    IV: 'ZSXT_IV_20240117'                     // AES初始化向量
  }
}
```

## 环境配置详情

### 开发环境 (development)
- API基础地址: `/api` (通过Vite代理转发)
- 后端真实地址: `http://8.129.129.34:8099`
- 应用端口: 18080
- 启用代理: 是

### 生产环境 (production)
- API基础地址: `http://8.129.129.34:8099` (直连)
- 应用端口: 80
- 启用代理: 否

## 使用方法

### 在组件中使用配置

```javascript
// 引入配置
import config from '@/config';

// 获取API基础地址
const apiUrl = config.API.BASE_URL;

// 判断当前环境
if (config.isDev()) {
  console.log('当前是开发环境');
}

if (config.isProd()) {
  console.log('当前是生产环境');
}

// 获取后端真实地址（用于文档或调试）
console.log('后端地址：', config.getBackendRealUrl());
```

### 在API请求中使用

```javascript
// API工具类已自动使用统一配置
import { get, post } from '@/api/utils';

// 这些请求会自动使用正确的基础地址
const userData = await get('/user/info');
const result = await post('/order/create', orderData);
```

## 修改配置

如需修改配置，只需编辑 `src/config/index.js` 文件：

### 修改后端地址
```javascript
// 开发环境配置
development: {
  API_BASE_URL: '/api',
  BACKEND_REAL_URL: 'http://新的IP地址:端口',  // 修改这里
  // ...
},

// 生产环境配置  
production: {
  API_BASE_URL: 'http://新的IP地址:端口',     // 修改这里
  // ...
}
```

### 添加新配置项
```javascript
export const config = {
  // ... 现有配置
  
  // 新增配置项
  NEW_FEATURE: {
    ENABLED: true,
    CONFIG_VALUE: 'some-value'
  }
};
```

## 验证配置

可以通过以下方式验证配置是否正确：

1. **查看浏览器控制台**：
```javascript
import config from '@/config';
console.log('当前配置：', config);
```

2. **检查网络请求**：
   - 开发环境：请求应该发送到 `/api/xxx`，由Vite代理转发
   - 生产环境：请求应该直接发送到 `http://8.129.129.34:8099/xxx`

## 注意事项

1. **环境变量**：配置会根据 `import.meta.env.MODE` 自动切换
2. **代理配置**：开发环境的代理配置在 `vite.config.js` 中
3. **缓存问题**：修改配置后可能需要清除浏览器缓存
4. **构建产物**：生产环境构建时会使用对应的配置

## 故障排除

### 问题：请求发送到了错误的地址
**解决方案**：
1. 检查 `src/config/index.js` 中的配置是否正确
2. 确认当前运行环境（开发/生产）
3. 查看浏览器网络面板确认实际请求地址

### 问题：代理不工作
**解决方案**：
1. 检查 `vite.config.js` 中的代理配置
2. 确认后端服务是否正常运行
3. 查看终端输出是否有代理相关的错误信息

### 问题：配置修改后不生效
**解决方案**：
1. 重启开发服务器
2. 清除浏览器缓存
3. 检查是否有其他地方硬编码了配置值