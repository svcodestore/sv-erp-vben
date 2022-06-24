<template>
  <PageWrapper
    contentFullHeight
    :title="t('routes.bs.orderShipTracing.title')"
    :content="t('routes.bs.orderShipTracing.desc')"
  >
    <div class="py-4 bg-white flex flex-col justify-center items-center">
      <Form layout="inline" :model="formState" @finish="handleFinish">
        <FormItem :label="t('routes.bs.orderShipTracing.orderNo')">
          <Input
            allowClear
            v-model:value="formState.KhPONo"
            class="width130px"
            autofocus
            @change="state.isShowGrid = false"
          />
        </FormItem>
        <FormItem :label="t('routes.bs.orderShipTracing.cargoNo')">
          <Input
            allowClear
            v-model:value="formState.spNo"
            class="width130px"
            @change="state.isShowGrid = false"
          />
        </FormItem>
        <FormItem :label="t('routes.bs.orderShipTracing.customerNo')">
          <Input
            allowClear
            v-model:value="formState.khNo"
            class="width130px"
            @change="state.isShowGrid = false"
          />
        </FormItem>
        <FormItem :label="t('routes.bs.orderShipTracing.location')">
          <Select
            v-model:value="formState.company"
            class="width130px"
            @change="state.isShowGrid = false"
          >
            <SelectOption v-for="company in state.companies" :key="company.value">
              {{ company.label }}
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

    <sv-grid v-bind="gridOptions" v-if="state.isShowGrid">
      <template #dingDanShuLiang="{ row, column }">
        <span class="order-numeric order-numeric__bolder order-numeric__bolder-black">
          {{ toThousandthDigit(row[column.property]) }}
        </span>
      </template>
      <template #leiJiChuHuo="{ row, column }">
        <span class="order-numeric order-numeric__bolder order-numeric__tooltip">
          {{ toThousandthDigit(row[column.property]) }}
        </span>
      </template>
      <template #detail="{ rowIndex }">
        <ul class="order-detail" v-if="state.orderDetails[rowIndex]">
          <li v-for="(item, idx) in state.orderDetails[rowIndex]" :key="idx">
            {{ item.danCiChuHuoShiJian }} {{ t('routes.bs.orderShipTracing.ship') }}
            <i>{{ toThousandthDigit(item.danCiChuHuo) }}</i>
          </li>
        </ul>
        <Spin v-if="state.orderDetailsLoading" />
      </template>
    </sv-grid>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Form, FormItem, Input, Select, SelectOption, FormProps, Button } from 'ant-design-vue';
  import { reactive } from 'vue';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getOrderDetails, getOrders } from '/@/api/BS/OrderShipTracing';
  import { debounce, objArrUniq } from '/@/utils/helper';
  import { dateUtil } from '/@/utils/dateUtil';
  import { Spin } from 'ant-design-vue';
  import { toThousandthDigit } from '/@/utils/strUtils';

  const { t } = useI18n();

  const state = reactive({
    isShowGrid: false,
    orderDetailsLoading: false,
    orderDetails: [] as any[],
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
  const formState = reactive({
    KhPONo: '',
    spNo: '',
    khNo: '',
    company: '1',
  });

  const gridOptions = reactive<GridPropsType>({
    data: [],
    loading: false,
    showToolbar: false,
    class: 'order-ship-tracing-grid',
    rowClassName({ row }) {
      if (row.leiJiChuHuo < 1) {
        return 'not-shipped-row';
      }
      if (row.leiJiChuHuo < row.dingDanShuLiang) {
        return 'not-finish-shipped-row';
      }
    },
    columns: [
      {
        type: 'seq',
        width: 80,
      },
      {
        field: 'SCName',
        title: t('routes.bs.orderShipTracing.grid.column.titles.categories'),
        sortable: true,
        width: 100,
        align: 'center',
      },
      {
        field: 'dingDanShiJian',
        title: t('routes.bs.orderShipTracing.grid.column.titles.orderTime'),
        sortable: true,
        width: 140,
      },
      {
        field: 'jiHuaJiaoQi',
        title: t('routes.bs.orderShipTracing.grid.column.titles.planDate'),
        sortable: true,
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

  function fmtData(data) {
    const fmtData = objArrUniq(data).map((item) => {
      item.dingDanShiJian &&
        (item.dingDanShiJian = dateUtil(item.dingDanShiJian).format('YYYY-MM-DD'));
      item.jiHuaJiaoQi && (item.jiHuaJiaoQi = dateUtil(item.jiHuaJiaoQi).format('YYYY-MM-DD'));
      item.dingDanShuLiang && (item.dingDanShuLiang = Number(item.dingDanShuLiang).toFixed());
      item.leiJiChuHuo && (item.leiJiChuHuo = Number(item.leiJiChuHuo).toFixed());

      return item;
    });

    return fmtData;
  }

  const handleFinish: FormProps['onFinish'] = debounce(() => {
    state.loading = true;
    gridOptions.loading = true;

    getOrders(formState)
      .then((data) => {
        gridOptions.data = fmtData(data);
        if (data.length) {
          state.isShowGrid = true;
          Promise.all(
            (gridOptions.data || []).map(({ OrdBID, cunHuoBianHao, KhPONo, smSOBPlusmyField12 }) =>
              getOrderDetails({
                OrdBIDs: OrdBID.map((id: string) => "'" + id + "'").join(','),
                KhPONo,
                khNo: smSOBPlusmyField12,
                spNo: cunHuoBianHao,
                company: formState.company,
              }),
            ),
          ).then((res) => {
            state.orderDetails = res.map((details) =>
              [...new Set(details.map((e) => e.danCiChuHuoShiJian))].map((d: string) => {
                return {
                  danCiChuHuoShiJian: dateUtil(d).format('YYYY-MM-DD'),
                  danCiChuHuo: details
                    .filter((e) => e.danCiChuHuoShiJian === d)
                    .map((e) => Number(e.danCiChuHuo))
                    .reduce((curr, next) => curr + next, 0),
                  data,
                };
              }),
            );
            state.orderDetailsLoading = false;
          });
        } else {
          state.isShowGrid = false;
          useMessage().createMessage.info(t('common.noData'));
        }
      })
      .finally(() => {
        state.loading = false;
        gridOptions.loading = false;
      });
  });
</script>

<style scoped lang="less">
  .width120px {
    width: 130px;
  }

  .order-ship-tracing-grid {
    :deep(.not-shipped-row) {
      background-color: #00000018 !important;
    }

    :deep(.not-finish-shipped-row) {
      background-color: #0000000e !important;
    }

    .order-numeric__bolder {
      font-weight: bolder;
    }

    .order-numeric__bolder-black {
      color: black;
    }

    .order-numeric__tooltip {
      display: inline-block;
      width: 100%;
    }

    .order-detail {
      margin: 0;
      padding: 0;

      li {
        i {
          color: black;
        }
      }

      li:nth-of-type(n + 2) {
        border-top: 1px dashed #d0d3d6;
      }
    }
  }
</style>
