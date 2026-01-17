import { post, get } from '../utils';
import { aesEncrypt } from '../utils';

export const login = async (username, password) => {
  // 将用户名和密码组合成对象并加密
  const loginData = {
    username: username,
    password: password
  };
  
  // 使用AES加密整个数据对象
  const encryptedData = aesEncrypt(loginData);
  
  // 发送加密后的数据作为单一字符串参数
  const response = await post('/login', {
    data: encryptedData
  });
  
  // 如果code为500，不抛出错误而是直接返回响应，这样前端可以处理具体的错误信息
  if (response.code === 500) {
    return response;
  }
  
  // 检查响应中的code是否为200，如果不是500也不是200则抛出错误
  if (response.code !== 200) {
    throw new Error(response.msg || '登录失败');
  }
  
  // 如果响应包含token，将其保存到localStorage中
  if (response.data && response.data.token) {
    // 将token存储到localStorage，以便后续请求使用
    localStorage.setItem('authToken', response.data.token);
  } else if (response.data && typeof response.data === 'string') {
    // 特殊情况：如果data字段本身就是一个token字符串
    localStorage.setItem('authToken', response.data);
  } else if (response.token) {
    // 备选方案：如果token直接在响应根级别
    localStorage.setItem('authToken', response.token);
  }
  
  return response;
};

export const getCurrentUser = async () => {
  const response = await post('/login/current_user');
  
  if (response.code !== 200) {
    throw new Error(response.msg || '获取用户信息失败');
  }
  
  return response;
};