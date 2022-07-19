<template>
  <PageWrapper
    contentFullHeight
    title="月排程生产计划看板"
    content=" 此看板依据月钢板计划进行当月生产排程计算，形成月排程生产计划。"
  >
    <div class="py-4 bg-white flex flex-col justify-center items-center">
      <Form layout="inline" :model="formState" @finish="handleFinish">
        <FormItem>
          <Select
            v-model:value="formState.workLine"
            style="width: 120px"
            @change="state.isShowContent = false"
          >
            <SelectOption v-for="line in state.workLines" :key="line.value">
              {{ line.label }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker
            v-model:value="formState.date"
            picker="month"
            :allowClear="false"
            @change="state.isShowContent = false"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" :loading="state.loading">
            {{ t('common.queryText') }}
          </Button>
        </FormItem>
        <FormItem v-if="state.data.length">
          <Button type="primary" ghost @click="handlePrint">{{ t('common.printText') }}</Button>
        </FormItem>
      </Form>
    </div>

    <div id="report" class="bg-white mt-4" v-if="state.data.length && state.isShowContent">
      <Report
        :calendarData="state.calendar"
        :data="state.data"
        :date="formState.date"
        :reportTitle="reportTitle"
      />
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
  import { computed, reactive, UnwrapRef } from 'vue';
  import { ScheduleItem, ScheduleParams } from '/@/api/PROD/Schedule/type';
  import { schedule } from '/@/api/PROD/Schedule';
  import { PageWrapper } from '/@/components/Page';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import printjs from 'print-js';
  import Report from './Report/index.vue';
  import { CalendarType } from '/@/api/PROD/Calendar/type';
  import { getCalendar } from '/@/api/PROD/Calendar';

  const { t } = useI18n();

  const state = reactive({
    isShowContent: false,
    headerData: {},
    calendar: [] as CalendarType[],
    data: [] as ScheduleItem[],
    loading: false,
    workLines: [
      {
        label: t('routes.prod.schedule.view.month.prodLine8'),
        value: 'N',
      },
      {
        label: t('routes.prod.schedule.view.month.prodLine9'),
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

  const formState: UnwrapRef<ScheduleParams> = reactive({
    date: dateUtil(),
    workLine: 'N',
  });
  const reportTitle = computed(
    () =>
      `SV ${
        state.workLines.find((line) => line.value === formState.workLine)?.label
      } ${formState.date.format('YYYY年MM月')} 生产入库计划表`,
  );
  const handleFinish: FormProps['onFinish'] = () => {
    state.loading = true;

    const workLine = formState.workLine;
    const year = formState.date.year();
    const month = formState.date.month() + 1;

    getCalendar({ year, month })
      .then((res) => {
        state.calendar = res;
      })
      .catch(() => {});

    schedule({
      workLine,
      year,
      month,
    })
      .then((res) => {
        state.data = res;
        if (res.length) {
        } else {
          useMessage().createMessage.info(t('common.noData'));
        }
      })
      .finally(() => {
        state.loading = false;
        state.isShowContent = true;
      });
  };
</script>
