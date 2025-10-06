<template>
  <div id="template" style="display: none">
    <div class="card shu">
      <div class="illustration">
        <img src="" />
      </div>
      <!-- 技能过长时启用 -->
      <div class="description-pro-bg"></div>
      <div class="frame">
        <div class="illustration illustration-front">
          <img src="" />
        </div>
        <label class="custom-kingdom"></label>
        <ul class="hitpoints"></ul>
        <h2 class="nickname"></h2>
        <h2 class="name"></h2>

        <div class="description"></div>

        <div class="footer">
          <label class="trademark"></label>
          <label class="illustrator"></label>
          <label class="index"></label>
        </div>
        <label class="package"></label>
      </div>
    </div>
  </div>

  <div id="result"></div>
  <button id="btn-scroll-right" type="button" class="panel-hint">▶</button>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { defineConfig, createCard } from "@/vendor/thirdparty";
const config = defineConfig({
  kingdom: "",
  name: "某某人2",
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
onMounted(() => {
  createCard(config);
});
</script>

<style>
@import "@cardcodex/card-resources/dist/classic.css";
</style>
