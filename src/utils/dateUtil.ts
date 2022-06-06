/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs, { Dayjs } from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export type DateUtil = Dayjs;
export const dateUtil = dayjs;

export const weekdayMap = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
};

export function formatToDateTime(
  date: DateUtil | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dateUtil(date).format(format);
}

export function formatToDate(date: DateUtil | undefined = undefined, format = DATE_FORMAT): string {
  return dateUtil(date).format(format);
}
