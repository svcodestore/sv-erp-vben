import { defHttp } from '/@/utils/http/axios';
import { BasicFetchResult } from '/@/api/model/baseModel';

enum Api {
  Test = '/',
}

export function test() {
  return defHttp.get<
    BasicFetchResult<{
      id: number;
      name: string;
      role: string;
      sex: string;
      age: string;
      address: string;
    }>
  >({ url: Api.Test });
}
