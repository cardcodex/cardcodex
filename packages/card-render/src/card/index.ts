import CardRenderer from "./card-renderer.vue";
import { type CardResourcesValuesType } from "@cardcodex/card-resources";
import { type CardDataObject, type ResizeCardOptions } from "./vendor/thirdparty.js";

export interface CardRendererProps {
  config: CardDataObject;
  type: CardResourcesValuesType;
  resizeOptions?: ResizeCardOptions;
}

export interface CardRendererInstance {
  resize: () => void;
}

export type { CardDataObject, ResizeCardOptions };
export { CardRenderer };
