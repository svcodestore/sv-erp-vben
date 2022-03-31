<template>
  <div style="display: flex">
    <Space>
      <Button shape="circle" :title="t('common.redo')" @click="refresh">
        <ReloadOutlined />
      </Button>
      <Button shape="circle" :title="t('common.undo')" @click="revert">
        <UndoOutlined />
      </Button>
      <Button type="primary" shape="circle" :title="t('common.insert')" @click="insert">
        <PlusOutlined />
      </Button>
      <Button
        type="primary"
        danger
        shape="circle"
        :title="t('common.delText')"
        @click="remove"
        :disabled="!Object.keys(gridCurrentRow).length"
      >
        <DeleteOutlined />
      </Button>
      <Popconfirm
        :title="t('component.grid.modCfmText')"
        :ok-text="t('common.confirm')"
        :cancel-text="t('common.cancelText')"
        placement="rightTop"
        :disabled="popconfirmDisabled"
        :visible="!popconfirmDisabled"
        @cancel="popconfirmDisabled = true"
        @confirm="submit"
      >
        <Button
          shape="circle"
          :title="t('common.saveText')"
          :loading="saveBtnLoading"
          :disabled="!saveApi"
          @click="validateModificationWrap"
        >
          <SaveOutlined />
        </Button>
      </Popconfirm>
    </Space>
    <slot name="center"></slot>
    <Space style="margin-left: auto">
      <span>
        {{ visibleData.length }}
      </span>
      <Space>
        <ClickOutSide @click-outside="handleClickOutSide">
          <Input
            style="
              width: 120px;
              background-color: transparent;
              border-top: 0;
              border-left: 0;
              border-right: 0;
              border-radius: 0;
              box-shadow: none;
            "
            :placeholder="t('component.grid.search')"
            v-model:value="filterStr"
            v-if="isShowFilterInput"
            @change="emit('search', filterStr)"
          />
        </ClickOutSide>
        <Button
          shape="circle"
          :title="t('component.grid.search')"
          @click="isShowFilterInput = !isShowFilterInput"
        >
          <SearchOutlined />
        </Button>
      </Space>
      <Button
        shape="circle"
        :title="isFullscreen ? t('component.grid.fullscreenExit') : t('component.grid.fullscreen')"
        @click="
          isFullscreen = !isFullscreen;
          grid?.zoom();
        "
      >
        <ExpandOutlined v-if="!isFullscreen" />
        <CompressOutlined v-else />
      </Button>
      <vxe-pulldown ref="xDown">
        <template #default>
          <Button shape="circle" :title="t('component.grid.visbCol')" @click="xDown.showPanel()">
            <MenuOutlined />
          </Button>
        </template>
        <template #dropdown>
          <div class="visible-columns">
            <Tree
              v-model:selectedKeys="selectedVisibleColKeys"
              v-model:checkedKeys="checkedVisibleColKeys"
              v-model:expandedKeys="expandedVisibleColTreeKeys"
              auto-expand-parent
              checkable
              :tree-data="treeColData"
              :height="233"
              @check="onVisibleColumnCheck"
            />
          </div>
        </template>
      </vxe-pulldown>
      <Dropdown :trigger="['click']">
        <Button shape="circle" :title="t('component.grid.more')">
          <MoreOutlined />
        </Button>
        <template #overlay>
          <Menu>
            <MenuItem key="print" @click="openPrint({})">
              <PrinterOutlined /> {{ t('component.grid.printContent') }}
            </MenuItem>
            <SubMenu key="export">
              <template #title> <ExportOutlined /> {{ t('component.grid.exportData') }} </template>
              <MenuItem key="excel" @click="exportAsExcel">
                <FileExcelOutlined /> {{ t('component.grid.excelExt') }}
              </MenuItem>
              <MenuItem key="more" @click="openExport({})">
                <EllipsisOutlined /> {{ t('component.grid.moreExt') }}
              </MenuItem>
            </SubMenu>
          </Menu>
        </template>
      </Dropdown>
    </Space>
  </div>
</template>

