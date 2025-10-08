<template>
  <div ref="hostRef" :data-card-renderer-type="props.type"></div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, type PropType } from "vue";
import { type SgsCardKey } from "@cardcodex/sgs-card-resources";
import { createCard, resizeCard, type CardDataObject, type ResizeCardOptions } from "./vendor/thirdparty";

import commonStyles from "./common.css?raw";
import resourceStyles from "@cardcodex/sgs-card-resources/dist/index.css?raw";

// 定义 Props
const props = defineProps({
  type: {
    type: String as unknown as PropType<SgsCardKey>,
    required: true
  },
  config: {
    type: Object as PropType<CardDataObject>,
    required: true
  },
  resizeOptions: {
    type: Object as PropType<ResizeCardOptions>,
    default: () => ({})
  }
});

const hostRef = ref<HTMLDivElement | null>(null);
const mountPointRef = ref<HTMLDivElement | null>(null);

async function renderAndResizeCard(isFirstRender = false) {
  if (!mountPointRef.value) return;
  const el = mountPointRef.value as HTMLDivElement;
  el.setAttribute("data-card-renderer-type", props.type);
  if (isFirstRender) return createCard(props.config, el, props.resizeOptions);
  createCard(props.config, el, undefined);
  resizeCard(el, props.resizeOptions);
}

watch(
  () => props.type,
  () => renderAndResizeCard()
);

watch(
  () => props.config,
  () => renderAndResizeCard(),
  {
    deep: true
  }
);

onMounted(() => {
  if (!hostRef.value) return;
  const shadowRoot = hostRef.value.attachShadow({ mode: "open" });

  // 创建一个 <style> 标签来承载所有样式
  const styleEl = document.createElement("style");
  styleEl.textContent = commonStyles + "\n" + resourceStyles; // 将导入的 CSS 字符串合并

  shadowRoot.appendChild(styleEl);

  const mountPoint = document.createElement("div");
  shadowRoot.appendChild(mountPoint);

  mountPointRef.value = mountPoint;

  renderAndResizeCard();
});

function manualResize() {
  if (mountPointRef.value) {
    resizeCard(mountPointRef.value, props.resizeOptions);
  }
}

defineExpose({
  resize: manualResize
});
</script>
