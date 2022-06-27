<template>
  <PageWrapper content-full-height title="生产行事历" content="行事历设置用于生产排程计算">
    <Spin :spinning="false">
      <Button
        type="primary"
        style="position: relative; z-index: 999; top: 12px"
        @click="settingVisible = true"
        >设置</Button
      >
      <Calendar style="position: relative; top: -32px" />
    </Spin>
    <Drawer
      placement="right"
      :width="820"
      :maskClosable="false"
      :closable="false"
      :visible="settingVisible"
      @close="settingVisible = false"
    >
      <template #title>
        <div style="display: flex">
          <span>行事历设置</span>
          <div style="margin-left: auto">
            <!-- <Button type="primary" ghost title="添加班次"> 添加班次 </Button> -->
            <Button type="link" title="关闭" @click="settingVisible = false"> 关闭 </Button>
          </div>
        </div>
      </template>
    </Drawer>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Spin, Calendar, Button, Drawer } from 'ant-design-vue';
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';

  const settingVisible = ref(false);
</script>
