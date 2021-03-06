<template>
  <Space>
    <Button shape="circle" :title="t('common.redo')" @click="refresh">
      <ReloadOutlined />
    </Button>
    <Button shape="circle" :title="t('common.undo')" @click="revert">
      <UndoOutlined />
    </Button>
    <Popover placement="bottom">
      <template #content v-if="isShowInsertSubNode">
        <Button
          type="primary"
          ghost
          :title="t('component.grid.addSubNodeDesc')"
          @click="insertSubNode"
        >
          <SubnodeOutlined />{{ t('component.grid.addSubNode') }}
        </Button>
      </template>
      <Button
        type="primary"
        shape="circle"
        :title="t('common.insert')"
        @click="insert"
        v-if="insertable"
      >
        <PlusOutlined />
      </Button>
    </Popover>
    <Popover placement="bottom">
      <template #content v-if="isShowDelMulti">
        <Button danger type="ghost" :title="t('component.grid.delMultiDesc')" @click="removeMulti">
          <DeleteOutlined />{{ t('component.grid.delMulti') }}
        </Button>
      </template>
      <Button
        type="primary"
        danger
        shape="circle"
        :title="t('common.delText')"
        @click="remove"
        :disabled="isDisableDel"
        v-if="removable"
      >
        <DeleteOutlined />
      </Button>
    </Popover>
    <Popconfirm
      :title="t('component.grid.modCfmText')"
      :ok-text="t('common.confirm')"
      :cancel-text="t('common.cancelText')"
      placement="rightTop"
      :ok-button-props="{
        loading: saveBtnLoading,
      }"
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
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import {
    ReloadOutlined,
    UndoOutlined,
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
    SubnodeOutlined,
  } from '@ant-design/icons-vue';
  import { Button, Popconfirm, Space, Popover } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ToolBarProps } from '../../props';
  import { ToolBarType } from '../../types';
  import {
    useGetGridMod,
    useInsert,
    useRefresh,
    useRemove,
    useRevert,
    useValidateModification,
  } from '../../helper';
  import { isNull, isUnDef } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();

  const _props = defineProps(ToolBarProps);
  const props = _props as unknown as ToolBarType;

  const emit = defineEmits(['remove', 'revert']);

  const saveBtnLoading = ref(false);
  const popconfirmDisabled = ref(true);

  const isShowInsertSubNode = computed<boolean>(() => {
    const pid = props.gridCurrentRow.pid;

    return !isNull(pid) && !isUnDef(pid) && !!props.grid.treeConfig;
  });

  const isDisableDel = computed<boolean>(() => {
    return (
      !Object.keys(props.gridCurrentRow || {}).length &&
      !(props?.grid || {}).getCheckboxRecords?.().length
    );
  });

  const isShowDelMulti = computed<boolean>(() => {
    return (props?.grid || {}).getCheckboxRecords?.().length > 1;
  });

  const insert = useInsert(props);

  const insertSubNode = () => {
    insert({ pid: props.gridCurrentRow.id });
  };

  const remove = useRemove(emit, props);

  const removeMulti = () => {
    props.grid?.remove((props?.grid || {}).getCheckboxRecords());
  };

  const validateModificationWrap = async () => {
    popconfirmDisabled.value = true;
    const isValid = await validateModification();
    isValid && (popconfirmDisabled.value = false);
  };

  const validateModification = useValidateModification(props);

  const getGridMod = useGetGridMod(props);

  const refresh = useRefresh(props);

  const revert = useRevert(emit, props);

  const submit = async () => {
    if (props.saveApi) {
      await props
        .saveApi(getGridMod())
        .then(() => {
          useMessage().createMessage.success(t('common.saveSucc'));
          refresh();
        })
        .finally(() => {
          saveBtnLoading.value = false;
          popconfirmDisabled.value = true;
        });
    }
  };

  defineExpose({ getGridMod });
</script>
