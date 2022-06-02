<template>
  <span style="letter-spacing: 6px">
    <b>斯达文星皮具有限公司</b>
  </span>
  <div
    style="
      text-align: center;
      color: black;
      font-weight: bold;
      font-size: 30px;
      letter-spacing: 16px;
    "
  >
    <span>{{ reportTitle }}</span>
  </div>
  <div style="font-size: 22px">
    上下班时间：<b>{{ commuterTime }}</b> | 出勤天数：<b>{{ attendanceDays }}</b> | 出勤时间：
    <b>{{ attendanceHours }}</b>
    | 休息日：{{ restDay }}
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    reportTitle: {
      type: String,
      default: () => '',
    },
    commuterTime: {
      type: String,
      default: () => '',
    },
    attendanceHours: {
      type: String,
      default: () => '',
    },
    attendanceDays: {
      type: String,
      default: () => '',
    },
    restDay: {
      type: String,
      default: () => '',
    },
  });
</script>
