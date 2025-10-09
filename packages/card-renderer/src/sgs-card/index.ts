import SgsCardDOMRenderer from "./dom-renderer.vue";
import SgsCardShadowDOMRenderer from "./shawdow-dom-renderer.vue";
import { type SgsCardKey } from "@cardcodex/sgs-card-resources";
import { type CardDataObject, type ResizeCardOptions } from "./vendor/thirdparty.js";

export interface CardRendererProps {
  config: CardDataObject;
  type: SgsCardKey;
  resizeOptions?: ResizeCardOptions;
}

export interface CardRendererInstance {
  resize: () => void;
  exportImage: () => void;
  isRendering: () => boolean;
}

export type { CardDataObject, ResizeCardOptions };
export { SgsCardDOMRenderer };
