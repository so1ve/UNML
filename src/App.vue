<script setup lang="ts">
import { handleExtensions } from "./extensions";

import "./styles/main.scss";

handleExtensions();
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
