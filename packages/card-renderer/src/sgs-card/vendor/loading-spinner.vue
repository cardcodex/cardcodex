<template>
  <div class="loading-spinner" :class="{ 'loading-spinner--overlay': overlay }">
    <div class="loading-spinner__container">
      <div class="loading-spinner__spinner" :style="spinnerStyle">
        <div class="loading-spinner__circle"></div>
      </div>
      <div v-if="text" class="loading-spinner__text" :style="textStyle">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  /** 加载文本 */
  text?: string;
  /** 加载器大小 */
  size?: number | string;
  /** 加载器颜色 */
  color?: string;
  /** 文本颜色 */
  textColor?: string;
  /** 是否显示为覆盖层 */
  overlay?: boolean;
  /** 动画速度（秒） */
  speed?: number;
  border?: number;
}

const props = withDefaults(defineProps<Props>(), {
  text: "",
  size: 60,
  color: "#409eff",
  textColor: "#666",
  overlay: false,
  speed: 1,
  border: 5
});

const spinnerStyle = computed(() => ({
  width: typeof props.size === "number" ? `${props.size}px` : props.size,
  height: typeof props.size === "number" ? `${props.size}px` : props.size,
  "--spinner-color": props.color,
  "--spinner-border": `${props.border}px`,
  "--animation-duration": `${props.speed}s`
}));

const textStyle = computed(() => ({
  color: props.textColor,
  fontSize: typeof props.size === "number" ? `${Math.max(12, props.size * 0.3)}px` : "14px"
}));
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loading-spinner--overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.loading-spinner__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-spinner__spinner {
  position: relative;
  display: inline-block;
}

.loading-spinner__circle {
  width: 100%;
  height: 100%;
  border: var(--spinner-border) solid transparent;
  border-top: var(--spinner-border) solid var(--spinner-color, #409eff);
  border-radius: 50%;
  animation: loading-spin var(--animation-duration, 1s) linear infinite;
}

.loading-spinner__text {
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
  margin: 0;
  white-space: nowrap;
}

@keyframes loading-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-spinner__text {
    font-size: 12px;
  }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .loading-spinner--overlay {
    background-color: rgba(0, 0, 0, 0.8);
  }

  .loading-spinner__text {
    color: #ccc;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .loading-spinner__circle {
    border-width: 4px;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner__circle {
    animation-duration: 2s;
  }
}
</style>
