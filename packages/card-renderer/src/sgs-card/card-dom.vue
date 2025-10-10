<template>
  <div ref="cardRef" :data-card-renderer-type="props.style">
    <div
      v-show="showDOM"
      :class="['card', object.kind]"
      :kingdom="object.kingdom"
      :nickname="object.nickname"
      :name="object.name"
    >
      <div class="illustration">
        <img ref="imageElement" :src="imgSrc" :style="imageStyle" @load="onImageLoad" />
      </div>
      <div class="description-pro-bg"></div>
      <div class="frame">
        <div class="illustration illustration-front">
          <img src="" />
        </div>
        <label class="custom-kingdom" :value="object.kingdom" :length="getTextLength(object.kingdom)">{{
          object.kingdom
        }}</label>
        <ul class="hitpoints" :hp="hpData.hp" :maxhp="hpData.maxhp" :total="hpData.total">
          <li v-for="item in hpData.limit"></li>
          <li v-for="item in hpData.drained" class="drained"></li>
          <li v-for="item in hpData.overflow" class="overflow"></li>
        </ul>
        <h2 class="nickname" :value="object.nickname" :length="getTextLength(object.nickname)">
          {{ object.nickname }}
        </h2>
        <h2 class="name" :value="object.name" :length="getTextLength(object.name)">{{ object.name }}</h2>
        <div
          class="description"
          :class="{ empty: object.skills.length === 0, [skillData.className]: true }"
          :length="skillData.textCount"
          :length10="Math.floor(skillData.textCount / 10)"
          :length100="Math.floor(skillData.textCount / 100)"
        >
          <template v-for="(item, index) in object.skills">
            <label
              :class="['pointer', item?.tag?.join('') || '']"
              :length="getTextLength(item.description)"
              v-html="skillData.names[index]"
            >
            </label>
            <p
              :class="[item?.tag?.join('') || '']"
              v-html="skillData.descs[index]!.replace(/\r?\n/g, '<br/>').replace(/(“)/g, '<b></b>$1')"
            ></p>
          </template>
          <p class="quote" v-if="object.quote">
            <span class="author" v-for="item in object.quote.split(/\r?\n/g)" v-html="item"></span>
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
    <div ref="innerRef" v-show="!showDOM"></div>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import domtoimage from "dom-to-image-more";
import { SgsCardKey } from "@cardcodex/sgs-card-resources";
import { ref, watch, computed, onMounted, type PropType } from "vue";
import { CardDataObject, ResizeCardOptions, SkillObject } from "./vendor/thirdparty";
import { RendererModeType } from "./renderer-tool";

const showDOM = ref(true);
const cardRef = ref<HTMLDivElement>();
const innerRef = ref<HTMLDivElement>();
const object = computed(() => props.config);
const imageElement = ref<HTMLImageElement>();

// 2. 创建响应式变量来存储图片的原始尺寸
const naturalSize = ref({ width: 0, height: 0 });
const hpData = computed(() => parseHpData(object.value.hp));
const skillData = computed(() => parseSkills(object.value.skills));
const commentData = computed(() => parseComment(object.value.comment));
const packageData = computed(() => parsePackage(object.value.package));
const imgSrc = computed(() => (typeof object.value.image === "string" ? object.value.image : object.value.image?.path));

const props = defineProps({
  style: {
    type: String as unknown as PropType<SgsCardKey>,
    required: true
  },
  config: {
    type: Object as PropType<CardDataObject>,
    required: true
  },
  renderMode: {
    type: String as PropType<RendererModeType>,
    default: "dom"
  }
});

function getTextLength(text: string) {
  return text ? text.replace(/<[^>]+>/g, "").length : 0;
}

