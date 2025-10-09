<template>
  <div ref="boxRef" :class="isRendering ? 'sgs-card-renderer is-rendering' : 'sgs-card-renderer'">
    <div ref="containerRef" v-show="isShowDOM"></div>
    <div ref="canvasRef" v-show="isShowCanvas"></div>
    <div class="rendering-modal" v-if="isRendering">
      <loadingSpinner />
    </div>
  </div>
</template>

<script lang="ts" setup>
import loadingSpinner from "./loading-spinner.vue";
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

const emits = defineEmits<{
  finished: [HTMLCanvasElement | HTMLImageElement | undefined];
}>();

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

const isRendering = ref(false);
const isShowDOM = ref(true);
const isShowCanvas = ref(!isShowDOM.value);
const boxRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const originCardSize = ref([0, 0]);

function toggleRenderMode(showDOM: boolean) {
  isShowDOM.value = showDOM;
  isShowCanvas.value = !showDOM;
}

function saveCardSize() {
  const el = containerRef.value?.firstElementChild as HTMLDivElement;
  if (el && boxRef.value) {
    originCardSize.value = [el.offsetWidth, el.offsetHeight];
    boxRef.value.style.width = el.offsetWidth + "px";
    boxRef.value.style.height = el.offsetHeight + "px";
  }
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

watch([() => props.type, () => props.renderMode, () => props.resizeOptions], () => renderAndResizeCard());

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
  saveCardSize();
  if (props.renderMode === "dom") {
    emits("finished", undefined);
    return;
  }
  isRendering.value = true;
  containerRef.value && (containerRef.value.style.opacity = "0");
  setTimeout(() => {
    buildImage(() => toggleRenderMode(false));
  }, 100);
}

function resizeCanvas() {
  if (!canvasRef.value) return;
  canvasRef.value.style.width = originCardSize.value[0] + "px";
  canvasRef.value.style.height = originCardSize.value[1] + "px";
  const el = canvasRef.value?.children[0] as HTMLDivElement;
  if (!el) return;
  el.style.width = originCardSize.value[0] + "px";
  el.style.height = originCardSize.value[1] + "px";
  setTimeout(() => {
    isRendering.value = false;
    emits("finished", canvasRef.value?.firstElementChild as HTMLCanvasElement);
  }, 100);
}

function buildImage(onFinished?: CreateImageOptions["onFinished"]) {
  if (containerRef.value && canvasRef.value) {
    createImage(containerRef.value, canvasRef.value, {
      ...props.resizeOptions,
      outputType: props.renderMode,
      onFinished: () => {
        onFinished?.();
        isRendering.value = false;
        //setTimeout(resizeCanvas, 100);
      }
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
  exportImage: buildImage,
  isRendering: () => isRendering.value
});
</script>

<style>
@import "./common.css";
@import "@cardcodex/sgs-card-resources/dist/index.css";
</style>
