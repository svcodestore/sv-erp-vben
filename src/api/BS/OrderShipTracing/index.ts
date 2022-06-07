import { defHttp } from '/@/utils/http/axios';

enum Api {
  getOrders = '/bs/orders',
}

export function getOrders(params) {
  return defHttp.get({ url: Api.getOrders, params });
}
