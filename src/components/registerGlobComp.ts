import type { App } from 'vue';
import { Button } from './Button';
import { Input, Layout } from 'ant-design-vue';

import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

import { BasicGrid } from './Grid';

import { i18n } from '/@/locales/setupI18n';

VXETable.setup({
  i18n: (key, args) => i18n.global.t(key, args),
});

export function registerGlobComp(app: App) {
  app.use(Input).use(Button).use(Layout).use(VXETable).use(BasicGrid);
}
