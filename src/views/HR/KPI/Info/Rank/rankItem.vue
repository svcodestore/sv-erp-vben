<template>
  <KpiSkeleton
    title="职级项"
    description="职级项列表，职级项与绩效项组合形成职级绩效规则"
    @form-finish="handleFinish"
    :loading="state.loading"
  >
    <sv-grid class="mt-4" v-bind="gridOptions" @refresh="handleFinish" />
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
  import { getAllRank, saveKpiRanksBatch } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    loading: false,
    align: 'center',
    insertOptions: {
      focusField: 'code',
    },
    saveApi: saveKpiRanksBatch,
    data: [],
    editRules: {
      code: [
        {
          required: true,
          content: '职级代码不能为空',
        },
      ],
    },
    columns: generateBaseColumns({
      columns: [
        {
          field: 'code',
          title: '职级代码',
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
    getAllRank(queries)
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
