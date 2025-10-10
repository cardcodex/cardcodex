<template>
  <div :style="fitSizeStyle" :data-card-renderer-type="props.config.style">
    <DOMRenderer v-show="showDOM" ref="domRef" :config="props.config" :size="props.size" @resize="resizeCard" />
    <div ref="innerRef" v-show="!showDOM"></div>
  </div>
</template>

<script lang="ts" setup>
import html2canvas from "html2canvas";
import DOMRenderer from "./dom-renderer.vue";
import { ref, watch, onMounted, type PropType } from "vue";
import { StyledCardConfig, DOMRendererInstance, RenderMode, SizeOptions } from "./card-tools";

const trickSizeOptions = {} as unknown as SizeOptions;

const showDOM = ref(true);
const innerRef = ref<HTMLElement>();
const domRef = ref<DOMRendererInstance>();
const sizeOptions = ref(trickSizeOptions);

const fitSizeStyle = ref({
  width: "auto",
  height: "auto"
});

const emit = defineEmits<{
  resize: [width: number, height: number];
}>();

const props = defineProps({
  config: {
    type: Object as PropType<StyledCardConfig>,
    required: true
  },
  renderMode: {
    type: String as PropType<RenderMode>,
    default: "dom"
  },
  size: {
    type: Object as PropType<SizeOptions>,
    default: () => ({})
  }
});

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
      sizeOptions.value = props.size;
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
