import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const prod: AppRouteModule = {
  path: '/prod',
  name: 'ProductionDepartment',
  component: LAYOUT,
  redirect: '/prod/schedule',
  meta: {
    orderNo: 9,
    icon: 'icon-park-outline:ad-product',
    title: t('routes.prod.dept'),
  },
  children: [
    {
      path: 'schedule',
      name: 'ProdSchedule',
      component: getParentLayout('ProdSchedule'),
      redirect: '/prod/schedule/month-view',
      meta: {
        icon: 'ant-design:schedule-outlined',
        title: t('routes.prod.schedule.index'),
      },
      children: [
        {
          path: 'month-view',
          name: 'ProdScheduleMonthView',
          component: () => import('/@/views/PROD/Schedule/View/Month/index.vue'),
          meta: {
            title: t('routes.prod.schedule.view.month.index'),
          },
        },
        {
          path: 'day-view',
          name: 'ProdScheduleDayView',
          component: () => import('/@/views/PROD/Schedule/View/Day/index.vue'),
          meta: {
            title: t('routes.prod.schedule.view.day.index'),
          },
        },
        {
          path: 'outgoing',
          name: 'ProdScheduleOutgoing',
          component: () => import('/@/views/PROD/Schedule/Outgoing/index.vue'),
          meta: {
            title: t('routes.prod.schedule.view.outgoing.index'),
          },
        },
        {
          path: 'calendar',
          name: 'ProdScheduleCalendar',
          component: () => import('/@/views/PROD/Schedule/Calendar/index.vue'),
          meta: {
            title: t('routes.prod.schedule.view.calendar.index'),
          },
        },
        {
          path: 'prod-order',
          name: 'ProdScheduleProdOrder',
          component: () => import('/@/views/PROD/Schedule/PDO/index.vue'),
          meta: {
            title: t('routes.prod.schedule.view.pdo.index'),
          },
        },
        {
          path: 'phase-setting',
          name: 'ProdSchedulePhaseSetting',
          component: () => import('/@/views/PROD/Schedule/Setting/phase.vue'),
          meta: {
            title: t('routes.prod.schedule.view.setting.phase'),
          },
        },
        {
          path: 'param-setting',
          name: 'ProdScheduleParamSetting',
          component: () => import('/@/views/PROD/Schedule/Setting/param.vue'),
          meta: {
            title: t('routes.prod.schedule.view.setting.param'),
          },
        },
      ],
    },
  ],
};

export default prod;
