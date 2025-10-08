<template>
  <div ref="containerRef" v-show="isShowDOM"></div>
  <div ref="canvasRef" v-show="isShowCanvas"></div>
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
  renderMode: {
    type: String as PropType<CreateImageOptions["outputType"]>,
    default: "dom"
  }
});

const canvasRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const isShowDOM = ref(true);
const isShowCanvas = ref(!isShowDOM.value);

function toggleRenderMode(showDOM: boolean) {
  isShowDOM.value = showDOM;
  isShowCanvas.value = !showDOM;
}

async function renderAndResizeCard(isFirstRender = false) {
  if (!containerRef.value) return;
  toggleRenderMode(true);
  const el = containerRef.value as HTMLDivElement;
  el.setAttribute("data-card-renderer-type", props.type);
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
  if (props.renderMode === "dom") return;
  containerRef.value && (containerRef.value.style.opacity = "0");
  setTimeout(() => {
    buildImage(() => toggleRenderMode(false));
  }, 100);
}

function buildImage(onFinished?: CreateImageOptions["onFinished"]) {
  if (containerRef.value && canvasRef.value) {
    createImage(containerRef.value, canvasRef.value, {
      ...props.resizeOptions,
      outputType: props.renderMode,
      onFinished: () => onFinished?.()
    });
  }
}

function manualResize() {
  if (containerRef.value) {
    resizeCard(containerRef.value, props.resizeOptions);
  }
}

defineExpose({
  resize: manualResize,
  exportImage: buildImage
});
</script>

<style>
@import "./common.css";
@import "@cardcodex/sgs-card-resources/dist/index.css";
</style>
