<template>
  <KpiSkeleton title="评分规则表" @form-finish="handleFinish" :loading="state.loading">
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
      <template #ruleItem="{ row, column }">
        {{ state.ruleItems.find((e) => e.id == row[column.field])?.category }}
      </template>
      <template #ruleItemEdit="{ row, column }">
        <Select
          v-model:value="row[column.field]"
          show-search
          placeholder="请选择规则类型"
          style="width: 100%"
          :options="state.ruleItemOptions"
          :filter-option="ruleItemFilterOption"
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
    ItemType,
    KpiRequestType,
    PositionGroupType,
    RuleItemType,
    RuleType,
  } from '/@/api/HR/KPI/type';
  import {
    getAllItem,
    getAllPositionGroup,
    getAllRule,
    getAllRuleItem,
    saveKpiRulesBatch,
  } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';
  import { listToTree } from '/@/utils/helper/treeHelper';

  const { t } = useI18n();

  const insertedReplace = (record: RuleType) => {
    const o = Object.assign({}, record);
    o.positionGroupId = +(o.positionGroupId + '').split('. ')[0];
    o.ruleExpression =
      state.ruleItems.find((item) => item.id === record.ruleItemId)?.expression || '';

    return o;
  };

  const updatedReplace = (record: RuleType) => {
    record.positionGroupId &&
      (record.positionGroupId = +(record.positionGroupId + '').split('. ')[0]);

    return record;
  };

  const gridOptions = reactive<GridPropsType<RuleType>>({
    loading: false,
    align: 'center',
    data: [],
    insertedReplace,
    updatedReplace,
    saveApi: saveKpiRulesBatch,
    insertOptions: {
      focusField: 'kpiId',
    },
    editRules: {
      positionGroupId: [
        {
          required: true,
          content: '职务组不能为空',
        },
      ],
      kpiId: [
        {
          required: true,
          content: '绩效不能为空',
        },
      ],
    },
    columns: generateBaseColumns({
      columns: [
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
          field: 'positionGroupId',
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
          field: 'ruleItemId',
          title: '规则类型',
          editRender: {
            autofocus: 'input',
          },
          slots: {
            default: 'ruleItem',
            edit: 'ruleItemEdit',
          },
          minWidth: 260,
        },
        {
          field: 'ruleExpression',
          title: '规则',
          editRender: {
            name: '$input',
          },
          minWidth: 260,
        },
      ],
    }),
  });

  const state = reactive({
    loading: false,
    positionGroupSearchValue: '',
    positionGroups: [] as PositionGroupType[],
    positionGroupTreeData: [] as TreeSelectProps['treeData'],
    kpiItems: [] as ItemType[],
    kpiItemOptions: [] as SelectProps['options'],
    ruleItems: [] as RuleItemType[],
    ruleItemOptions: [] as SelectProps['options'],
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

    const kpiItems = await getAllItem(queries);
    state.kpiItems = kpiItems;
    state.kpiItemOptions = kpiItems.map((e) =>
      Object.assign({}, e, { label: `${e.code}. ${e.name}`, value: e.id }),
    );

    const ruleItems = await getAllRuleItem(queries);
    state.ruleItems = ruleItems;
    state.ruleItemOptions = ruleItems.map((e) =>
      Object.assign({}, e, { label: `${e.category} => ${e.expression}`, value: e.id }),
    );

    getAllRule(queries)
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

  const kpiFilterOption = (input: string, option: { name: string; code?: string }) => {
    return (option.code + option.name).toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const ruleItemFilterOption = (input: string, option: { category: string }) => {
    return option.category.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
</script>
