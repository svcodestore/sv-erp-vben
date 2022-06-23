<template>
  <KpiSkeleton
    title="职级表"
    description="职级职称列表"
    @form-finish="handleFinish"
    :loading="state.loading"
  >
    <sv-grid class="mt-4" v-bind="gridOptions" @refresh="handleFinish">
      <template #rank="{ row, column }">
        {{ state.ranks.find((e) => e.id == row[column.field])?.code }}
      </template>
      <template #rankEdit="{ row, column }">
        <Select
          v-model:value="row[column.field]"
          show-search
          placeholder="请选择职级"
          style="width: 100%"
          :options="state.rankOptions"
          :filter-option="rankFilterOption"
        />
      </template>
      <template #title="{ row, column }">
        {{ state.titles.find((e) => e.id == row[column.field])?.name }}
      </template>
      <template #titleEdit="{ row, column }">
        <Select
          v-model:value="row[column.field]"
          show-search
          placeholder="请选择职称"
          style="width: 100%"
          :options="state.titleOptions"
          :filter-option="titleFilterOption"
        />
      </template>
    </sv-grid>
  </KpiSkeleton>
</template>

<script lang="ts" setup>
  import KpiSkeleton from '../../components/Skeleton/index.vue';
  import { FormProps, SelectProps, Select } from 'ant-design-vue';
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { KpiRequestType, RankType, TitleType } from '/@/api/HR/KPI/type';
  import { getAllRank, getAllRankTitle, getAllTitle, saveKpiRankTitlesBatch } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType>({
    loading: false,
    align: 'center',
    data: [],
    saveApi: saveKpiRankTitlesBatch,
    insertOptions: {
      focusField: 'rankId',
    },
    editRules: {
      rankId: [
        {
          required: true,
          content: '职级不能为空',
        },
      ],
      titleId: [
        {
          required: true,
          content: '职称不能为空',
        },
      ],
    },
    columns: generateBaseColumns({
      columns: [
        {
          field: 'rankId',
          title: '职级',
          editRender: {
            autofocus: 'input',
          },
          slots: {
            default: 'rank',
            edit: 'rankEdit',
          },
        },
        {
          field: 'titleId',
          title: '职称',
          editRender: {
            autofocus: 'input',
          },
          slots: {
            default: 'title',
            edit: 'titleEdit',
          },
        },
      ],
    }),
  });

  const state = reactive({
    loading: false,
    ranks: [] as RankType[],
    rankOptions: [] as SelectProps['options'],
    titles: [] as TitleType[],
    titleOptions: [] as SelectProps['options'],
  });

  const handleFinish: FormProps['onFinish'] = async (queries: KpiRequestType) => {
    state.loading = true;
    gridOptions.loading = true;

    const ranks = await getAllRank(queries);
    state.ranks = ranks;
    state.rankOptions = ranks.map((e) => Object.assign({}, e, { label: e.code, value: e.id }));

    const titles = await getAllTitle(queries);
    state.titles = titles;
    state.titleOptions = titles.map((e) => Object.assign({}, e, { label: e.name, value: e.id }));

    getAllRankTitle(queries)
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

  const rankFilterOption = (input: string, option: { code: string }) => {
    return option.code.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const titleFilterOption = (input: string, option: { name: string }) => {
    return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
</script>
