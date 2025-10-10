<template>
  <div
    ref="domRef"
    :data-name="config.name"
    :data-kingdom="config.badge"
    :data-nickname="config.title"
    :class="['card', config.group]"
    :style="resizeStyle"
  >
    <div class="illustration">
      <img ref="imageRef" :src="imgSrc" :style="imageStyle" @load="onImageLoad" />
    </div>
    <div class="frame">
      <label class="custom-kingdom" :data-value="config.badge" :length="getTextLength(config.badge)">{{
        config.badge
      }}</label>
      <ul class="hitpoints" :hp="hpData.hp" :maxhp="hpData.maxhp" :total="hpData.total">
        <li v-for="item in hpData.limit"></li>
        <li v-for="item in hpData.drained" class="drained"></li>
        <li v-for="item in hpData.overflow" class="overflow"></li>
      </ul>
      <h2 class="nickname" :data-value="config.title" :data-length="getTextLength(config.title)">
        {{ config.title }}
      </h2>
      <h2 class="name" :data-value="config.name" :length="getTextLength(config.name)" :style="nameStyle">
        {{ config.name }}
      </h2>
      <div
        class="description"
        :class="[skillClassName, { empty: config.skills.length === 0 }]"
        :data-length="skillData.textCount"
        :data-length-div10="Math.floor(skillData.textCount / 10)"
        :data-length-div100="Math.floor(skillData.textCount / 100)"
      >
        <template v-for="(item, index) in config.skills">
          <label
            class="pointer"
            :class="item?.tag || []"
            :length="getTextLength(item.description)"
            v-html="skillData.names[index]"
          >
          </label>
          <p :class="item?.tag || []" v-html="skillData.descs[index]!.replace(/\r?\n/g, '<br/>')"></p>
        </template>
        <p class="quote" v-if="config.quote">
          <span class="author" v-for="item in config.quote.split(/\r?\n/g)" v-html="item"></span>
        </p>
      </div>
      <div class="footer" v-if="commentData.show">
        <label class="trademark" v-html="commentData.left"></label>
        <label class="illustrator" v-html="commentData.center"></label>
        <label class="index" v-html="commentData.right"></label>
      </div>
      <label class="package" v-bind="packageData.bind" v-html="packageData.html"></label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from "vue";
import { CardConfig, defineHpConfig, DOMRendererInstance, HpType, SizeOptions, SkillConfig } from "./card-tools";

const domRef = ref<HTMLElement>();
const imageRef = ref<HTMLImageElement>();

const config = computed(() => props.config);
const naturalSize = ref({ width: 0, height: 0 });
const hpData = computed(() => parseHpData(config.value.hp));
const skillData = computed(() => parseSkills(config.value.skills));
const packageData = computed(() => parsePackage(config.value.package));
const skillClassName = computed(() => `description-${config.value.fontSize || "medium"}`);
const commentData = computed(() => parseComment(config.value.comments as [string, string, string]));
const imgSrc = computed(() => (typeof config.value.image === "string" ? config.value.image : config.value.image?.path));

const emit = defineEmits<{
  resize: [width: number, height: number];
}>();

const props = defineProps({
  config: {
    type: Object as PropType<CardConfig>,
    required: true
  },
  size: {
    type: Object as PropType<SizeOptions>,
    default: () => ({})
  }
});

function getTextLength(text: string) {
  return text ? text.replace(/<[^>]+>/g, "").length : 0;
}

function parseHpData(inputHp: HpType) {
  let hp = Array.isArray(inputHp) ? defineHpConfig(...inputHp) : inputHp;
  let drained = 0;
  let overflow = 0;
  if (typeof hp == "string") {
    let match;
    if ((match = hp.match(/^(\d+)\/(\d+)\+(\d+)$/))) {
      // A/B+C
      hp = Number(match[1]);
      drained = Number(match[2]) - hp;
      overflow = Number(match[3]);
      if (drained < 0) {
        hp += overflow;
        overflow += -drained;
        drained = 0;
      }
    } else if ((match = hp.match(/^(\d+)\/(\d+)$/))) {
      // A/B
      hp = Number(match[1]);
      drained = Number(match[2]) - hp;
      if (drained < 0) {
        overflow = -drained;
        drained = 0;
      }
    } else if ((match = hp.match(/^(\d+)\+(\d+)$/))) {
      // A+C
      overflow = Number(match[2]);
      hp = overflow + Number(match[1]);
    } else {
      drained = Math.round((Number(hp) % 1) * 10);
    }
  } else {
    drained = Math.round((hp % 1) * 10);
  }

  const limit = Math.min(drained ? Number(hp) : Number(hp) - overflow, 100);
  const maxhp = drained ? Number(hp) + drained : Number(hp) - overflow;
  const total = drained ? Number(hp) + drained + overflow : Number(hp);
  return {
    hp,
    drained,
    overflow,
    limit,
    maxhp,
    total
  };
}

