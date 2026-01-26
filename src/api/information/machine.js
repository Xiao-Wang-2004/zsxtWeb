// 机台设备信息相关API
import { get, post } from '../utils';

// 获取机台设备列表
export function getMachineInfoList(data) {
  return post('/information/machine/list', data);
}

// 更新机台设备信息（新增或编辑）
export function updateMachineInfo(data) {
  return post('/information/machine/update', data);
}

// 删除机台设备信息
export function deleteMachineInfo(data) {
  return post('/information/machine/delete', data);
}