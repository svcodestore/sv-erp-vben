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
  import { ScheduleParams } from '/@/api/PROD/Schedule/type';
  import { schedule } from '/@/api/PROD/Schedule';
  import { PageWrapper } from '/@/components/Page';
  import { dateUtil } from '/@/utils/dateUtil';

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
      console.log(res);
    });
  };
</script>
