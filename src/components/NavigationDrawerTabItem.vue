<script setup lang="ts">
import type { Tab } from "@unml/schema";
import { VListItem } from "vuetify/components/VList";

interface BaseProps {
  tab: Tab;
}
type Props = BaseProps & InstanceType<typeof VListItem>["$props"];

const props = defineProps<BaseProps>() as Props;
const route = useRoute();
const tabPath = getTabPath(props.tab);
const currentPath = computed(() => route.path);
</script>

<template>
  <VListItem
    :active="tabPath === currentPath"
    active-class="v-list-item--active text-green"
    :to="getTabPath(props.tab)"
  >
    <Icon v-bind="props.tab.icon" />
  </VListItem>
</template>
