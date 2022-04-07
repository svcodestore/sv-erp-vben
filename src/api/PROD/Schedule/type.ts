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

export type Po = {
  workshop: string;
  workshopName: string;
  customerNo: string;
  customerPoNo: string;
  itemCode: string;
  itemQty: number;
};

export type SchedulePhaseItem = {
  name: string;
  codeId: string;
  costTime: number;
  aheadTime: number;
  deadTime: number;
  outTime: number;
  workerNum: number;
  isMaster: number;
  startAt: string;
  completeAt: string;
};

export type ScheduleItem = Po & {
  phases: SchedulePhaseItem[];
};
