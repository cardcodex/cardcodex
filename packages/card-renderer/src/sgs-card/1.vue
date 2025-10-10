<template>
  <input type="text" v-model="cardConfig.name" />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { SgsCardDOMRenderer, type CardDataObject, type CardRendererInstance } from ".";

const cardConfig = reactive<CardDataObject>({
  kingdom: "犬",
  name: "",
  nickname: "在踩踩懂",
  hp: 4,
  kind: "wu",
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
</script>
