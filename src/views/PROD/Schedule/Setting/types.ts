import { DateUtil } from '/@/utils/dateUtil';

export type ShiftTimeType = { name: string; start: string | DateUtil; end: string | DateUtil };

export type ShiftType = { name: string; times: ShiftTimeType[] };
