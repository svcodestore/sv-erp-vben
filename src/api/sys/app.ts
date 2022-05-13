import { Application } from './model/appModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  currentApplication = '/application/current-application',
}

export function getCurrentAppliction() {
  return defHttp.get<Application>({ url: Api.currentApplication });
}
