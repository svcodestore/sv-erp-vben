import { ScheduleItem, ScheduleRequest } from './type';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Schedule = '/schedule',
}

export function schedule(params: ScheduleRequest) {
  return defHttp.get<ScheduleItem[]>({ url: Api.Schedule, params });
}
