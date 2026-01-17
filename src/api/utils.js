// Import crypto-js for encryption
import CryptoJS from 'crypto-js';

// API base URL - 在开发环境中使用代理前缀，在生产环境中使用实际后端地址
const BASE_URL = import.meta.env.MODE === 'production' ? 'http://127.0.0.1:8099' : '/api';

// Common headers
const HEADERS = {
  'Content-Type': 'application/json'
};

// Get authorization token from localStorage
const getAuthToken = () => {
  // 优先从专门的authToken获取
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    return authToken;
  }
  
  // 兼容旧方式：从userInfo中获取
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const parsedInfo = JSON.parse(userInfo);
      return parsedInfo.token || null;
    } catch (e) {
      console.error('Error parsing user info:', e);
      return null;
    }
  }
  return null;
};

// Common headers with token
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// GET request
export const get = async (url, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${BASE_URL}${url}?${queryString}` : `${BASE_URL}${url}`;
  
  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: getHeaders()
  });
  
  return handleResponse(response);
};

// POST request
export const post = async (url, data = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  
  return handleResponse(response);
};

// PUT request
export const put = async (url, data = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  
  return handleResponse(response);
};

// DELETE request
export const del = async (url) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  
  return handleResponse(response);
};

// Handle response
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// 加密密钥，实际应用中应从配置中获取或动态生成
// 使用32字节(256位)的密钥
const CRYPTO_KEY = CryptoJS.enc.Utf8.parse('ZSXT_DEFAULT_CRYPTO_KEY_20241234'); // 32字节密钥
const CRYPTO_IV = CryptoJS.enc.Utf8.parse('ZSXT_IV_20240117'); // 16字节IV，需要16位字符

// AES加密函数
export const aesEncrypt = (data) => {
  try {
    // 将数据转换为JSON字符串
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // 使用crypto-js进行AES加密，明确指定参数
    const encrypted = CryptoJS.AES.encrypt(jsonString, CRYPTO_KEY, {
      iv: CRYPTO_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
    
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

// AES解密函数（可能在其他地方有用）
export const aesDecrypt = (encryptedData) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, CRYPTO_KEY, {
      iv: CRYPTO_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};