// 料号信息相关API
import { get, post } from '../utils';

// 获取料号列表
export function getNumberInfoList(data) {
  return post('/information/number/list', data);
}

// 更新料号信息（新增或编辑）
export function updateNumberInfo(data) {
  return post('/information/number/update', data);
}

// 删除料号信息
export function deleteNumberInfo(data) {
  return post('/information/number/delete', data);
}