<template>
  <PageWrapper contentFullHeight :title="title" :content="description">
    <div class="py-4 bg-white flex flex-col justify-center items-center">
      <Form layout="inline" :model="formState" @finish="handleFinish">
        <FormItem>
          <Select v-model:value="formState.version" style="width: 140px">
            <SelectOption v-for="line in state.versions" :key="line.value">
              {{ line.label }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model:value="formState.category" style="width: 140px">
            <SelectOption v-for="line in state.categories" :key="line.value">
              {{ line.label }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" :loading="loading">
            {{ t('common.queryText') }}
          </Button>
        </FormItem>
      </Form>
    </div>

    <slot></slot>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Form, FormItem, Select, SelectOption, FormProps, Button } from 'ant-design-vue';
  import { reactive, UnwrapRef } from 'vue';
  import { props } from './props';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { KpiRequestType } from '/@/api/HR/KPI/type';

  const emit = defineEmits(['form-finish']);

  defineProps(props);

  const { t } = useI18n();

  const state = reactive({
    versions: [
      {
        label: t('routes.hr.components.skeleton.mainVersion'),
        value: 'main',
      },
    ],
    categories: [
      {
        label: t('routes.hr.components.skeleton.allCode'),
        value: 'all',
      },
    ],
  });

  const formState: UnwrapRef<KpiRequestType> = reactive({
    category: 'all',
    version: 'main',
  });
  const handleFinish: FormProps['onFinish'] = () => {
    emit('form-finish', formState);
  };
</script>
