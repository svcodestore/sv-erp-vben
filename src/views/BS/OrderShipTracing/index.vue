<template>
  <PageWrapper
    contentFullHeight
    title="订单出库追踪"
    content=" 检索条件订单的出库情况，订单数据来源于ERP"
  >
    <div class="py-4 bg-white flex flex-col justify-center items-center">
      <Form layout="inline" :model="formState" @finish="handleFinish">
        <FormItem label="客户单号">
          <Input v-model:value="formState.KhPONo" style="width: 120px" />
        </FormItem>
        <FormItem label="存货编号">
          <Input v-model:value="formState.spNo" style="width: 120px" />
        </FormItem>
        <FormItem label="客商编号">
          <Input v-model:value="formState.khNo" style="width: 120px" />
        </FormItem>
        <FormItem label="地点公司">
          <Select v-model:value="formState.company" style="width: 120px">
            <SelectOption v-for="line in state.companies" :key="line.value">
              {{ line.label }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" :loading="state.loading">
            {{ t('common.queryText') }}
          </Button>
        </FormItem>
      </Form>
    </div>

    <div class="bg-white mt-4"> </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Form, FormItem, Input, Select, SelectOption, FormProps, Button } from 'ant-design-vue';
  import { reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

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

  const formState = reactive({
    KhPONo: '',
    spNo: '',
    khNo: '',
    company: '1',
  });
  const handleFinish: FormProps['onFinish'] = () => {
    state.loading = true;
    // schedule({
    //   workLine: formState.workLine,
    //   year: formState.date.year(),
    //   month: formState.date.month() + 1,
    // })
    //   .then((res) => {
    //     state.data = res;
    //     if (res.length) {
    //     } else {
    //       useMessage().createMessage.info(t('common.noData'));
    //     }
    //   })
    //   .finally(() => {
    //     });
    state.loading = false;
  };
</script>
