<template>
  <KpiSkeleton
    title="职务项"
    description="职务项列表，给职务项分配职务组形成一个职务"
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
  import { getAllPositionItem, saveKpiPositionItemsBatch } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    loading: false,
    data: [],
    saveApi: saveKpiPositionItemsBatch,
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
          align: 'center',
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
    getAllPositionItem(queries)
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
