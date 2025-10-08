<template>
  <div ref="containerRef" :data-card-renderer-type="props.type"></div>
  <div ref="canvasRef" :data-card-renderer-type="props.type" v-if="props.canvas"></div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, type PropType } from "vue";
import { type SgsCardKey } from "@cardcodex/sgs-card-resources";
import {
  createCard,
  createImage,
  resizeCard,
  type CardDataObject,
  type ResizeCardOptions,
  type CreateImageOptions
} from "./vendor/thirdparty";

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
  },
  canvas: {
    type: String as PropType<CreateImageOptions["outputType"]>,
    default: false
  }
});

const canvasRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);

async function renderAndResizeCard(isFirstRender = false) {
  if (!containerRef.value) return;
  const el = containerRef.value as HTMLDivElement;
  if (isFirstRender) {
    createCard(props.config, el, props.resizeOptions);
    becomeCanvas();
    return;
  }
  createCard(props.config, el, undefined);
  resizeCard(el, props.resizeOptions);
  becomeCanvas();
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

function becomeCanvas() {
  if (!props.canvas) return;
}

function manualResize() {
  if (containerRef.value) {
    resizeCard(containerRef.value, props.resizeOptions);
  }
}

function exportImage() {
  if (containerRef.value && canvasRef.value) {
    console.log(containerRef.value, canvasRef.value);
    createImage(containerRef.value, canvasRef.value, { ...props.resizeOptions, outputType: props.canvas });
  }
}

defineExpose({
  resize: manualResize,
  exportImage
});
</script>

<style>
@import "./common.css";
@import "@cardcodex/sgs-card-resources/dist/index.css";
</style>
