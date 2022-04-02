import type { DateUtil } from '/@/utils/dateUtil';

export interface ScheduleParams {
  date: DateUtil;
  workLine: string;
}

export type ScheduleRequest = {
  year: number;
  month: number;
  workLine: string;
};
