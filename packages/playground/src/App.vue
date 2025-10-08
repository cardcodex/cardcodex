<template>
  <CardRenderer ref="rendererRef" :config="cardConfig" type="classic" />
  <button @click="handleResize">手动调整大小</button>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, type Reactive } from "vue";
import { CardRenderer, type CardDataObject, type CardRendererInstance } from "@cardcodex/card-renderer";

const rendererRef = ref<CardRendererInstance | null>(null);

const cardConfig: Reactive<CardDataObject> = reactive<CardDataObject>({
  kingdom: "蜀",
  name: "赵云",
  nickname: "常山赵子龙",
  hitpoints: 4,
  style: "shu",
  skills: [{ name: "龙胆", description: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。" }]
});

function handleResize() {
  rendererRef.value?.resize();
}

onMounted(() => {
  console.log(rendererRef.value);
});
</script>
