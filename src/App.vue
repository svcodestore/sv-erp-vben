<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  import 'dayjs/locale/zh-cn';
  import { useAppStore } from '/@/store/modules/app';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useUserStore } from '/@/store/modules/user';

  // support Multi-language
  const { getAntdLocale } = useLocale();

  // Listening to page changes and dynamically changing site titles
  useTitle();

  const appStore = useAppStore();

  appStore.initCurrentApplication();

  const ws = ref<WebSocket>();
  const wsTimerId = ref<number>();

  const handleConn = () => {
    const userStore = useUserStore();
    const userId = userStore.getUserInfo.id;
    console.log(userId);
    if (!userId) return;
    ws.value = new WebSocket(`ws://localhost:8888/ws/user-activation/` + userId);
    ws.value.onopen = function () {
      console.log('OPEN');
    };
    ws.value.onclose = function () {
      console.log('CLOSE');
      ws.value = undefined;
    };
    ws.value.onmessage = function (evt) {
      console.log('RESPONSE: ' + evt.data);
    };
    ws.value.onerror = function () {
      console.log('ERROR: ');
    };
  };

  onMounted(() => {
    setTimeout(() => {
      handleConn();
    }, 1500);
    wsTimerId.value = setInterval(() => {
      ws.value?.send('ping');
    }, 15000) as unknown as number;
  });

  onUnmounted(() => {
    ws.value?.close();
    clearInterval(wsTimerId.value);
  });
</script>
