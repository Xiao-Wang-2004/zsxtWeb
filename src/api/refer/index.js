// 查询管理相关API接口
import { post } from '@/api/utils';

/**
 * 订单查询列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getOrderList(params) {
  return post('/refer/order/list', params);
}

/**
 * 入库查询列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getInList(params) {
  return post('/refer/in/list', params);
}

/**
 * 出库查询列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getOutList(params) {
  return post('/refer/out/list', params);
}