<template>
  <KpiSkeleton
    title="绩效项目分类表"
    description="绩效项目类别，绩效项与绩效类别和职务项形成职务考核项"
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
  import { getAllItemCategory, saveKpiItemCategories } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    loading: false,
    align: 'center',
    data: [],
    insertOptions: {
      focusField: 'code',
    },
    saveApi: saveKpiItemCategories,
    editRules: {
      name: [
        {
          required: true,
          content: '类别名不能为空',
        },
      ],
      code: [
        {
          required: true,
          content: '类别编号不能为空',
        },
      ],
    },
    columns: generateBaseColumns({
      columns: [
        {
          field: 'code',
          title: '类别编号',
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
    getAllItemCategory(queries)
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
