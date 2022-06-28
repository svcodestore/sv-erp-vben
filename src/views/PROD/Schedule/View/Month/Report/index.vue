<template>
  <Header
    commuterTime="07:30 - 11:30, 13:00 - 17:00, 17:30 - 20:30"
    :attendanceDays="attendanceDays"
    :attendanceHours="attendanceHours"
    :restDays="restDays"
    :reportTitle="reportTitle"
  />
  <div style="font-size: 22px">
    行事历设定：
    <Calendar :date="date">
      <template #cellContent="cellDate">
        <span style="color: red">
          {{
            calendarData.find((day) => day.date === cellDate?.date?.format('YYYY-MM-DD'))?.isRest
              ? '休'
              : ''
          }}
        </span>
        <span
          v-if="
            !calendarData.find((day) => day.date === cellDate?.date?.format('YYYY-MM-DD')) &&
            cellDate.date
          "
        >
          07:30 - 11:30
          <br />
          13:00 - 17:00
          <br />
          17:30 - 20:30
        </span>
      </template>
    </Calendar>
  </div>

  <Table :data="data" />
</template>

<script lang="ts" setup>
  import Header from './Header.vue';
  import Calendar from './Calendar.vue';
  import Table from './Table.vue';
  import { DateUtil } from '/@/utils/dateUtil';
  import type { CalendarType } from '/@/api/PROD/Schedule/type';
  import { computed } from 'vue';

  const props = defineProps({
    calendarData: {
      type: Array as PropType<CalendarType[]>,
      default: () => [],
    },
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    date: {
      type: Object as PropType<DateUtil>,
      default: () => ({}),
    },
    reportTitle: {
      type: String as PropType<string>,
      default: () => '',
    },
  });

  const attendanceDays = computed(
    () => props.date.daysInMonth() - props.calendarData.filter((day) => !!day.isRest).length,
  );
  const attendanceHours = computed(() => attendanceDays.value * 11);
  const restDays = computed(() =>
    props.calendarData
      .filter((day) => !!day.isRest)
      .map((day) => day.day)
      .join(', '),
  );
</script>
