<template>
  <div ref="containerRef" :data-card-renderer-type="props.type"></div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, type PropType } from "vue";
import { type SgsCardKey } from "@cardcodex/sgs-card-resources";
import { createCard, resizeCard, type CardDataObject, type ResizeCardOptions } from "./vendor/thirdparty";

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

const containerRef = ref<HTMLElement | null>(null);

async function renderAndResizeCard(isFirstRender = false) {
  if (!containerRef.value) return;
  const el = containerRef.value as HTMLDivElement;
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
  renderAndResizeCard(true);
});

function manualResize() {
  if (containerRef.value) {
    resizeCard(containerRef.value, props.resizeOptions);
  }
}

defineExpose({
  resize: manualResize
});
</script>

<style>
@import "./common.css";
@import "@cardcodex/sgs-card-resources/dist/index.css";
</style>
