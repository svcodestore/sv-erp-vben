<template>
  <KpiSkeleton title="职务项" @form-finish="handleFinish" :loading="state.loading">
    <sv-grid v-bind="gridOptions" v-show="gridOptions.data?.length" />
  </KpiSkeleton>
</template>

<script lang="ts" setup>
  import KpiSkeleton from '../../components/Skeleton/index.vue';
  import { FormProps } from 'ant-design-vue';
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { KpiRequestType } from '/@/api/HR/KPI/type';
  import { getAllPosition } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    loading: false,
    data: [],
    insertOptions: {
      focusField: 'name',
    },
    columns: generateBaseColumns({
      columns: [
        {
          field: 'name',
          title: '名称',
          editRender: {
            name: '$input',
          },
        },
      ],
    }),
  });

  const state = reactive({
    loading: false,
  });

  const handleFinish: FormProps['onFinish'] = (queries: KpiRequestType) => {
    state.loading = true;
    gridOptions.loading = true;
    getAllPosition(queries)
      .then((data) => {
        gridOptions.data = data;
        if (!data.length) {
          useMessage().createMessage.info(t('common.noData'));
        }
      })
      .finally(() => {
        state.loading = false;
        gridOptions.loading = false;
      });
  };
</script>
