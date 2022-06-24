<template>
  <KpiSkeleton
    title="职称项"
    description="对职级项命名形成职称"
    @form-finish="handleFinish"
    :loading="state.loading"
  >
    <sv-grid v-bind="gridOptions" @refresh="handleFinish" />
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
  import { getAllTitle, saveKpiTitlesBatch } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    loading: false,
    align: 'center',
    data: [],
    insertOptions: {
      focusField: 'name',
    },
    saveApi: saveKpiTitlesBatch,
    editRules: {
      name: [
        {
          required: true,
          content: '职称名不能为空',
        },
      ],
    },
    columns: generateBaseColumns({
      columns: [
        {
          field: 'name',
          title: '职称名',
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
    getAllTitle(queries)
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
