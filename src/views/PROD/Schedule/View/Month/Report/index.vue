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
  <table style="text-align: center; width: 100%; border-collapse: collapse; margin-top: 5px">
    <template v-for="record in data" :key="record">
      <tr>
        <td style="border: 1px solid black">客户代号</td>
        <td style="border: 1px solid black">客户订单号</td>
        <td style="border: 1px solid black">工厂品号</td>
        <td style="border: 1px solid black">订单数量</td>
        <td rowspan="3" style="border: 1px solid black">副流程</td>
        <td
          v-for="phase in record.phases.filter((e) => !e.isMaster)"
          :key="phase"
          style="border: 1px solid black"
        >
          {{ phase.name }}
        </td>
      </tr>
      <tr>
        <td rowspan="5" style="border: 1px solid black">{{ record.itemCode }}</td>
        <td rowspan="5" style="border: 1px solid black">{{ record.customerNo }}</td>
        <td rowspan="5" style="border: 1px solid black">{{ record.customerPoNo }}</td>
        <td rowspan="5" style="border: 1px solid black">{{ record.itemQty }}</td>
        <td
          v-for="phase in record.phases.filter((e) => !e.isMaster)"
          :key="phase"
          style="border: 1px solid black"
        >
          {{ phase.startAt.substring(5).substring(0, 11) }}
        </td>
      </tr>
      <tr>
        <td
          v-for="phase in record.phases.filter((e) => !e.isMaster)"
          :key="phase"
          style="border: 1px solid black"
        >
          {{ phase.completeAt.substring(5).substring(0, 11) }}
        </td>
      </tr>
      <tr>
        <td rowspan="3" style="border: 1px solid black">主流程</td>
        <td
          v-for="phase in record.phases.filter((e) => !!e.isMaster)"
          :key="phase"
          style="border: 1px solid black"
        >
          {{ phase.name }}
        </td>
      </tr>
      <tr>
        <td
          v-for="phase in record.phases.filter((e) => !!e.isMaster)"
          :key="phase"
          style="border: 1px solid black"
        >
          {{ phase.startAt.substring(5).substring(0, 11) }}
        </td>
      </tr>
      <tr>
        <td
          v-for="phase in record.phases.filter((e) => !!e.isMaster)"
          :key="phase"
          style="border: 1px solid black"
        >
          {{ phase.completeAt.substring(5).substring(0, 11) }}
        </td>
      </tr>
    </template>
  </table>
</template>

<script lang="ts" setup>
  import Header from './Header.vue';
  import Calendar from './Calendar.vue';
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
