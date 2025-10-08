<template>
  <input type="text" v-model="cardConfig.name" />
  <SgsCardDOMRenderer ref="rendererRef" :config="cardConfig" type="classic" render-mode="image" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { SgsCardDOMRenderer, type CardDataObject, type CardRendererInstance } from "@cardcodex/card-renderer";

const rendererRef = ref<CardRendererInstance | null>(null);

const cardConfig = reactive<CardDataObject>({
  kingdom: "畜",
  name: "锅巴",
  nickname: "哈基米",
  hitpoints: 4,
  style: "god",
  skills: [
    { name: "龙胆", description: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。" },
    { name: "龙胆", description: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。" },
    { name: "龙胆", description: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。" },
    { name: "龙胆", description: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。" },
    { name: "龙胆", description: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。" }
  ],
  image: {
    path: "https://i.postimg.cc/RZWTR3pb/IMG-20201006-123445-1.jpg",
    allowEvent: false,
    adjust: {
      x: 50,
      y: 20,
      scale: 2
    }
  },
  quote: "",
  comment: [],
  package: "",
  textSize: "small"
});

onMounted(() => {});
</script>
