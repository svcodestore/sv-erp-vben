<template>
  <Header />
  <div style="font-size: 22px">
    行事历设定：
    <Calendar :date="date">
      <template #cellContent="cellDate">
        {{ cellDate?.date?.format('YYYY/MM/DD') }}
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
          {{ phase.completeAt.substring(5).substring(0, 11) }}
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

  defineProps({
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    date: {
      type: Object as PropType<DateUtil>,
      default: () => ({}),
    },
  });
</script>
