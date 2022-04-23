import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const prod: AppRouteModule = {
  path: '/hr',
  name: 'HumanResourceDepartment',
  component: LAYOUT,
  redirect: '/hr/kpi',
  meta: {
    orderNo: 10,
    icon: 'ant-design:team-outlined',
    title: t('routes.hr.dept'),
  },
  children: [
    {
      path: 'kpi',
      name: 'HrKpi',
      component: getParentLayout('HrKpi'),
      redirect: '/hr/kpi/info',
      meta: {
        icon: 'carbon:summary-kpi',
        title: t('routes.hr.kpi.index'),
      },
      children: [
        {
          path: 'info',
          name: 'HrKpiInfo',
          component: getParentLayout('HrKpiInfo'),
          redirect: '/hr/kpi/info/item',
          meta: {
            title: t('routes.hr.kpi.info.index'),
          },
          children: [
            {
              path: 'item',
              name: 'HrKpiInfoItem',
              component: getParentLayout('HrKpiInfoItem'),
              redirect: '/hr/kpi/info/item/table',
              meta: {
                title: t('routes.hr.kpi.info.item.index'),
              },
              children: [
                {
                  path: 'table',
                  name: 'HrKpiInfoItemTable',
                  component: () => import('/@/views/HR/KPI/Info/Item/table.vue'),
                  meta: {
                    title: t('routes.hr.kpi.info.item.table.index'),
                  },
                },
                {
                  path: 'category',
                  name: 'HrKpiInfoItemCategory',
                  component: () => import('../../../views/HR/KPI/Info/Item/table.vue'),
                  meta: {
                    title: t('routes.hr.kpi.info.item.category.index'),
                  },
                },
              ],
            },
            {
              path: 'title',
              name: 'HrKpiInfoTitle',
              component: getParentLayout('HrKpiInfoTitle'),
              redirect: '/hr/kpi/info/title/table',
              meta: {
                title: t('routes.hr.kpi.info.title.index'),
              },
              children: [
                {
                  path: 'table',
                  name: 'HrKpiInfoTitleTable',
                  component: () => import('/@/views/HR/KPI/Info/Title/table.vue'),
                  meta: {
                    title: t('routes.hr.kpi.info.title.table.index'),
                  },
                },
                {
                  path: 'item',
                  name: 'HrKpiInfoTitleItem',
                  component: () => import('/@/views/HR/KPI/Info/Title/item.vue'),
                  meta: {
                    title: t('routes.hr.kpi.info.title.item.index'),
                  },
                },
                {
                  path: 'category',
                  name: 'HrKpiInfoTitleCategory',
                  component: () => import('/@/views/HR/KPI/Info/Title/category.vue'),
                  meta: {
                    title: t('routes.hr.kpi.info.title.category.index'),
                  },
                },
              ],
            },
            {
              path: 'rank',
              name: 'HrKpiInfoRank',
              component: () => getParentLayout('HrKpiInfoRank'),
              redirect: '/hr/kpi/info/rank/table',
              meta: {
                title: t('routes.hr.kpi.info.rank.index'),
              },
              children: [
                {
                  path: 'table',
                  name: 'HrKpiInfoRankTable',
                  component: () => import('/@/views/HR/KPI/Info/Rank/table.vue'),
                  meta: {
                    title: t('routes.hr.kpi.info.rank.table.index'),
                  },
                },
                {
                  path: 'item',
                  name: 'HrKpiInfoRankItem',
                  component: () => import('/@/views/HR/KPI/Info/Rank/item.vue'),
                  meta: {
                    title: t('routes.hr.kpi.info.rank.item.index'),
                  },
                },
              ],
            },
            {
              path: 'position',
              name: 'HrKpiInfoPosition',
              component: getParentLayout('HrKpiInfoPosition'),
              redirect: '/hr/kpi/info/position/table',
              meta: {
                title: t('routes.hr.kpi.info.position.index'),
              },
              children: [
                {
                  path: 'table',
                  name: 'HrKpiInfoPositionTable',
                  component: () => import('/@/views/HR/KPI/Info/Position/table.vue'),
                  meta: {
                    title: t('routes.hr.kpi.info.title.table.index'),
                  },
                },
                {
                  path: 'item',
                  name: 'HrKpiInfoPositionItem',
                  component: () => import('/@/views/HR/KPI/Info/Position/item.vue'),
                  meta: {
                    title: t('routes.hr.kpi.info.title.item.index'),
                  },
                },
                {
                  path: 'group',
                  name: 'HrKpiInfoPositionGroup',
                  component: () => import('/@/views/HR/KPI/Info/Position/group.vue'),
                  meta: {
                    title: t('routes.hr.kpi.info.position.group.index'),
                  },
                },
              ],
            },
            {
              path: 'staff',
              name: 'HrKpiInfoStaff',
              component: () => import('/@/views/HR/KPI/Info/Staff/index.vue'),
              meta: {
                title: t('routes.hr.kpi.info.staff.index'),
              },
            },
          ],
        },
        {
          path: 'rule',
          name: 'HrKpiRule',
          component: getParentLayout('HrKpiRule'),
          redirect: '/hr/kpi/rule/table',
          meta: {
            title: t('routes.hr.kpi.rule.index'),
          },
          children: [
            {
              path: 'table',
              name: 'HrKpiRuleTable',
              component: () => import('/@/views/HR/KPI/Rule/table.vue'),
              meta: {
                title: t('routes.hr.kpi.rule.table.index'),
              },
            },
            {
              path: 'item',
              name: 'HrKpiRuleItem',
              component: () => import('/@/views/HR/KPI/Rule/item.vue'),
              meta: {
                title: t('routes.hr.kpi.rule.item.index'),
              },
            },
          ],
        },
        {
          path: 'score',
          name: 'HrKpiScore',
          component: getParentLayout('HrKpiScore'),
          redirect: '/hr/kpi/score/item',
          meta: {
            title: t('routes.hr.kpi.score.index'),
          },
          children: [
            {
              path: 'item',
              name: 'HrKpiScoreItem',
              component: () => import('/@/views/HR/KPI/Score/Item/index.vue'),
              meta: {
                title: t('routes.hr.kpi.score.item.index'),
              },
            },
            {
              path: 'staff',
              name: 'HrKpiScoreStaff',
              component: () => import('/@/views/HR/KPI/Score/Staff/index.vue'),
              meta: {
                title: t('routes.hr.kpi.score.staff.index'),
              },
            },
            {
              path: 'direct-staff',
              name: 'HrKpiScoreDirectStaff',
              component: () => import('/@/views/HR/KPI/Score/DirectStaff/index.vue'),
              meta: {
                title: t('routes.hr.kpi.score.directStaff.index'),
              },
            },
          ],
        },
        {
          path: 'report',
          name: 'HrKpiReport',
          component: () => import('/@/views/HR/KPI/Report/index.vue'),
          meta: {
            title: t('routes.hr.kpi.report.index'),
          },
        },
        {
          path: 'statistics',
          name: 'HrKpiStatistics',
          component: () => import('/@/views/HR/KPI/Statistics/index.vue'),
          meta: {
            title: t('routes.hr.kpi.statistics.index'),
          },
        },
      ],
    },
  ],
};

export default prod;
