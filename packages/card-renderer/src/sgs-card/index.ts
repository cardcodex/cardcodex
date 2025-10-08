import { defineCustomElement } from "vue";
import SgsCardDOMRenderer from "./dom-renderer.vue";
import { type SgsCardKey } from "@cardcodex/sgs-card-resources";
import { type CardDataObject, type ResizeCardOptions } from "./vendor/thirdparty.js";

export function registerSgsCardShadowDOMRenderer(tagName: string = "sgs-card-shadow-dom-renderer"): void {
  if (typeof window !== "undefined" && !customElements.get(tagName)) {
    const SgsCardShadowDOMRenderer = defineCustomElement(SgsCardDOMRenderer);
    customElements.define(tagName, SgsCardShadowDOMRenderer);
  }
}

export interface CardRendererProps {
  config: CardDataObject;
  type: SgsCardKey;
  resizeOptions?: ResizeCardOptions;
}

export interface CardRendererInstance {
  resize: () => void;
}

export type { CardDataObject, ResizeCardOptions };
export { SgsCardDOMRenderer };
