import { ItemRequestType, ItemType } from './type';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Items = '/hr/items',
}

export function getAllItem(params: ItemRequestType) {
  return defHttp.get<ItemType[]>({ url: Api.Items, params });
}
