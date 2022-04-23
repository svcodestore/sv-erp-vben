<template>
  <vxe-grid ref="xGrid" v-bind="attrs" v-on="events" style="margin: 5px 0">
    <template #toolbar>
      <slot name="toolbar">
        <Toolbar
          ref="toolbar"
          style="margin-bottom: 2px"
          v-bind="toolbarAttrs"
          @remove="unsetCurrentRow"
          @revert="unsetCurrentRow"
          @search="handleFilterData"
        >
          <template #center>
            <div class="toolbar-center-container">
              <slot name="toolbarCenter">
                <Tooltip placement="top" :title="desc" v-if="desc">
                  <span v-if="title">{{ title }}</span>
                </Tooltip>
                <span v-if="title">{{ title }}</span>
              </slot>
            </div>
          </template>
        </Toolbar>
      </slot>
    </template>
    <template
      v-for="slotname in columnSlots"
      #[slotname]="{
        row,
        rowIndex,
        $rowIndex,
        column,
        columnIndex,
        $columnIndex,
        _columnIndex,
        $panel,
      }"
    >
      <slot
        :name="slotname"
        v-bind="{
          row,
          rowIndex,
          $rowIndex,
          column,
          columnIndex,
          $columnIndex,
          _columnIndex,
          $panel,
        }"
      ></slot>
    </template>
  </vxe-grid>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, reactive } from 'vue';
  import type { VxeGridInstance } from 'vxe-table';
  import { Tooltip } from 'ant-design-vue';
  import { Toolbar } from './components/toolbar';
  import { getFilteredData, getWrappedColumns, getGridData, getColumnSlots } from './helper';

  import gridProps from './props';
  import { GridPropsType, ToolBarType } from './types';
  import { cloneDeep } from 'lodash-es';

  const emit = defineEmits(['refresh', 'current-change']);

  const xGrid = ref({} as VxeGridInstance);
  const toolbar = ref({});

  const props = defineProps(gridProps);
  const originalData = ref(cloneDeep(props.data));
  watch(
    () => props.data,
    (v) => {
      originalData.value = cloneDeep(v);
    },
  );

  const currentRow = ref({});

  const filterStr = ref('');

  const attrs = computed(() => {
    const wrap = Object.assign({}, props, {
      columns: wrappedColumns.value,
    });
    if (!props.proxyConfig) {
      return Object.assign(wrap, {
        data: gridData.value,
      });
    }

    return wrap;
  });

  const events = computed(() => {
    return {
      'current-change': currentChangeEvent,
    };
  });

  const columnSlots = getColumnSlots(props as GridPropsType);

  const handleFilterData = (str: string) => {
    filterStr.value = str;
  };

  const filteredData = getFilteredData(filterStr, props as GridPropsType);

  const gridData = getGridData(props as GridPropsType, filteredData);

  const wrappedColumns = getWrappedColumns(props as GridPropsType);

  const toolbarAttrs = reactive<ToolBarType>({
    // @ts-ignore
    grid: xGrid,
    gridEmit: emit,
    gridCurrentRow: currentRow,
    // @ts-ignore
    gridOriginalData: originalData,
    // @ts-ignore
    gridWrappedColumns: wrappedColumns || [],
    saveApi: props.saveApi,
    insertOptions: props.insertOptions,
  });

  const currentChangeEvent = ({
    newValue,
    oldValue,
    row,
    rowIndex,
    $rowIndex,
    column,
    columnIndex,
    $columnIndex,
    $event,
  }) => {
    currentRow.value = row;

    emit('current-change', {
      newValue,
      oldValue,
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      $event,
    });
  };

  const unsetCurrentRow = () => {
    currentRow.value = {};
  };

  defineExpose({ xGrid, toolbar });
</script>

<script lang="ts">
  // @ts-ignore
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'SvGrid',
  });
</script>

<style lang="less" scoped>
  .toolbar-center-container {
    width: 100%;
    text-align: center;
    line-height: 32px;
    font-size: 16px;
    white-space: nowrap;
    letter-spacing: 5px;
    color: black;
  }
</style>
