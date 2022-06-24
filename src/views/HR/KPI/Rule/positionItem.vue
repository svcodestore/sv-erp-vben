<template>
  <KpiSkeleton title="职务表" @form-finish="handleFinish" :loading="state.loading">
    <sv-grid v-bind="gridOptions" @refresh="handleFinish">
      <template #group="{ row, column }">
        {{ getGroupName(row[column.field]) }}
      </template>
      <template #groupEdit="{ row, column }">
        <TreeSelect
          class="group-tree-select"
          v-model:value="row[column.field]"
          v-model:searchValue="state.positionGroupSearchValue"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择职务组"
          allow-clear
          tree-default-expand-all
          :tree-data="state.positionGroupTreeData"
        >
          <template #title="{ title }">
            <template
              v-for="(fragment, i) in title
                ?.toString()
                .split(
                  new RegExp(
                    `(?<=${state.positionGroupSearchValue})|(?=${state.positionGroupSearchValue})`,
                    'i',
                  ),
                )"
            >
              <span
                v-if="fragment.toLowerCase() === state.positionGroupSearchValue.toLowerCase()"
                :key="i"
                style="color: #08c"
              >
                {{ fragment }}
              </span>
              <template v-else>{{ fragment }}</template>
            </template>
          </template>
        </TreeSelect>
      </template>
      <template #item="{ row, column }">
        {{ state.positionItems.find((e) => e.id == row[column.field])?.name }}
      </template>
      <template #itemEdit="{ row, column }">
        <Select
          v-model:value="row[column.field]"
          show-search
          placeholder="请选择职务"
          style="width: 100%"
          :options="state.positionItemOptions"
          :filter-option="filterOption"
        />
      </template>
      <template #kpi="{ row, column }">
        {{ state.kpiItems.find((e) => e.id == row[column.field])?.name }}
      </template>
      <template #kpiEdit="{ row, column }">
        <Select
          v-model:value="row[column.field]"
          show-search
          placeholder="请选择绩效"
          style="width: 100%"
          :options="state.kpiItemOptions"
          :filter-option="kpiFilterOption"
        />
      </template>
      <template #kpiCategory="{ row, column }">
        {{ state.kpiCategories.find((e) => e.id == row[column.field])?.name }}
      </template>
      <template #kpiCategoryEdit="{ row, column }">
        <Select
          v-model:value="row[column.field]"
          show-search
          placeholder="请选择绩效类别"
          style="width: 100%"
          :options="state.kpiCategoryOptions"
          :filter-option="filterOption"
        />
      </template>
    </sv-grid>
  </KpiSkeleton>
</template>

