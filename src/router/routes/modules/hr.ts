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
              component: () => import('../../../views/HR/KPI/Info/Item/table.vue'),
              redirect: '/hr/kpi/info/item/table',
              meta: {
                title: t('routes.hr.kpi.info.item.index'),
              },
              children: [
                {
                  path: 'table',
                  name: 'HrKpiInfoItemList',
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
              path: 'rank',
              name: 'HrKpiInfoRank',
              component: () => import('/@/views/HR/KPI/Info/Rank/index.vue'),
              meta: {
                title: t('routes.hr.kpi.info.rank.index'),
              },
            },
            {
              path: 'position',
              name: 'HrKpiInfoPosition',
              component: () => import('/@/views/HR/KPI/Info/Position/index.vue'),
              meta: {
                title: t('routes.hr.kpi.info.position.index'),
              },
            },
            {
              path: 'title',
              name: 'HrKpiInfoTitle',
              component: () => import('/@/views/HR/KPI/Info/Title/index.vue'),
              meta: {
                title: t('routes.hr.kpi.info.title.index'),
              },
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
          component: () => import('/@/views/HR/KPI/Rule/index.vue'),
          meta: {
            title: t('routes.hr.kpi.rule.index'),
          },
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
