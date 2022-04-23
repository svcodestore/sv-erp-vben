<template>
  <KpiSkeleton title="职级表" @form-finish="handleFinish" :loading="state.loading">
    <sv-grid v-bind="gridOptions" v-show="gridOptions.data?.length" />
  </KpiSkeleton>
</template>

<script lang="ts" setup>
  import KpiSkeleton from '../../components/Skeleton/index.vue';
  import { FormProps } from 'ant-design-vue';
  import { reactive, UnwrapRef } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { KpiRequestType } from '/@/api/HR/KPI/type';
  import { getAllPosition } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    data: [],
    columns: generateBaseColumns({
      columns: [
        {
          field: 'code',
          title: '职级代码',
        },
      ],
    }),
  });

  const state = reactive({
    loading: false,
  });

  const formState: UnwrapRef<KpiRequestType> = reactive({
    code: 'all',
    version: 'main',
  });
  const handleFinish: FormProps['onFinish'] = () => {
    state.loading = true;
    getAllPosition(formState).then((data) => {
      gridOptions.data = data;
      if (!data.length) {
        useMessage().createMessage.info(t('common.noData'));
      }
      state.loading = false;
    });
  };
</script>
