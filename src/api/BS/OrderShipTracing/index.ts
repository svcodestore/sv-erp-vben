import { defHttp } from '/@/utils/http/axios';

enum Api {
  getOrders = '/bs/orders',
  getOrderDetails = '/bs/order-details',
}

export function getOrders(params) {
  return defHttp.get({ url: Api.getOrders, params });
}

export function getOrderDetails(params) {
  return defHttp.get({ url: Api.getOrderDetails, params });
}
