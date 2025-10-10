<template>
  <div :data-card-renderer-type="props.style" :style="cardStyle">
    <DOMRenderer v-show="showDOM" ref="domRef" :config="props.config" :size="props.size" @resize="resizeCard" />
    <div ref="innerRef" v-show="!showDOM" :style="cardStyle"></div>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import domtoimage from "dom-to-image-more";
import DOMRenderer from "./dom-renderer.vue";
import { SgsCardKey } from "@cardcodex/sgs-card-resources";
import { ref, watch, onMounted, type PropType } from "vue";
import { CardConfig, DOMRendererInstance, RenderMode, ResizeOptions } from "./card-tools";

const showDOM = ref(true);
const innerRef = ref<HTMLElement>();
const domRef = ref<DOMRendererInstance>();

const cardStyle = ref({
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

function renderMode() {
  const fnMap: Record<RenderMode, null | ((el: HTMLElement) => Promise<any>)> = {
    [RenderMode.DOM]: null,
    [RenderMode.SVG]: domtoimage.toSvg,
    [RenderMode.Image]: domtoimage.toPng,
    [RenderMode.Canvas]: domtoimage.toCanvas
  };

  const el = domRef.value?.el();
  const fn = fnMap[props.renderMode];
  if (!fn || !el) return;
  showDOM.value = true;
  fn(el)
    .then(function (result: string | HTMLElement) {
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
    renderMode();
  },
  {
    deep: true
  }
);

function resizeCard(width: number, height: number) {
  cardStyle.value = {
    width: `${width}px`,
    height: `${height}px`
  };
  console.log("resizeCard", width, height);
  emit("resize", width, height);
}

onMounted(() => {
  renderMode();
});
</script>
