import { onMounted, onUnmounted, ref } from 'vue';
import { useIMStoreWithOut } from '/@/store/modules/im';
import { useUserStore } from '/@/store/modules/user';

const ws = ref<WebSocket>();
const wsTimerId = ref<number>();
const IMStore = useIMStoreWithOut();

export const mountUserActivationWebsocket = () => {
  const handleConn = () => {
    const userStore = useUserStore();
    const userId = userStore.getUserInfo.id;
    if (!userId) return;

    const token = userStore.getAccessToken;
    if (!token) {
      userStore.logout();
    }

    ws.value = new WebSocket(
      `ws://${location.hostname}:8888/ws/user-activation/${userId}?token=${token}`,
    );
    ws.value.onopen = function () {
      console.log('OPEN');
    };
    ws.value.onclose = function () {
      ws.value = undefined;
      userStore.logout();
    };
    ws.value.onmessage = function (evt) {
      console.log('RESPONSE: ' + evt.data);
      if (evt.data.startsWith('onlineUsers:')) {
        IMStore.setOnlineUsers(JSON.parse(evt.data.slice(12)));
        console.log(IMStore.getOnlineUsers);
      }
    };
    ws.value.onerror = function () {
      console.log('ERROR: ');
    };
  };

  onMounted(() => {
    setTimeout(() => {
      handleConn();
    }, 800);
    wsTimerId.value = setInterval(() => {
      ws.value?.send('ping');
    }, 15000) as unknown as number;
  });

  onUnmounted(() => {
    ws.value?.close();
    clearInterval(wsTimerId.value);
  });
};
