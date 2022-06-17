<template>
  <KpiSkeleton
    title="绩效项目表"
    description="绩效项目表格，绩效项与其它绩效信息组合形成最终的绩效评分"
    @form-finish="handleFinish"
    :loading="state.loading"
  >
    <sv-grid
      class="mt-4"
      v-bind="gridOptions"
      @refresh="handleFinish"
      v-show="gridOptions.data?.length"
    />
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
  import { getAllItem, saveKpiItems } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    loading: false,
    data: [],
    insertOptions: {
      focusField: 'code',
    },
    saveApi: saveKpiItems,
    columns: generateBaseColumns({
      columns: [
        {
          field: 'code',
          title: '项目号',
          width: 120,
          editRender: {
            name: '$input',
          },
        },
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
    getAllItem(queries)
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
