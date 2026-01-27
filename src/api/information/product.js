// 产品信息相关API
import { post } from '../utils';

// 获取产品列表
export function getProductInfoList(data) {
  return post('/information/product/list', data);
}

// 更新产品信息（新增或编辑）
export function updateProductInfo(data) {
  return post('/information/product/update', data);
}

// 删除产品信息
export function deleteProductInfo(data) {
  return post('/information/product/delete', data);
}