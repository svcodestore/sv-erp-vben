<template>
  <PageWrapper
    contentFullHeight
    :title="t('routes.bs.orderShipTracing.title')"
    :content="t('routes.bs.orderShipTracing.desc')"
  >
    <div class="py-4 bg-white flex flex-col justify-center items-center">
      <Form layout="inline" :model="formState" @finish="handleFinish">
        <FormItem :label="t('routes.bs.orderShipTracing.orderNo')">
          <Input v-model:value="formState.KhPONo" class="width130px" />
        </FormItem>
        <FormItem :label="t('routes.bs.orderShipTracing.cargoNo')">
          <Input v-model:value="formState.spNo" class="width130px" />
        </FormItem>
        <FormItem :label="t('routes.bs.orderShipTracing.customerNo')">
          <Input v-model:value="formState.khNo" class="width130px" />
        </FormItem>
        <FormItem :label="t('routes.bs.orderShipTracing.location')">
          <Select v-model:value="formState.company" class="width130px">
            <SelectOption v-for="line in state.companies" :key="line.value">
              {{ line.label }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            :loading="state.loading"
            :disabled="!formState.KhPONo && !formState.spNo && !formState.khNo"
          >
            {{ t('common.queryText') }}
          </Button>
        </FormItem>
      </Form>
    </div>

    <div class="bg-white mt-4">
      <sv-grid v-bind="gridOptions" />
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Form, FormItem, Input, Select, SelectOption, FormProps, Button } from 'ant-design-vue';
  import { reactive } from 'vue';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getOrders } from '/@/api/BS/OrderShipTracing';

  const { t } = useI18n();

  const state = reactive({
    headerData: {},
    data: [],
    loading: false,
    companies: [
      {
        label: t('routes.bs.orderShipTracing.company.svdg'),
        value: '1',
      },
      {
        label: t('routes.bs.orderShipTracing.company.jstw'),
        value: '2',
      },
    ],
  });

  const columnDateFilter = ({ value, row, column }) => {
    if (value) {
      return row[column.property].indexOf(value) > -1;
    } else {
      return row[column.property] == value;
    }
  };

  const gridOptions = reactive<GridPropsType>({
    data: [],
    showToolbar: false,
    columns: [
      {
        field: 'SC_Name',
        title: t('routes.bs.orderShipTracing.grid.column.titles.categories'),
        width: 100,
        align: 'center',
      },
      {
        field: 'dingDanShiJian',
        title: t('routes.bs.orderShipTracing.grid.column.titles.orderTime'),
        sortable: true,
        filters: [],
        filterMethod: columnDateFilter,
        width: 140,
      },
      {
        field: 'jiHuaJiaoQi',
        title: t('routes.bs.orderShipTracing.grid.column.titles.planDate'),
        sortable: true,
        filters: [],
        filterMethod: columnDateFilter,
        width: 140,
      },
      {
        field: 'KhPONo',
        title: t('routes.bs.orderShipTracing.grid.column.titles.orderNo'),
        width: 120,
      },
      {
        field: 'smSOBPlusmyField12',
        title: t('routes.bs.orderShipTracing.grid.column.titles.customerNo'),
        width: 120,
      },
      {
        field: 'cunHuoBianHao',
        title: t('routes.bs.orderShipTracing.grid.column.titles.cargoNo'),
        width: 100,
      },
      {
        field: 'dingDanShuLiang',
        title: t('routes.bs.orderShipTracing.grid.column.titles.orderQty'),
        slots: {
          default: 'dingDanShuLiang',
        },
        sortable: true,
        align: 'right',
      },
      {
        field: 'leiJiChuHuo',
        title: t('routes.bs.orderShipTracing.grid.column.titles.totalShipQty'),
        slots: {
          default: 'leiJiChuHuo',
        },
        sortable: true,
        align: 'right',
        filters: [
          { label: t('routes.bs.orderShipTracing.grid.column.filters.noShip'), value: -1 },
          { label: t('routes.bs.orderShipTracing.grid.column.filters.finishedShip'), value: 1 },
          { label: t('routes.bs.orderShipTracing.grid.column.filters.notFinishedShip'), value: 0 },
        ],
        filterMethod: ({ value, row }) => {
          if (value === -1) {
            return Number(row.leiJiChuHuo) === 0;
          } else if (value === 1) {
            return row.leiJiChuHuo === row.dingDanShuLiang;
          } else if (value === 0) {
            return row.leiJiChuHuo < row.dingDanShuLiang && row.leiJiChuHuo > 0;
          }
          return false;
        },
      },
      {
        title: t('routes.bs.orderShipTracing.grid.column.titles.shipDetails'),
        slots: {
          default: 'detail',
        },
        width: 170,
        align: 'left',
      },
    ],
  });

  const formState = reactive({
    KhPONo: '',
    spNo: '',
    khNo: '',
    company: '1',
  });
  const handleFinish: FormProps['onFinish'] = () => {
    state.loading = true;
    getOrders({})
      .then((res) => {
        if (res.length) {
        } else {
        }
      })
      .finally(() => {
        useMessage().createMessage.info(t('common.noData'));
        state.loading = false;
      });
  };
</script>

<style scoped>
  .width120px {
    width: 130px;
  }
</style>
