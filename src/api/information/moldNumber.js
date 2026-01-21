// 模具料号相关API
import { get, post } from '../utils';

// 获取模具料号列表
export function getMoldNumberList(data) {
  return post('/information/mold_number/list', data);
}

// 更新模具料号（新增或编辑）
export function updateMoldNumber(data) {
  return post('/information/mold_number/update', data);
}

// 删除模具料号
export function deleteMoldNumber(data) {
  return post('/information/mold_number/delete', data);
}