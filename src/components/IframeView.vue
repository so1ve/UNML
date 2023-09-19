<!-- Adapted from https://github.com/nuxt/devtools/blob/main/packages/devtools/client/components/IframeView.vue -->
<script lang="ts">
const iframeCacheMap = new Map<string, HTMLIFrameElement>();
</script>

<script setup lang="ts">
// eslint-disable-next-line import/first
import { IFRAME_CLIENT_VAR } from "@unml/constants";
// eslint-disable-next-line import/first
import type { View } from "@unml/schema";
// eslint-disable-next-line import/first
import { pathToResourceUrl } from "@unml/utils/client";

const props = defineProps<{
  view: View;
}>();

const anchor = ref<HTMLDivElement>();
const key = computed(() => props.view.id);
const iframeEl = ref<HTMLIFrameElement | null>(null);
const box = reactive(useElementBounding(anchor));

onMounted(() => {
  const isPersistent = !!props.view.persistent;
  const allowedPermissions = ["clipboard-write", "clipboard-read"];

  if (iframeCacheMap.get(key.value) && isPersistent) {
    iframeEl.value = iframeCacheMap.get(key.value)!;
    iframeEl.value.style.visibility = "visible";
  } else {
    iframeEl.value = document.createElement("iframe");
    iframeEl.value.setAttribute("allow", allowedPermissions.join("; "));

    if (isPersistent) {
      iframeCacheMap.set(key.value, iframeEl.value);
    }
    iframeEl.value.src = pathToResourceUrl(props.view.path);
    // CORS
    try {
      iframeEl.value.style.opacity = "0";
      iframeEl.value.onload = () => {
        injectClient();
        iframeEl.value!.style.opacity = "1";
      };
    } catch {
      iframeEl.value.style.opacity = "1";
    }
    document.body.appendChild(iframeEl.value);
    nextTick(updateIframeBox);
  }
});

watchEffect(updateIframeBox);
watchEffect(injectClient);

onUnmounted(() => {
  if (iframeEl.value) {
    iframeEl.value.style.visibility = "hidden";
  }
});

function injectClient() {
  if (!iframeEl.value || !iframeEl.value.contentWindow) {
    return;
  }
  try {
    // TODO
    iframeEl.value.contentWindow[IFRAME_CLIENT_VAR] = useClient();
  } catch {}
}

function updateIframeBox() {
  if (!iframeEl.value) {
    return;
  }
  Object.assign(iframeEl.value.style, {
    position: "fixed",
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    outline: "none",
  });
}
</script>

<template>
  <div ref="anchor" u-view />
</template>
