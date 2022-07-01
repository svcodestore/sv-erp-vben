<template>
  <KpiSkeleton title="项目评分" @form-finish="handleFinish" :loading="state.loading">
    <sv-grid v-bind="gridOptions" @refresh="handleFinish">
      <template #group="{ row, column }">
        {{ getGroupName(row[column.field]) }}
      </template>
      <template #kpi="{ row, column }">
        {{ state.kpiItems.find((e) => e.id == row[column.field])?.name }}
      </template>
      <template #kpiScore="{ row }">
        {{ getKpiScore(row) }}
      </template>
    </sv-grid>
  </KpiSkeleton>
</template>

<script lang="ts" setup>
  import KpiSkeleton from '../../components/Skeleton/index.vue';
  import { FormProps } from 'ant-design-vue';
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { ItemType, KpiRequestType, PositionGroupType, RuleType } from '/@/api/HR/KPI/type';
  import {
    getAllItem,
    getAllPositionGroup,
    getAllRule,
    saveKpiGroupScoresBatch,
  } from '/@/api/HR/KPI';
  import { generateBaseColumns } from '/@/utils/grid/column';
  import { useUserStore } from '/@/store/modules/user';
  import { dateUtil } from '/@/utils/dateUtil';

  const { t } = useI18n();

  const gridOptions = reactive<GridPropsType<RuleType>>({
    loading: false,
    align: 'center',
    insertable: false,
    removable: false,
    data: [],
    saveApi: (data) => {
      const userStore = useUserStore();
      const scores = data.U?.map((item) => {
        const o = {
          id: item.id,
          createdBy: userStore.getUserInfo.id,
          updatedBy: userStore.getUserInfo.id,
          month: dateUtil().format('YYYY-MM'),
          ruleId: item.id,
          score: item.score,
          // @ts-ignore
          kpiScore: String(getKpiScore(gridOptions.data?.find((e) => e.id === item.id))),
        };

        return o;
      });

      return new Promise((resolve) => {
        saveKpiGroupScoresBatch({ A: scores })
          .then((res) => {
            resolve(res);
          })
          .catch(() => {});
      });
    },
    columns: generateBaseColumns({
      columns: [
        {
          field: 'kpiId',
          title: '绩效',
          slots: {
            default: 'kpi',
          },
          minWidth: 260,
        },
        {
          field: 'positionGroupId',
          title: '职务组',
          slots: {
            default: 'group',
          },
          minWidth: 260,
        },
        {
          field: 'score',
          title: '得分',
          editRender: {
            name: '$input',
          },
          minWidth: 120,
        },
        {
          field: 'kpiScore',
          title: '绩效得分',
          minWidth: 120,
          slots: {
            default: 'kpiScore',
          },
        },
      ],
    }),
  });

  const state = reactive({
    loading: false,
    positionGroups: [] as PositionGroupType[],
    kpiItems: [] as ItemType[],
  });

  const handleFinish: FormProps['onFinish'] = async (queries: KpiRequestType) => {
    state.loading = true;
    gridOptions.loading = true;

    const positionGroups = await getAllPositionGroup(queries);
    state.positionGroups = positionGroups;

    const kpiItems = await getAllItem(queries);
    state.kpiItems = kpiItems;

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

  const getKpiScore = ({ score, ruleItemId, ruleExpression }: RuleType & { score: string }) => {
    if (!score) {
      return;
    }

    switch (ruleItemId) {
      case 1:
        const conditions = ruleExpression.split(',');
        let kpiScore = 0;
        conditions.forEach((cond) => {
          const [kpiScoreRange, scoreRange] = cond.split(':');
          const [kpiScoreStartPoint, kpiScoreEndPoint] = kpiScoreRange.split('-');
          const [scoreStartPoint, scoreEndPoint] = scoreRange.split('-');
          if (scoreStartPoint > scoreEndPoint) {
            if (kpiScoreStartPoint > kpiScoreEndPoint) {
              if (+score >= +scoreEndPoint && +score <= +scoreStartPoint) {
                const a = +scoreStartPoint * 100 - +scoreEndPoint * 100;
                const b = +kpiScoreStartPoint - +kpiScoreEndPoint;
                kpiScore = +kpiScoreStartPoint + ((+score * 100 - +scoreStartPoint * 100) * b) / a;
              }
              return;
            }
          }
        });
        return kpiScore;

      default:
        return;
    }
  };
</script>