function parseHpData(input: number | string) {
  let hp = input;
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

function parseSkills(skills: SkillObject[]) {
  const names = skills.map(item => item.name);
  const textCount = skills.reduce((acc, item) => acc + item.description.length, 0);
  const descs = skills.map(item =>
    item.description
      .replace(/♠/g, '<i class="suit suit-spade"></i>')
      .replace(/♥/g, '<i class="suit suit-heart"></i>')
      .replace(/♦/g, '<i class="suit suit-diamond"></i>')
      .replace(/♣/g, '<i class="suit suit-club"></i>')
  );
  const { className, isOverMax } = (() => {
    const TEXT_RANGES: [number, number, number, number] = [80, 140, 200, 215];
    if (textCount < TEXT_RANGES[0]) {
      return {
        className: "description-large",
        isOverMax: false
      };
    } else if (textCount >= TEXT_RANGES[3]) {
      return {
        className: "description-tiny",
        isOverMax: true
      };
    } else if (textCount >= TEXT_RANGES[2]) {
      return {
        className: "description-medium",
        isOverMax: false
      };
    } else {
      return {
        className: "description-small",
        isOverMax: false
      };
    }
  })();
  return { names, textCount, descs, className: "", isOverMax };
}

function fitOverMaxSize() {
  if (!cardRef.value || !skillData.value.isOverMax) return;
  const descElement = cardRef.value.getElementsByClassName("description")[0] as HTMLDivElement;
  const descElementPro = cardRef.value.getElementsByClassName("description-pro-bg")[0];
  if (!descElement || !descElementPro) return;
  let heightText = descElement.offsetHeight - 110 + "px";
  descElementPro.setAttribute("style", "height: " + heightText);
}

function parseComment(comments: string[]) {
  if (comments.length == 3) {
    return {
      left: comments[0],
      center: comments[1],
      right: comments[2],
      show: true
    };
  } else if (comments.length == 2) {
    return {
      left: comments[0],
      center: "",
      right: comments[1],
      show: true
    };
  } else if (comments.length == 1) {
    return {
      left: "",
      center: "",
      right: comments[1],
      show: true
    };
  } else {
    return {
      left: "",
      center: "",
      right: "",
      show: false
    };
  }
}

function parsePackage(pkg: string) {
  if (pkg.length > 8 && pkg.indexOf(":") >= 0) {
    return {
      html: '<img src="' + pkg + '">',
      bind: {
        image: ""
      }
    };
  } else {
    return {
      html: pkg,
      bind: {
        length: getTextLength(pkg),
        value: pkg
      }
    };
  }
}

function getFileURL(file: Blob | MediaSource): string {
  if ((window as any).createObjectURL != undefined) {
    return (window as any).createObjectURL(file);
  } else if (window.URL != undefined) {
    return window.URL.createObjectURL(file);
  } else {
    return window.webkitURL.createObjectURL(file);
  }
}

function onImageLoad() {
  if (imageElement.value) {
    naturalSize.value.width = imageElement.value.naturalWidth;
    naturalSize.value.height = imageElement.value.naturalHeight;
  }
}

const imageStyle = computed(() => {
  if (typeof object.value.image === "string" || naturalSize.value.width === 0) {
    return {};
  }
  const { scale = 1, x = 0, y = 0 } = object.value.image?.adjust || {};
  return {
    top: `${y}px`,
    left: `${x}px`,
    width: `${naturalSize.value.width * scale}px`,
    height: `${naturalSize.value.height * scale}px`
  };
});

function renderMode() {
  const fnMap: Record<RendererModeType, null | ((el: HTMLElement) => Promise<any>)> = {
    dom: null,
    svg: domtoimage.toSvg,
    image: domtoimage.toPng,
    canvas: domtoimage.toCanvas
  };

  const fn = fnMap[props.renderMode];
  if (!fn) return;
  showDOM.value = true;
  fn(cardRef.value!)
    .then(function (result: string | HTMLElement) {
      if (typeof result === "string") {
        const image = new Image();
        image.src = result;
        return image;
      }
      return result;
    })
    .then((el: HTMLElement) => {
      innerRef.value!.innerHTML = "";
      innerRef.value!.appendChild(el);
      showDOM.value = false;
    });
}

watch(
  [() => object.value, () => props.renderMode, () => props.style],
  () => {
    renderMode();
  },
  {
    deep: true
  }
);

onMounted(() => {
  fitOverMaxSize();
  renderMode();
});
</script>

<style scoped>
@import "./common.css";
@import "@cardcodex/sgs-card-resources/dist/index.css";
</style>
