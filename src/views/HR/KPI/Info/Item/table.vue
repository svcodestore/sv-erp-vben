<template>
  <PageWrapper contentFullHeight title="绩效项目表">
    <div class="py-4 bg-white flex flex-col justify-center items-center mb-1">
      <Form layout="inline" :model="formState" @finish="handleFinish">
        <FormItem>
          <Select v-model:value="formState.version" style="width: 120px">
            <SelectOption v-for="line in state.versions" :key="line.value">
              {{ line.label }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model:value="formState.code" style="width: 120px">
            <SelectOption v-for="line in state.codes" :key="line.value">
              {{ line.label }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" :loading="state.loading">查询</Button>
        </FormItem>
      </Form>
    </div>

    <sv-grid v-bind="gridOptions">
      <!-- v-show="gridOptions.data?.length" -->
    </sv-grid>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Form, FormItem, Select, SelectOption, FormProps, Button } from 'ant-design-vue';
  import { reactive, UnwrapRef } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { ItemRequestType } from '/@/api/HR/KPI/type';
  import { getAllItem } from '/@/api/HR/KPI';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    data: [],
    columns: [
      { type: 'seq', width: 50 },
      {
        field: 'code',
        title: '项目号',
      },
      {
        field: 'name',
        title: '名称',
      },
      {
        field: 'createdBy',
        title: '创建人',
      },
      {
        field: 'createdAt',
        title: '创建时间',
      },
      {
        field: 'updatedBy',
        title: '修改人',
      },
      {
        field: 'updatedAt',
        title: '修改时间',
      },
    ],
  });

  const state = reactive({
    loading: false,
    versions: [
      {
        label: '主版本',
        value: 'main',
      },
    ],
    codes: [
      {
        label: '全部项',
        value: 'all',
      },
    ],
  });

  const formState: UnwrapRef<ItemRequestType> = reactive({
    code: 'all',
    version: 'main',
  });
  const handleFinish: FormProps['onFinish'] = () => {
    state.loading = true;
    getAllItem(formState).then((data) => {
      console.log(data);
      gridOptions.data = data;
      if (!data.length) {
        useMessage().createMessage.info(t('common.noData'));
      }
      state.loading = false;
    });
  };
</script>
