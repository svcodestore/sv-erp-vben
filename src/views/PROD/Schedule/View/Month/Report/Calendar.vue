<template>
  <table width="100%" style="border-collapse: collapse">
    <tr v-for="(_, idx) in Array(maxWeeksInMonth)" :key="idx">
      <td
        style="border: 1px solid black; padding: 0; margin: 0"
        v-for="(__, i) in Array(7)"
        :key="i"
      >
        <div style="display: flex; height: 120px" v-if="!isCurrentMonthDay(idx)">
          <span style="font-size: 14px"> {{ getWeekday(daysArr[0]) }} </span>
          <span style="margin: auto; font-size: 14px">
            <slot name="cellContent" :date="getDate(daysArr[0])"></slot>
          </span>
          <span style="font-size: 14px; margin-left: auto">
            {{ daysArr.shift() }}
          </span>
        </div>
      </td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
  import moment from 'moment';
  import { computed } from 'vue';
  import { DateUtil, dateUtil } from '/@/utils/dateUtil';
  import { range } from '/@/utils/helper';

  const props = defineProps({
    date: {
      type: Object as PropType<DateUtil>,
      default: () => ({}),
    },
  });

  const dateObj = computed(() => dateUtil(props.date));
  const daysArr = computed(() => range(1, dateObj.value.daysInMonth() + 1));
  const weekdayMap = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
  };
  const getDate = (day: number) =>
    moment(dateObj.value.format('YYYY/MM/' + +(day > 9 ? day : '0' + day)));
  const getWeekday = (day: number) => weekdayMap[getDate(day).days()];
  const firstWeekday = computed(() => getDate(daysArr.value[0]).days());
  const lastWeekday = computed(() => getDate(daysArr.value[daysArr.value.length - 1]).days());

  const headFill = computed(() => (firstWeekday.value === 0 ? 6 : firstWeekday.value - 1));
  const tailFill = computed(() => 6 - lastWeekday.value);
  const maxWeeksInMonth = 5;
  daysArr.value.unshift(...Array(headFill.value));
  daysArr.value.push(...Array(tailFill.value));

  const unavailableDaysLen = computed(() => daysArr.value.filter((d) => d === undefined).length);

  const isCurrentMonthDay = (idx: number) => {
    return (
      daysArr.value.every((d) => d === undefined) &&
      (unavailableDaysLen.value % 7 === 0 ||
        (unavailableDaysLen.value % 7 !== 0 && idx === maxWeeksInMonth - 1))
    );
  };
</script>
