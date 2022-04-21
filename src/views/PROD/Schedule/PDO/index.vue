<template>
  <PageWrapper
    contentFullHeight
    title="生产订单（钢板计划）"
    content=" 生产线的生产任务，按月划分显示。"
  >
    <div class="py-4 bg-white flex flex-col justify-center items-center mb-1">
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
      </Form>
    </div>

    <sv-grid v-bind="gridOptions" v-show="gridOptions.data?.length">
      <template #operation>
        <Space>
          <a-button type="primary" ghost> 拆分 </a-button>
          <a-button danger ghost> 删除 </a-button>
        </Space>
      </template>
    </sv-grid>
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
    Space,
  } from 'ant-design-vue';
  import { reactive, UnwrapRef } from 'vue';
  import { ScheduleParams } from '/@/api/PROD/Schedule/type';
  import { PageWrapper } from '/@/components/Page';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { getProdOrders } from '/@/api/PROD/PDO';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    data: [],
    columns: [
      { type: 'seq', width: 50 },
      {
        field: 'ppi_po_year',
        title: '生产单年份',
      },
      {
        field: 'ppi_po_month',
        title: '生产单月份',
      },
      {
        field: 'ppi_customer_no',
        title: '客户代号',
        treeNode: true,
      },
      {
        field: 'ppi_customer_pono',
        title: '客户订单号',
      },
      {
        field: 'ppi_prd_item',
        title: '工厂品号',
      },
      {
        field: 'ppi_expected_qty',
        title: '计划数量',
        align: 'right',
        sortable: true,
      },
      {
        title: '操作',
        slots: {
          default: 'operation',
        },
      },
    ],
  });

  const state = reactive({
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

  const formState: UnwrapRef<ScheduleParams> = reactive({
    date: dateUtil(),
    workLine: 'N',
  });
  const handleFinish: FormProps['onFinish'] = () => {
    state.loading = true;
    getProdOrders().then((res: any) => {
      gridOptions.data = res.data;
      if (!res.data.length) {
        useMessage().createMessage.info(t('common.noData'));
      }
      state.loading = false;
    });
  };
</script>
