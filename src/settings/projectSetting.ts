import type { ProjectConfig } from '/#/config';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
} from '/@/enums/appEnum';

const setting: ProjectConfig = {
  showSettingButton: true,
  showDarkModeToggle: true,
  settingButtonPosition: SettingButtonPositionEnum.AUTO,
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,
  permissionCacheType: 1,
  sessionTimeoutProcessing: 0,
  themeColor: '#0960bd',
  grayMode: false,
  colorWeak: false,
  fullContent: false,
  contentMode: ContentEnum.FULL,
  showLogo: false,
  showFooter: false,
  headerSetting: {
    bgColor: '#ffffff',
    fixed: true,
    show: true,
    theme: ThemeEnum.LIGHT,
    useLockPage: true,
    showFullScreen: true,
    showDoc: false,
    showNotice: true,
    showSearch: true,
  },
  menuSetting: {
    bgColor: '#ffffff',
    fixed: true,
    collapsed: false,
    collapsedShowTitle: false,
    canDrag: false,
    show: true,
    hidden: false,
    menuWidth: 210,
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.SIDEBAR,
    theme: ThemeEnum.LIGHT,
    topMenuAlign: 'center',
    trigger: TriggerEnum.FOOTER,
    accordion: true,
    closeMixSidebarOnChange: false,
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,
    mixSideFixed: false,
    split: false,
  },
  multiTabsSetting: {
    cache: false,
    show: true,
    canDrag: true,
    showQuick: true,
    showRedo: true,
    showFold: true,
  },
  transitionSetting: {
    enable: true,
    basicTransition: RouterTransitionEnum.FADE_SIDE,
    openPageLoading: true,
    openNProgress: true,
  },
  openKeepAlive: true,
  lockTime: 0,
  showBreadCrumb: true,
  showBreadCrumbIcon: false,
  useErrorHandle: false,
  useOpenBackTop: true,
  canEmbedIFramePage: true,
  closeMessageOnSwitch: true,
  removeAllHttpPending: false,
};

export default setting;
