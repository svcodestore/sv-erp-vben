import { debounce as dbce } from 'lodash-es';

export const range = (s: number, e: number) => new Array(e - s).fill(s).map((_, i) => s + i);

export const debounce = (fn: Fn, time?: number) => {
  return dbce(fn, time || 330);
};

export function objArrUniq(arr: Record<string, any>[], pk?: any) {
  const o = {};
  const newArr = arr.reduce((item, next) => {
    let _pk = Object.keys(next).join(',,') + '-' + Object.values(next).join(',,');
    if (typeof pk === 'string') {
      _pk = pk + '-' + next[pk];
    } else if (Array.isArray(pk)) {
      _pk =
        pk.join(',,') +
        '-' +
        pk.reduce((prev, curr) => {
          return prev + next[curr] + ',,';
        }, '');
    }

    if (!o[_pk]) {
      o[_pk] = true;
      item.push(next);
    }

    return item;
  }, []);

  return newArr;
}