function parseSkills(skills: SkillConfig[]) {
  const names = skills.map(item => item.name);
  const textCount = skills.reduce((acc, item) => acc + item.description.length, 0);
  const descs = skills.map(item =>
    item.description
      .replace(/♠/g, '<i class="suit suit-spade"></i>')
      .replace(/♥/g, '<i class="suit suit-heart"></i>')
      .replace(/♦/g, '<i class="suit suit-diamond"></i>')
      .replace(/♣/g, '<i class="suit suit-club"></i>')
  );
  return { names, textCount, descs };
}

function parseComment(comments: [string, string, string]) {
  let left = "",
    center = "",
    right = "";

  const len: number = comments.length;

  switch (comments.length as number) {
    case 3:
      [left, center, right] = comments;
      break;
    case 2:
      [left, right] = comments;
      break;
    case 1:
      right = comments[0];
      break;
  }

  return {
    left,
    center,
    right,
    show: 0 < len && len <= 3
  };
}

function parsePackage(pkg: string) {
  if (pkg.includes("://")) {
    return {
      html: '<img src="' + pkg + '">',
      bind: {
        "data-image": ""
      }
    };
  }
  return {
    html: pkg,
    bind: {
      "data-value": pkg,
      "data-length": getTextLength(pkg)
    }
  };
}

function onImageLoad() {
  if (imageRef.value) {
    naturalSize.value.width = imageRef.value.naturalWidth;
    naturalSize.value.height = imageRef.value.naturalHeight;
  }
}

const nameStyle = computed(() => {
  if (!config.value.nameStyle) {
    return {};
  }
  const { scale = 1, moveX = 0, moveY = 0 } = config.value.nameStyle || {};
  return {
    transform: `scale(${scale}) translate(${moveX}px, ${moveY}px)`
  };
});

const imageStyle = computed(() => {
  if (typeof config.value.image === "string" || naturalSize.value.width === 0) {
    return {};
  }
  const { scale = 1, x = 0, y = 0 } = config.value.image?.adjust || {};
  return {
    top: `${y}px`,
    left: `${x}px`,
    width: `${naturalSize.value.width * scale}px`,
    height: `${naturalSize.value.height * scale}px`
  };
});

const resizeStyle = computed(() => {
  const { width, height } = props.size ?? {};

  if (!domRef.value || domRef.value.clientWidth === 0 || domRef.value.clientHeight === 0 || (!width && !height)) {
    return {};
  }

  let scaleRatio = 1;
  const cardWidth = domRef.value.clientWidth;
  const cardHeight = domRef.value.clientHeight;
  const isScalingUp = (width && width > cardWidth) || (height && height > cardHeight);

  if (isScalingUp) {
    const scaleX = (width || 0) / cardWidth;
    const scaleY = (height || 0) / cardHeight;
    scaleRatio = Math.max(scaleX, scaleY);
  } else {
    const scaleX = width ? width / cardWidth : Infinity;
    const scaleY = height ? height / cardHeight : Infinity;
    scaleRatio = Math.min(scaleX, scaleY);
  }

  const finalWidth = cardWidth * scaleRatio;
  const finalHeight = cardHeight * scaleRatio;
  emit("resize", finalWidth, finalHeight);

  return {
    transformOrigin: "top left",
    transform: `scale(${scaleRatio})`
  };
});

defineExpose<DOMRendererInstance>({
  el: () => domRef.value
});
</script>

<style>
@import "common.css";
@import "@cardcodex/sgs-card-resources/dist/index.css";
</style>