<script lang="ts" setup>
  import type { AxiosError } from 'axios';
  import { ref, h, defineComponent, onMounted } from 'vue';
  import {
    ReloadOutlined,
    UndoOutlined,
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
    SmileOutlined,
    FrownOutlined,
    ExpandOutlined,
    CompressOutlined,
    MenuOutlined,
    MoreOutlined,
    PrinterOutlined,
    ExportOutlined,
    FileExcelOutlined,
    EllipsisOutlined,
    SearchOutlined,
  } from '@ant-design/icons-vue';
  import {
    Button,
    Popconfirm,
    Space,
    notification,
    Dropdown,
    Menu,
    SubMenu,
    MenuItem,
    Input,
    Tree,
    TreeProps,
  } from 'ant-design-vue';
  import type { VxePulldownInstance } from 'vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ClickOutSide } from '/@/components/ClickOutSide';
  import { ToolBarProps } from '../../props';
  import { ToolBarType } from '../../types';
  import {
    getAllColKeys,
    getGridVisibleData,
    useExportAsExcel,
    useGetGridMod,
    useInsert,
    useOpenExport,
    useOpenPrint,
    useRefresh,
    useRemove,
    useRevert,
    useValidateModification,
    useVisibleColumnCheck,
  } from '../../helper';

  const { t } = useI18n();

  const _props = defineProps(ToolBarProps);
  const props = _props as ToolBarType;

  const emit = defineEmits(['remove', 'revert', 'search']);

  const saveBtnLoading = ref(false);
  const popconfirmDisabled = ref(true);
  const isFullscreen = ref(false);
  const isShowFilterInput = ref(false);

  const visibleData = getGridVisibleData(props);
  const filterStr = ref('');

  const xDown = ref({} as VxePulldownInstance);

  const selectedVisibleColKeys = ref<string[]>([]);
  const checkedVisibleColKeys = ref<string[]>(['root']);
  const expandedVisibleColTreeKeys = ref<string[]>([]);
  const treeColData = [
    {
      key: 'root',
      title: t('component.grid.allCols'),
      children: props.gridWrappedColumns.filter((col) => (col.title && col.field) || col.children),
    },
  ] as TreeProps['treeData'];
  const onVisibleColumnCheck = useVisibleColumnCheck(props);

  const insert = useInsert(props);

  const remove = useRemove(emit, props);

  const validateModificationWrap = async () => {
    popconfirmDisabled.value = true;
    const isValid = await validateModification();
    isValid && (popconfirmDisabled.value = false);
  };

  const validateModification = useValidateModification(props);

  const getGridMod = useGetGridMod(props);

  const refresh = useRefresh(props);

  const revert = useRevert(emit, props);

  const openPrint = useOpenPrint(props);

  const openExport = useOpenExport(props);

  const exportAsExcel = useExportAsExcel(props);

  const submit = async () => {
    try {
      if (props.saveApi) {
        await props
          .saveApi(getGridMod())
          .then((res) => {
            if (res.result) {
              notification.success({
                message: t('common.saveSucc'),
                icon: h(SmileOutlined, { style: 'color: #108ee9' }),
              });
              refresh();
            } else {
              notification.error({
                message: t('common.saveFail'),
                description: res.message,
                icon: h(FrownOutlined, { style: 'color: #108ee9' }),
              });
            }
          })
          .catch((err: AxiosError) => {
            notification.error({
              message: err.response?.status,
              description: err.response?.data.message,
              icon: h(FrownOutlined, { style: 'color: #108ee9' }),
            });
          });
      }
    } catch (error) {
      notification.error({
        message: t('common.saveFail'),
        // @ts-ignore
        description: error.message,
        icon: h(FrownOutlined, { style: 'color: #108ee9' }),
      });
    } finally {
      popconfirmDisabled.value = true;
    }
  };

  const handleClickOutSide = () => {
    isShowFilterInput.value = false;
  };

  defineExpose({ getGridMod });

  onMounted(() => {
    expandedVisibleColTreeKeys.value = getAllColKeys(props);
  });
</script>

<script lang="ts">
  export default defineComponent({
    name: 'SvGridToolbal',
  });
</script>

<style scoped lang="less">
  .visible-columns {
    overflow: auto;
    min-width: 110px;
    width: 150px;
    max-height: 25rem;
    position: absolute;
    right: 0;
    background-color: rgba(255, 255, 255, 0.438);
  }
</style>
