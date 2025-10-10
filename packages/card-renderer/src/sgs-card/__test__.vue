<template>
  <input type="text" v-model="cardConfig.name" />
  <!-- <SgsCardDOMRenderer :config="cardConfig" :style="'classic'" /> -->
  <cardDom :config="cardConfig" :style="'classic-cards'" :render-mode="'dom'" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { cardDom, SgsCardDOMRenderer, type CardDataObject, type CardRendererInstance } from ".";

const cardData = ref<any | null>(null);
const rendererRef = ref<CardRendererInstance | null>(null);

const renderMode = ref<"dom" | "image">("dom");

const cardConfig = reactive<CardDataObject>({
  kingdom: "犬",
  name: "奶龙出击",
  nickname: "",
  hp: "3/6",
  kind: "wu",
  skills: [{ name: "龙胆", description: "立刻给我打钱" }],
  image: {
    path: "https://i.postimg.cc/cC627c6L/images-removebg-preview.png",
    adjust: {
      x: 90,
      y: 110,
      scale: 1.2
    }
  },
  quote: "等着吧",
  comment: [],
  package: "奶",
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
