<template>
  <input type="text" v-model="cardConfig.name" />
  <SgsCardDOMRenderer
    ref="rendererRef"
    :config="cardConfig"
    type="classic"
    :render-mode="renderMode"
    @finished="downloadImage"
  />
  <button @click="makeImage">image</button>
  <button @click="downloadImage">check</button>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { SgsCardDOMRenderer, type CardDataObject, type CardRendererInstance } from ".";

const cardData = ref<any | null>(null);
const rendererRef = ref<CardRendererInstance | null>(null);

const renderMode = ref<"dom" | "image">("dom");

const cardConfig = reactive<CardDataObject>({
  kingdom: "犬",
  name: "",
  nickname: "在踩踩懂",
  hp: 4,
  style: "wu",
  skills: [{ name: "龙胆", description: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。" }],
  image: {
    path: "https://img.jsdelivr.com/raw.githubusercontent.com/zumerlab/snapdom/main/docs/assets/newhero.png",
    allowEvent: false
  },
  quote: "",
  comment: [],
  package: "",
  textSize: "auto"
});

function makeImage() {
  if (renderMode.value === "image") {
    renderMode.value = "dom";
  } else {
    renderMode.value = "image";
  }
}

function downloadImage(e: any) {
  if (!cardData.value) {
    cardData.value = e;
  }
  console.log(cardData.value);
}

onMounted(() => {
  console.log(rendererRef.value);
});
</script>
