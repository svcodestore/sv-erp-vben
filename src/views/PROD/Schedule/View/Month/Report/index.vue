<template>
  <Header />
  <div style="font-size: 22px"> 行事历设定： <Calendar :date="date" /></div>
  <table
    v-for="(tb, i) in tableData"
    :key="i"
    :style="`text-align: center; width: 100%;border-bottom: 1px solid transparent;`"
  >
    <tr>
      <td style="width: 30px">#{{ i + 1 }}</td>
      <td
        v-for="(v, idx) in tb.phases"
        :key="idx"
        v-html="v"
        :style="idx < 6 ? `width: 72px;` : idx < 10 ? 'width: 60px;' : ''"
      ></td>
    </tr>
  </table>
</template>

<script lang="ts" setup>
  import Header from './Header.vue';
  import Calendar from './Calendar.vue';
  import { computed, unref } from 'vue';
  import { DateUtil } from '/@/utils/dateUtil';

  const props = defineProps({
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    date: {
      type: Object as PropType<DateUtil>,
      default: () => ({}),
    },
  });

  const tableData = computed(() => {
    const arr = [] as any[];
    unref(props.data).forEach((item) => {
      const commonFields = ['客户代号', '客户订单号', '工厂品号', '订单数量', '生产单位'];
      const vals = [
        item.customerNo,
        item.customerPoNo,
        item.itemCode,
        item.itemQty,
        item.workshopName,
      ];
      const keys = commonFields.map((field) => `<span>${field}</span><br>`);
      const values = vals.map((value) => `<span>${value}</span><br>`);

      item.phases.forEach((e) => {
        const { name, isMaster, costTime, startAt, completeAt, outTime, workerNum } = e;
        keys.push(
          `<span>${name}</span>/<span style="font-weight: bolder; color: black;">${
            isMaster === 0 ? '副' : '主'
          }</span>${
            outTime > 0
              ? '/<i style="font-weight: bolder; color: rgba(250, 20, 40, 0.69);">外</i>'
              : ''
          }${costTime > 0 ? `<span>/</span><span>${costTime}</span>` : ''}/${workerNum}`,
        );

        values.push(
          `<br><span>${startAt.substring(0, 16)}</span>${
            costTime > 0 || outTime > 0 ? `<br/><span>${completeAt.substring(0, 16)}</span>` : ''
          }`,
        );
      });

      arr.push({
        phases: keys.map((k, i) => `<div>${k}\n${values[i]}</div>`),
      });
    });

    return arr;
  });
</script>
