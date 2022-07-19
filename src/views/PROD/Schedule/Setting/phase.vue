<template>
  <PageWrapper
    contentFullHeight
    title="标准工时设置"
    content=" 排程计划中生产款工站的属性设置，不同的属性设置将影响排程计划时间。"
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
          <MonthPicker
            v-model:value="formState.date"
            picker="date"
            :allowClear="false"
            @change="state.isShowContent = false"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" :loading="state.loading">
            {{ t('common.queryText') }}
          </Button>
        </FormItem>
      </Form>
    </div>

    <sv-grid v-bind="gridOptions" v-show="gridOptions.data?.length">
      <template #isMaster="{ row, column }">
        <span>
          {{ row[column.property] == 1 ? '主流程' : '副流程' }}
        </span>
      </template>
    </sv-grid>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { getPhaseByCode, getPo } from '/@/api/PROD/Schedule';
  import {
    Form,
    FormItem,
    Select,
    SelectOption,
    MonthPicker,
    FormProps,
    Button,
  } from 'ant-design-vue';
  import { UnwrapRef, reactive } from 'vue';
  import { ScheduleItem, ScheduleParams } from '/@/api/PROD/Schedule/type';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();

  const state = reactive({
    isShowContent: false,
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

  const formState: UnwrapRef<ScheduleParams> = reactive({
    date: dateUtil(),
    workLine: 'N',
  });

  const gridOptions = reactive<GridPropsType>({
    loading: false,
    data: [],
    columns: [
      { type: 'seq', width: 50 },
      { title: '款号', field: 'code' },
      { title: '工站号', field: 'codeId' },
      { title: '工站', field: 'name' },
      {
        align: 'right',
        field: 'costTime',
        title: '耗时',
        sortable: true,
        editRender: { name: 'input' },
      },
      {
        align: 'right',
        field: 'deadTime',
        title: '停滞时间',
        sortable: true,
        editRender: { name: 'input' },
      },
      {
        field: 'outTime',
        title: '外发时间',
        align: 'right',
        sortable: true,
        editRender: { name: 'input' },
      },
      {
        align: 'right',
        field: 'aheadTime',
        title: '段取时间',
        sortable: true,
        editRender: { name: 'input' },
      },
      {
        field: 'isMaster',
        title: '流程',
        slots: { default: 'isMaster' },
        editRender: {
          name: '$select',
          options: [
            {
              value: 1,
              label: '主流程',
            },
            {
              value: 0,
              label: '副流程',
            },
          ],
        },
      },
      {
        align: 'right',
        field: 'workerNum',
        title: '人数',
        sortable: true,
        editRender: { name: 'input' },
      },
    ],
  });

  const handleFinish: FormProps['onFinish'] = async () => {
    state.loading = true;
    gridOptions.loading = true;

    const workLine = formState.workLine;
    const year = formState.date.year();
    const month = formState.date.month() + 1;

    const po = await getPo({
      workLine,
      year,
      month,
    });
    const code = po.map((e) => e.itemCode).join(',');
    gridOptions.data = await getPhaseByCode({ code });
    if (gridOptions.data.length === 0) {
      useMessage().createMessage.info('暂无数据');
    }

    gridOptions.loading = false;
    state.loading = false;
  };
</script>
