<template>
  <sv-grid v-bind="gridOptions" @refresh="getData">
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
    <template #rankTitle="{ row, column }">
      {{ getRankTitleName(row[column.field]) }}
    </template>
    <template #rankTitleEdit="{ row, column }">
      <Select
        v-model:value="row[column.field]"
        show-search
        placeholder="请选择职级"
        style="width: 100%"
        :options="state.rankTitleOptions"
        :filter-option="rankTitleFilterOption"
      />
    </template>
  </sv-grid>
</template>

<script lang="ts" setup>
  import { FormProps, TreeSelect, TreeSelectProps, Select, SelectProps } from 'ant-design-vue';
  import { onMounted, reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import {
    KpiRequestType,
    PositionGroupType,
    PositionItemType,
    RankTitleType,
    RankType,
    StaffType,
    TitleType,
  } from '/@/api/HR/KPI/type';
  import {
    getAllPositionGroup,
    getAllPositionItem,
    getAllRank,
    getAllRankTitle,
    getAllStaff,
    getAllTitle,
    saveKpiStaffBatch,
  } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';
  import { listToTree } from '/@/utils/helper/treeHelper';

  const queries: KpiRequestType = { category: 'all', version: 'main' };

  const { t } = useI18n();

  const insertedReplace = (record: StaffType) => {
    const o = Object.assign({}, record);
    o.positionGroupId = +(o.positionGroupId + '').split('. ')[0];

    return o;
  };

  const updatedReplace = (record: StaffType) => {
    record.positionGroupId = +(record.positionGroupId + '').split('. ')[0];

    return record;
  };

  const gridOptions = reactive<GridPropsType<StaffType>>({
    loading: false,
    align: 'center',
    height: '100%',
    data: [],
    insertedReplace,
    updatedReplace,
    saveApi: saveKpiStaffBatch,
    insertOptions: {
      focusField: 'groupId',
    },
    editRules: {
      number: [
        {
          required: true,
          content: '工号不能为空',
        },
      ],
      name: [
        {
          required: true,
          content: '姓名不能为空',
        },
      ],
      positionGroupId: [
        {
          required: true,
          content: '职务组不能为空',
        },
      ],
      positionId: [
        {
          required: true,
          content: '职务不能为空',
        },
      ],
      rankTitleId: [
        {
          required: true,
          content: '职级不能为空',
        },
      ],
      employedIn: [
        {
          required: true,
          content: '入职日期不能为空',
        },
      ],
    },
    columns: generateBaseColumns({
      columns: [
        {
          field: 'number',
          title: '工号',
          editRender: {
            name: '$input',
          },
          width: 120,
        },
        {
          field: 'name',
          title: '姓名',
          editRender: {
            name: '$input',
          },
          width: 120,
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
          field: 'positionId',
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
          field: 'rankTitleId',
          title: '职级',
          editRender: {
            autofocus: 'input',
          },
          slots: {
            default: 'rankTitle',
            edit: 'rankTitleEdit',
          },
        },
        {
          field: 'employedIn',
          title: '入职日期',
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
    rankTitles: [] as RankTitleType[],
    rankTitleOptions: [] as SelectProps['options'],
    ranks: [] as RankType[],
    titles: [] as TitleType[],
  });

  const getData: FormProps['onFinish'] = async () => {
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

    const ranks = await getAllRank(queries);
    state.ranks = ranks;
    const titles = await getAllTitle(queries);
    state.titles = titles;
    const rankTitles = await getAllRankTitle(queries);
    state.rankTitles = rankTitles;
    state.rankTitleOptions = rankTitles.map((e) =>
      Object.assign({}, e, {
        label: `${ranks.find((rank) => rank.id === e.rankId)?.code} : ${
          titles.find((title) => title.id === e.titleId)?.name
        }`,
        value: e.id,
      }),
    );

    getAllStaff(queries)
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

  const rankTitleFilterOption = (input: string, option: { code: string }) => {
    return option.code.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const getRankTitleName = (rankTitleId: number) => {
    const rankTitle = state.rankTitles.find((e) => e.id === rankTitleId);
    if (rankTitle) {
      const rankCode = state.ranks.find((rank) => rank.id === rankTitle?.rankId)?.code;
      const titleName = state.titles.find((title) => title.id === rankTitle?.titleId)?.name;

      if (rankCode && titleName) {
        return rankCode + ' : ' + titleName;
      }
    }

    return '';
  };

  onMounted(() => {
    getData(queries);
  });
</script>
