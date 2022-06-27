<template>
  <table width="100%" style="border-collapse: collapse">
    <tr v-for="(_, idx) in Array(daysArr.length / 7)" :key="idx">
      <td
        style="border: 1px solid black; padding: 0; margin: 0; width: 500px"
        v-for="(__, i) in Array(7)"
        :key="i"
      >
        <div style="display: flex; height: 120px">
          <span style="font-size: 14px"> {{ getWeekday(daysArr[0]) }} </span>
          <span style="margin: auto; font-size: 14px">
            <slot name="cellContent" :date="daysArr[0] && getDate(daysArr[0])"></slot>
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
  import { DateUtil, dateUtil, weekdayMap } from '/@/utils/dateUtil';
  import { range } from '/@/utils/helper';

  const props = defineProps({
    date: {
      type: Object as PropType<DateUtil>,
      default: () => ({}),
    },
  });

  const dateObj = computed(() => dateUtil(props.date));
  const daysInMonth = computed(() => dateObj.value.daysInMonth());

  const getDate = (day: number) =>
    moment(dateObj.value.format('YYYY/MM/') + (day > 9 ? day : '0' + day));
  const getWeekday = (day?: number) => day && weekdayMap[getDate(day).days()];
  const firstWeekday = computed(() => getDate(1).days());
  const lastWeekday = computed(() => getDate(daysInMonth.value).days());

  const headFill = computed(() => (firstWeekday.value === 0 ? 6 : firstWeekday.value - 1));
  const tailFill = computed(() => 7 - lastWeekday.value);
  const starAt = computed(() => 7 - headFill.value);
  const endAt = computed(() => daysInMonth.value - lastWeekday.value);
  const headWeekArr = computed(() => [...Array(headFill.value), ...range(1, starAt.value + 1)]);
  const tailWeekArr = computed(() => [
    ...range(endAt.value + 1, daysInMonth.value + 1),
    ...Array(tailFill.value),
  ]);

  const daysArr = computed(() => [
    ...headWeekArr.value,
    ...range(starAt.value + 1, endAt.value + 1),
    ...tailWeekArr.value,
  ]);
</script>
