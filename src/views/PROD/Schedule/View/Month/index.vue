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

    <div id="report" class="bg-white mt-4">
      <Report :data="state.data" :date="formState.date" />
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
  import { reactive, UnwrapRef } from 'vue';
  import { ScheduleItem, ScheduleParams } from '/@/api/PROD/Schedule/type';
  import { schedule } from '/@/api/PROD/Schedule';
  import { PageWrapper } from '/@/components/Page';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import printjs from 'print-js';
  import Report from './Report/index.vue';

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
      });
  };
</script>
