<template>
  <KpiSkeleton
    title="职务分组表"
    description="绩效职务组表格，绩效职务项所属范围"
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
  import { getAllPositionGroup, saveKpiPositionGroups } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    loading: false,
    data: [],
    saveApi: saveKpiPositionGroups,
    insertOptions: {
      defaultRowValues: {
        pid: 'row_0',
      },
      focusField: 'name',
    },
    simplicityColumns: {
      excludeAppend: ['pid'],
    },
    treeConfig: {
      expandAll: true,
    },
    stripe: false,
    columns: generateBaseColumns({
      columns: [
        {
          field: 'name',
          title: '名称',
          editRender: {
            name: '$input',
          },
          align: 'center',
          treeNode: true,
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
    getAllPositionGroup(queries)
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
