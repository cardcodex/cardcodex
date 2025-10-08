<template>
  <input type="text" v-model="cardConfig.name" />
  <SgsCardDOMRenderer ref="rendererRef" :config="cardConfig" type="classic" render-mode="dom" />
  <button @click="downloadImage">image</button>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { SgsCardDOMRenderer, type CardDataObject, type CardRendererInstance } from ".";

const rendererRef = ref<CardRendererInstance | null>(null);

const cardConfig = reactive<CardDataObject>({
  kingdom: "吴",
  name: "赵云",
  nickname: "哈基米",
  hitpoints: 4,
  style: "wu",
  skills: [{ name: "龙胆", description: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。" }],
  image: "https://img.jsdelivr.com/raw.githubusercontent.com/zumerlab/snapdom/main/docs/assets/newhero.png",
  quote: "",
  comment: [],
  package: "",
  textSize: "auto"
});

function downloadImage() {
  rendererRef.value?.exportImage();
}

onMounted(() => {
  console.log(rendererRef.value);
});
</script>
