<template>
  <div class="fixed h-full w-full flex flex-col justify-center items-center text-4xl">
    <div class="">{{ t('auth.authenticating') }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const queryParams = new URLSearchParams(location.search);
  console.log(queryParams.get('code'));
</script>
