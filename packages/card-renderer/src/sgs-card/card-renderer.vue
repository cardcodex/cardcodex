<template>
  <div :style="fitSizeStyle" :data-card-renderer-type="props.style">
    <DOMRenderer v-show="showDOM" ref="domRef" :config="props.config" :size="props.size" @resize="resizeCard" />
    <div ref="innerRef" v-show="!showDOM"></div>
  </div>
</template>

<script lang="ts" setup>
import html2canvas from "html2canvas";
import DOMRenderer from "./dom-renderer.vue";
import { SgsCardKey } from "@cardcodex/sgs-card-resources";
import { ref, watch, onMounted, type PropType } from "vue";
import { CardConfig, DOMRendererInstance, RenderMode, ResizeOptions } from "./card-tools";

const showDOM = ref(true);
const innerRef = ref<HTMLElement>();
const domRef = ref<DOMRendererInstance>();

const fitSizeStyle = ref({
  width: "auto",
  height: "auto"
});

const emit = defineEmits<{
  resize: [width: number, height: number];
}>();

const props = defineProps({
  style: {
    type: String as unknown as PropType<SgsCardKey>,
    required: true
  },
  config: {
    type: Object as PropType<CardConfig>,
    required: true
  },
  renderMode: {
    type: String as PropType<RenderMode>,
    default: "dom"
  },
  size: {
    type: Object as PropType<ResizeOptions>,
    default: () => ({})
  }
});

const trickSize = {} as unknown as ResizeOptions;
const propSize = ref(trickSize);

function card2Canvas() {
  const el = domRef.value?.el();
  if (!el || !innerRef.value) return;
  html2canvas(el)
    .then((result: string | HTMLElement) => {
      if (typeof result === "string") {
        const image = new Image();
        image.src = result;
        return image;
      }
      return result;
    })
    .then((el: HTMLElement) => {
      innerRef.value!.innerHTML = "";
      innerRef.value!.appendChild(el);
      propSize.value = props.size;
      el.style.width = "100%";
      el.style.height = "100%";
      showDOM.value = false;
    })
    .catch((error: any) => {
      console.error(error);
    });
}

watch(
  [() => props],
  () => {
    card2Canvas();
  },
  {
    deep: true
  }
);

function resizeCard(width: number, height: number) {
  fitSizeStyle.value = {
    width: `${width}px`,
    height: `${height}px`
  };
  emit("resize", width, height);
}

onMounted(() => {
  card2Canvas();
});
</script>
