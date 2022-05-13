import { User } from '/@/api/model/baseModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Logout = '/logout',
  CurrentUser = '/user/current-user',
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export function getCurrentUser() {
  return defHttp.get<User>({ url: Api.CurrentUser });
}
