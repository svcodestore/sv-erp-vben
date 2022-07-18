import { ParamType } from './type';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Param = '/prod/settings/parameter',
  Params = '/prod/settings/parameters',
}

export function getParamByKey(key: string) {
  return defHttp.get<ParamType>({ url: Api.Param, params: { key } });
}

export function getParams() {
  return defHttp.get<ParamType[]>({ url: Api.Params });
}

export function setParam(params: { key: string; update: { value: string; remark?: string } }) {
  return defHttp.put<boolean>({ url: Api.Param, params });
}
