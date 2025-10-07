// src/shims-vue.d.ts

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*?raw" {
  const content: string;
  export default content;
}
