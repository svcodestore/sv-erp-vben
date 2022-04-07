import { Po, ScheduleItem, SchedulePhaseItem, ScheduleRequest } from './type';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Schedule = '/prod/schedule',
  Phases = '/prod/phases',
  Po = '/prod/po',
}

export function schedule(params: ScheduleRequest) {
  return defHttp.get<ScheduleItem[]>({ url: Api.Schedule, params });
}

export function getPhaseByCode(params?: { code: string }) {
  return defHttp.get<SchedulePhaseItem[]>({ url: Api.Phases, params });
}

export function getPo(params: ScheduleRequest) {
  return defHttp.get<Po[]>({ url: Api.Schedule, params });
}
