import { CalendarType } from './type';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Calendar = '/prod/calendar',
}

export function getCalendar(params: { year: number; month: number }) {
  return defHttp.get<CalendarType[]>({ url: Api.Calendar, params });
}

export function updateCalendar(params: { id: number; update: Record<string, any> }) {
  return defHttp.put<boolean>({
    url: Api.Calendar + `/${params.id}`,
    params: { update: params.update },
  });
}

export function addCalendar(params: { add: Record<string, any> }) {
  return defHttp.post<boolean>({
    url: Api.Calendar,
    params,
  });
}
