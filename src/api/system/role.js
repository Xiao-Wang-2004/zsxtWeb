// 角色管理相关API
import { post } from '../utils';

// 获取用户列表
export function getUserList(data) {
  return post('/user/list', data);
}

// 更新用户信息（新增或编辑）
export function updateUser(data) {
  return post('/user/update', data);
}

// 删除用户信息
export function deleteUser(data) {
  return post('/user/delete', data);
}
