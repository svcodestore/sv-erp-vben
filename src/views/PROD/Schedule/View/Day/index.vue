<template>
  <PageWrapper contentFullHeight title="每日生产计划看板" content="将月排程按天进行显示">
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

    <div class="mt-4" v-if="state.data.length && state.isShowContent">
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
        上下班时间：<b>07:30 - 11:30, 13:00 - 17:00, 17:30 - 20:30</b> | 出勤时间： <b>11</b> |
        休息时间：
        <b>11:30 - 13:00, 17:00 - 17:30</b>
      </div>

      <Table :data="state.data" />
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
  import { UnwrapRef, reactive, computed } from 'vue';
  import { schedule } from '/@/api/PROD/Schedule';
  import { ScheduleItem, ScheduleParams } from '/@/api/PROD/Schedule/type';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { dateUtil } from '/@/utils/dateUtil';
  import Table from '../Month/Report/Table.vue';

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

  const reportTitle = computed(
    () =>
      `SV ${
        state.workLines.find((line) => line.value === formState.workLine)?.label
      } ${formState.date.format('YYYY年MM月DD日')} 生产入库计划表`,
  );

  const handleFinish: FormProps['onFinish'] = () => {
    state.loading = true;

    const workLine = formState.workLine;
    const year = formState.date.year();
    const month = formState.date.month() + 1;

    schedule({
      workLine,
      year,
      month,
    })
      .then((res) => {
        const data = res.filter((item) =>
          item.phases.some(
            (p) =>
              dateUtil(dateUtil(p.startAt).format('YYYY-MM-DD')).valueOf() <=
                formState.date.valueOf() &&
              dateUtil(dateUtil(p.completeAt).format('YYYY-MM-DD')).valueOf() >=
                formState.date.valueOf(),
          ),
        );
        data.forEach((item) => {
          item.phases = item.phases.filter(
            (p) =>
              dateUtil(dateUtil(p.startAt).format('YYYY-MM-DD')).valueOf() <=
                formState.date.valueOf() &&
              dateUtil(dateUtil(p.completeAt).format('YYYY-MM-DD')).valueOf() >=
                formState.date.valueOf(),
          );

          item.phases = item.phases.map((p) => {
            const cost = +p.costTime;
            if (cost === 0) {
              p.completeAt = '';
            } else {
              let date = dateUtil(p.startAt).format('YYYY-MM-DD');
              let startAt = p.startAt;
              if (formState.date.valueOf() > dateUtil(p.startAt).valueOf()) {
                date = formState.date.format('YYYY-MM-DD');
                startAt = dateUtil(`${date} 07:30:00`).format('YYYY-MM-DD');
              }
              const minutes =
                (dateUtil(`${date} 20:30:00`).valueOf() - dateUtil(startAt).valueOf()) / 1000;
              p.qty = Math.floor(minutes / cost);
            }

            return p;
          });

          item.itemQty = Math.min(...item.phases.map((p) => p.qty || 0));
        });

        state.data = data;
        if (data.length) {
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
