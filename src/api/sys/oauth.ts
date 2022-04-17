import { defHttp } from '/@/utils/http/axios';

enum Api {
  authorize = '/authorize',
}

export function getAccessToken(grantCode: string) {
  return defHttp.post({ url: Api.authorize, data: { grantCode } });
}