<script lang="ts" setup>
  import KpiSkeleton from '../components/Skeleton/index.vue';
  import { FormProps, TreeSelect, TreeSelectProps, Select, SelectProps } from 'ant-design-vue';
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import {
    ItemCategoryType,
    ItemType,
    KpiRequestType,
    PositionGroupType,
    PositionItemType,
    PositionType,
  } from '/@/api/HR/KPI/type';
  import {
    getAllItem,
    getAllItemCategory,
    getAllPosition,
    getAllPositionGroup,
    getAllPositionItem,
    saveKpiPositionsBatch,
  } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';
  import { listToTree } from '/@/utils/helper/treeHelper';

  const { t } = useI18n();

  const insertedReplace = (record: PositionType) => {
    const o = Object.assign({}, record);
    o.groupId = +(o.groupId + '').split('. ')[0];

    return o;
  };

  const updatedReplace = (record: PositionType) => {
    record.groupId = +(record.groupId + '').split('. ')[0];

    return record;
  };

  const gridOptions = reactive<GridPropsType<PositionType>>({
    loading: false,
    align: 'center',
    data: [],
    insertedReplace,
    updatedReplace,
    saveApi: saveKpiPositionsBatch,
    insertOptions: {
      focusField: 'groupId',
    },
    editRules: {
      groupId: [
        {
          required: true,
          content: '职务组不能为空',
        },
      ],
      itemId: [
        {
          required: true,
          content: '职务不能为空',
        },
      ],
      kpiId: [
        {
          required: true,
          content: '绩效不能为空',
        },
      ],
      categoryId: [
        {
          required: true,
          content: '绩效类别不能为空',
        },
      ],
      scorePercent: [
        {
          required: true,
          content: '分数占比不能为空',
        },
      ],
    },
    columns: generateBaseColumns({
      columns: [
        {
          field: 'groupId',
          title: '职务组',
          editRender: {
            autofocus: '.group-tree-select input',
          },
          slots: {
            default: 'group',
            edit: 'groupEdit',
          },
          minWidth: 260,
        },
        {
          field: 'itemId',
          title: '职务',
          editRender: {
            autofocus: 'input',
          },
          slots: {
            default: 'item',
            edit: 'itemEdit',
          },
        },
        {
          field: 'kpiId',
          title: '绩效',
          editRender: {
            autofocus: 'input',
          },
          slots: {
            default: 'kpi',
            edit: 'kpiEdit',
          },
        },
        {
          field: 'categoryId',
          title: '绩效类别',
          editRender: {
            autofocus: 'input',
          },
          slots: {
            default: 'kpiCategory',
            edit: 'kpiCategoryEdit',
          },
        },
        {
          field: 'scorePercent',
          title: '分数占比',
          align: 'right',
          editRender: {
            name: '$input',
          },
        },
      ],
    }),
  });

  const state = reactive({
    loading: false,
    positionGroupSearchValue: '',
    positionGroups: [] as PositionGroupType[],
    positionGroupTreeData: [] as TreeSelectProps['treeData'],
    positionItems: [] as PositionItemType[],
    positionItemOptions: [] as SelectProps['options'],
    kpiItems: [] as ItemType[],
    kpiItemOptions: [] as SelectProps['options'],
    kpiCategories: [] as ItemCategoryType[],
    kpiCategoryOptions: [] as SelectProps['options'],
  });

  const handleFinish: FormProps['onFinish'] = async (queries: KpiRequestType) => {
    state.loading = true;
    gridOptions.loading = true;

    const positionGroups = await getAllPositionGroup(queries);
    state.positionGroups = positionGroups;
    state.positionGroupTreeData = listToTree<PositionGroupType>(
      positionGroups.map((e) =>
        Object.assign({}, e, { value: `${e.id}. ${e.name}`, title: e.name }),
      ),
    );

    const positionItems = await getAllPositionItem(queries);
    state.positionItems = positionItems;
    state.positionItemOptions = positionItems.map((e) =>
      Object.assign({}, e, { label: e.name, value: e.id }),
    );

    const kpiItems = await getAllItem(queries);
    state.kpiItems = kpiItems;
    state.kpiItemOptions = kpiItems.map((e) =>
      Object.assign({}, e, { label: `${e.code}. ${e.name}`, value: e.id }),
    );

    const kpiCategories = await getAllItemCategory(queries);
    state.kpiCategories = kpiCategories;
    state.kpiCategoryOptions = kpiCategories.map((e) =>
      Object.assign({}, e, { label: e.name, value: e.id }),
    );

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

  const getCompleteGroupName = (id: number) => {
    const item = state.positionGroups.find((e) => e.id === id);
    if (item) {
      const name = getCompleteGroupName(item.pid);
      if (name) {
        return name + ' / ' + item.name;
      }
      return item.name;
    }
  };

  const getGroupName = (title?: string | number) => {
    try {
      if (!title) return '';

      if (typeof title === 'string') {
        const [id] = title?.split('. ');
        if (id) {
          return getCompleteGroupName(+id);
        }
      } else {
        return getCompleteGroupName(title);
      }
    } catch {
      return '';
    }
  };

  const filterOption = (input: string, option: { name: string }) => {
    return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const kpiFilterOption = (input: string, option: { name: string; code?: string }) => {
    return (option.code + option.name).toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
</script>
