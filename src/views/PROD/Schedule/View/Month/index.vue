<template>
  <PageWrapper
    contentFullHeight
    title="月排程生产计划看板"
    content=" 此看板依据月钢板计划进行当月生产排程计算，形成月排程生产计划。"
  >
    <div class="py-4 bg-white flex flex-col justify-center items-center">
      <Form layout="inline" :model="formState" @finish="handleFinish">
        <FormItem>
          <Select v-model:value="formState.workLine" style="width: 120px">
            <SelectOption v-for="line in state.workLines" :key="line.value">
              {{ line.label }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model:value="formState.date" picker="month" :allowClear="false" />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" :loading="state.loading">查询</Button>
        </FormItem>
        <FormItem v-if="state.data.length">
          <Button type="primary" ghost @click="handlePrint">打印</Button>
        </FormItem>
      </Form>
    </div>

    <div id="report" class="bg-white mt-4" v-if="state.data.length">
      <span style="letter-spacing: 6px">
        <b>斯达文星皮具有限公司</b>
      </span>
      <div
        style="
          text-align: center;
          color: black;
          font-weight: bold;
          font-size: 30px;
          letter-spacing: 16px;
        "
      >
        <span>{{ reportTitle }}</span>
      </div>
      <div style="font-size: 22px">
        上下班时间：<b>{{ state.headerData.commuterTime }}</b> | 出勤天数：<b>{{
          state.headerData.attendanceDays
        }}</b>
        | 出勤时间：<b>{{ state.headerData.attendanceHours }}</b> | 休息日：{{
          state.headerData.restDay
        }}
      </div>
      <div style="font-size: 22px">
        行事历设定：
        <div v-html="state.headerData.calendar" style="margin-bottom: 48px"></div>
      </div>
      <table
        v-for="(tb, i) in reportTableData"
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
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import {
    Form,
    FormItem,
    Select,
    SelectOption,
    DatePicker,
    FormProps,
    Button,
  } from 'ant-design-vue';
  import { reactive, UnwrapRef, computed } from 'vue';
  import { ScheduleItem, ScheduleParams } from '/@/api/PROD/Schedule/type';
  import { schedule } from '/@/api/PROD/Schedule';
  import { PageWrapper } from '/@/components/Page';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import printjs from 'print-js';

  const { t } = useI18n();

  const state = reactive({
    headerData: {},
    data: [] as ScheduleItem[],
    loading: false,
    workLines: [
      {
        label: '制八线皮带',
        value: 'N',
      },
      {
        label: '制九线皮夹',
        value: 'V',
      },
    ],
  });

  const handlePrint = () => {
    printjs({
      type: 'raw-html',
      printable: document.querySelector('#report')?.innerHTML,
    });
  };

  const reportTitle = computed(() => {
    return `SV ${
      state.workLines.find((e) => e.value === formState.workLine)?.label
    } ${formState.date.format('YYYY年MM月')} 生产入库计划表`;
  });

  const reportTableData = computed(() => {
    const arr = [] as any[];
    state.data.forEach((item) => {
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

  const formState: UnwrapRef<ScheduleParams> = reactive({
    date: dateUtil(),
    workLine: 'N',
  });
  const handleFinish: FormProps['onFinish'] = () => {
    state.loading = true;
    schedule({
      workLine: formState.workLine,
      year: formState.date.year(),
      month: formState.date.month() + 1,
    }).then((res) => {
      state.data = res;
      state.loading = false;
      if (res.length) {
      } else {
        useMessage().createMessage.info(t('common.noData'));
      }
    });
  };
</script>
