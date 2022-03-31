<template>
  <PageWrapper>
    <template #headerContent> WorkbenchHeader </template>
    <sv-grid ref="grid" v-bind="gridOptions" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { GridPropsType } from '/@/components/Grid/src/types';
  import { PageWrapper } from '/@/components/Page';
  import { test } from '/@/api/HR/kpi';
  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 1500);

  const grid = ref(null);
  const gridOptions = reactive<GridPropsType>({
    proxyConfig: {
      ajax: {
        query() {
          return test();
        },
      },
    },
    columns: [
      {
        type: 'seq',
        width: 60,
      },
      {
        field: 'name',
        title: 'Name',
        editRender: { name: 'input' },
      },
      {
        field: 'sex',
        title: 'Sex',
      },
      {
        field: 'age',
        title: 'Age',
      },
    ],
  });
</script>
