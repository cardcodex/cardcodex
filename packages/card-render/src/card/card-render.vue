<template>
  <div ref="el"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { defineConfig, createCard } from "../vendor/thirdparty";
const config = defineConfig({
  kingdom: "",
  name: "某某人",
  nickname: "一名角色",
  hitpoints: "3",
  style: "wei",
  illustration: "",
  skills: [
    {
      name: "怒气",
      description: "<b>锁定技</b>。你的【杀】无使用距离和次数限制。"
    }
  ],
  quote: "",
  comment: ["2020 游卡桌游", "KayaK", "XXX 001"],
  package: "",
  textSize: "auto",
  extra: {
    "real-kingdom": "none"
  }
});

const el = ref(null);
onMounted(() => {
  if (el.value) {
    createCard(config, el.value);
  }
});
</script>

<style>
@import "common.css";
@import "@cardcodex/card-resources/dist/guozhan.css";
</style>
