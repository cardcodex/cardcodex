<template>
  <p>hello</p>
</template>

<script lang="ts" setup>
import { createCard } from "../vendor/thirdparty";
const c = createCard({
  kingdom: "wei",
  name: "hajimi",
  nickname: "hajimi",
  hitpoints: 3.5,
  style: "",
  illustration: "",
  skills: [],
  quote: "",
  comment: [],
  package: "",
  textSize: "small"
});
console.log(c);
</script>
