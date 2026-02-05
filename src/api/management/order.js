// 工单管理相关API
import { post } from '../utils';

// 获取工单ID
export function getOrder(data) {
  return post('/order_management/create/getOrder', data);
}

// 获取产品相关的模具和原料信息
export function getRelatedInfo(data) {
  return post('/order_management/create/related', data);
}

// 新增工单
export function addOrder(data) {
  return post('/order_management/create/add', data);
}

