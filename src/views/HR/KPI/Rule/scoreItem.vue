<template>
  <KpiSkeleton title="评分规则项表格" @form-finish="handleFinish" :loading="state.loading">
    <sv-grid v-bind="gridOptions" @refresh="handleFinish" />
  </KpiSkeleton>
</template>

<script lang="ts" setup>
  import KpiSkeleton from '../components/Skeleton/index.vue';
  import { FormProps } from 'ant-design-vue';
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { KpiRequestType, RuleItemType } from '/@/api/HR/KPI/type';
  import { getAllRuleItem, saveKpiRuleItemBatch } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType<RuleItemType>>({
    loading: false,
    align: 'center',
    data: [],
    saveApi: saveKpiRuleItemBatch,
    insertOptions: {
      focusField: 'category',
    },
    editRules: {
      category: [
        {
          required: true,
          content: '类型不能为空',
        },
      ],
      expression: [
        {
          required: true,
          content: '规则不能为空',
        },
      ],
    },
    columns: generateBaseColumns({
      columns: [
        {
          field: 'category',
          title: '类型',
          editRender: {
            name: '$input',
          },
          minWidth: 120,
        },
        {
          field: 'expression',
          title: '规则',
          editRender: {
            name: '$input',
          },
        },
        {
          field: 'remark',
          title: '备注',
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

  const handleFinish: FormProps['onFinish'] = async (queries: KpiRequestType) => {
    state.loading = true;
    gridOptions.loading = true;

    getAllRuleItem(queries)
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
