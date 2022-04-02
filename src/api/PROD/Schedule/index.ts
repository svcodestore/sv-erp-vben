import { ScheduleRequest } from './type';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Schedule = '/schedule',
}

export function schedule(params: ScheduleRequest) {
  return defHttp.get({ url: Api.Schedule, params });
}
