<template>
  <input type="text" v-model="cardConfig.name" />
  <SgsCardDOMRenderer ref="rendererRef" :config="cardConfig" type="classic" />
  <SgsCardShadowDOMRenderer ref="rendererRef" :config="cardConfig" type="classic" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { SgsCardDOMRenderer, SgsCardShadowDOMRenderer, type CardDataObject, type CardRendererInstance } from ".";

const rendererRef = ref<CardRendererInstance | null>(null);

const cardConfig = reactive<CardDataObject>({
  kingdom: "吴",
  name: "赵云",
  nickname: "常山赵子龙",
  hitpoints: 4,
  style: "wei lord",
  skills: [{ name: "龙胆", description: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。" }],
  illustration: "https://i.postimg.cc/RZWTR3pb/IMG-20201006-123445-1.jpg",
  quote: "",
  comment: [],
  package: "",
  textSize: "small"
});

onMounted(() => {
  console.log(rendererRef.value);
});
</script>
