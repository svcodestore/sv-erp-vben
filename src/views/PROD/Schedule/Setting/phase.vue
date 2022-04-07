<template>
  <PageWrapper
    contentFullHeight
    title="标准工时设置"
    content=" 排程计划中生产款工站的属性设置，不同的属性设置将影响排程计划时间。"
  >
    <sv-grid class="bg-white" v-bind="gridOptions" @refresh="handleRefresh">
      <template #isMaster="{ row, column }">
        <span>
          {{ row[column.property] == 1 ? '主流程' : '副流程' }}
        </span>
      </template>
    </sv-grid>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { reactive } from 'vue';
  import { GridPropsType } from '/@/components/Grid/src/types';

  const gridOptions = reactive<GridPropsType>({
    loading: false,
    height: 600,
    columns: [
      { type: 'seq', width: 50 },
      { title: '款号', field: 'code' },
      { title: '工站号', field: 'codeId' },
      { title: '工站', field: 'name' },
      {
        align: 'right',
        field: 'costTime',
        title: '耗时',
        sortable: true,
        editRender: { name: 'input' },
      },
      {
        align: 'right',
        field: 'deadTime',
        title: '停滞时间',
        sortable: true,
        editRender: { name: 'input' },
      },
      {
        field: 'outTime',
        title: '外发时间',
        align: 'right',
        sortable: true,
        editRender: { name: 'input' },
      },
      {
        align: 'right',
        field: 'aheadTime',
        title: '段取时间',
        sortable: true,
        editRender: { name: 'input' },
      },
      {
        field: 'isMaster',
        title: '流程',
        slots: { default: 'isMaster' },
        editRender: {
          name: '$select',
          options: [
            {
              value: 1,
              label: '主流程',
            },
            {
              value: 0,
              label: '副流程',
            },
          ],
        },
      },
      {
        align: 'right',
        field: 'workerNum',
        title: '人数',
        sortable: true,
        editRender: { name: 'input' },
      },
    ],
  });
  const handleRefresh = () => {};
</script>
