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