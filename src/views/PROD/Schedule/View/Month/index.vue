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
            <SelectOption value="N">制八线皮带</SelectOption>
            <SelectOption value="V">制九线皮夹</SelectOption>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model:value="formState.date" picker="month" :allowClear="false" />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">查询</Button>
        </FormItem>
      </Form>
    </div>

    <div class="bg-white flex mt-4" v-if="state.data.length">
      <!-- <span style="letter-spacing: 6px">
        <b>斯达文星皮具有限公司</b>
      </span>
      <div
        style="
          text-align: center;
          font-weight: bolder;
          font-size: 30px;
          letter-spacing: 3px;
          color: black;
          margin-bottom: 5px;
          letter-spacing: 16px;
        "
      >
        <span>{{ title }}</span>
      </div>
      <div style="font-size: 22px">
        上下班时间：<b>{{ headerData.commuterTime }}</b> | 出勤天数：<b>{{
          headerData.attendanceDays
        }}</b>
        | 出勤时间：<b>{{ headerData.attendanceHours }}</b> | 休息日：{{ headerData.restDay }}
      </div>
      <div style="font-size: 22px">
        行事历设定：
        <div v-html="headerData.calendar" style="margin-bottom: 48px"></div>
      </div> -->
      1
      <table
        v-for="(tb, i) in state.data"
        :key="i"
        :style="`text-align: center; width: 100%;border-bottom: 1px solid transparent;`"
      >
        <tr>
          <td style="width: 30px">#{{ i + 1 }}</td>
          <td
            v-for="(v, idx) in tb.phases"
            :key="idx"
            v-html="v"
            :class="idx < 6 ? 'common-field-td' : ''"
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
  import { reactive, UnwrapRef } from 'vue';
  import { ScheduleItem, ScheduleParams } from '/@/api/PROD/Schedule/type';
  import { schedule } from '/@/api/PROD/Schedule';
  import { PageWrapper } from '/@/components/Page';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const state = reactive({
    data: [] as ScheduleItem[],
  });

  const formState: UnwrapRef<ScheduleParams> = reactive({
    date: dateUtil(),
    workLine: 'N',
  });
  const handleFinish: FormProps['onFinish'] = () => {
    schedule({
      workLine: formState.workLine,
      year: formState.date.year(),
      month: formState.date.month() + 1,
    }).then((res) => {
      state.data = res;
      if (res.length) {
        console.log(state.data);
      } else {
        useMessage().createMessage.info(t('common.noData'));
      }
    });
  };
</script>
