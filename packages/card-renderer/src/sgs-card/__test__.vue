<template>
  <input type="text" v-model="cardConfig.name" />
  <input type="number" v-model="width" />
  <cardRenderer
    ref="cardRef"
    :config="cardConfig"
    :size="{
      width: width
    }"
    :render-mode="RenderMode.Canvas"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import cardRenderer from "./card-renderer.vue";
import { SkillTag, RenderMode, CardRendererInstance, Group, StyledCardConfig } from "./card-tools";
import { SgsCardResourcesMap } from "@cardcodex/sgs-card-resources";

const cardRef = ref<CardRendererInstance>();
const width = ref(300);
const cardConfig = reactive<StyledCardConfig>({
  style: SgsCardResourcesMap.CLASSIC,
  badge: "畜",
  name: "锅巴",
  title: "哈基米哈基米",
  hp: [2, 3, 2],
  group: Group.SHU_LORD,
  nameStyle: {
    scale: 0.7,
    moveX: -12,
    moveY: 33
  },
  skills: [
    { tag: [SkillTag.Limit], name: "龙胆", description: "<b>锁定技</b>你可以将" },
    { name: "龙胆", description: "<b>锁定技</b>。你的♥♦【杀】无使用距离和次数限制。" }
  ],
  image: {
    path: "https://i.postimg.cc/RZWTR3pb/IMG-20201006-123445-1.jpg",
    adjust: {
      x: 50,
      y: 20,
      scale: 2
    }
  },
  quote: "废物哈吉米",
  comments: [],
  package: "狗"
});

onMounted(() => {});
</script>
