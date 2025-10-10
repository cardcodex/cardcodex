import { SgsCardKey } from "@cardcodex/sgs-card-resources";

export enum RenderMode {
  /** DOM渲染 */
  DOM = "dom",
  /** Canvas渲染 */
  Canvas = "canvas",
  /** SVG渲染 */
  SVG = "svg",
  /** png 渲染 */
  Image = "image",

};

/**
 * 技能标签
 */
export enum SkillTag {
  /** 主公技 */
  Lord = "lord",
  /** 锁定技 */
  Compulsory = "compulsory",
  /** 限定技 */
  Limit = "limit",
  /** 觉醒技 */
  Wake = "wake",
}

export interface SkillConfig {
  name: string;
  description: string;
  tag?: SkillTag[];
}

export interface ImageConfig {
  path: string;
  pathFront?: string;
  adjust?: {
    x?: number;
    y?: number;
    scale?: number;
  };
}

export enum Group {
  /** 魏 */
  WEI = "wei",
  /** 蜀 */
  SHU = "shu",
  /** 吴 */
  WU = "wu",
  /** 群 */
  QUN = "qun",
  /** 晋 */
  JIN = "jin",
  /** 神 */
  GOD = "god",
  /** 魏 主公 */
  WEI_LORD = "wei lord",
  /** 蜀 主公 */
  SHU_LORD = "shu lord",
  /** 吴 主公 */
  WU_LORD = "wu lord",
  /** 群 主公 */
  QUN_LORD = "qun lord",
  /** 晋 主公 */
  JIN_LORD = "jin lord"
}

export type HpType = number | string | [hp: number, maxHp: number | undefined, armor: number | undefined];

export interface CardConfig {
  group: Group;
  /**
   *  经典武将牌左上角大字标识，可以自定义
   */
  badge: string;
  name: string;
  nameStyle?: {
    moveX?: number;
    moveY?: number;
    scale?: number;
  };
  title: string;
  /** @example 
   * [3, 5, 2] 等价传入 "3/5+2"，表示 体力=3 体力上限=5 护甲=2
   * [3, 0, 2] 等价传入 "3+2"，表示 体力=3 护甲=2
   * [3, 5] 等价传入 "3/5"，表示 体力=3 体力上限=5
   * [3] 等价传入 "3" 或者数字 3，表示 体力=3
   * 也可以使用 `defineHpConfig` 函数来生成
  */
  hp: HpType;
  quote: string;
  package: string;
  comments: string[];
  skills: SkillConfig[];
  image: string | ImageConfig;
  fontSize?: "tiny" | "small" | "normal" | "large";
}

export interface StyledCardConfig extends CardConfig {
  style: SgsCardKey;
}

export function defineCardConfig({ config }: { config: CardConfig; }): CardConfig {
  return config;
}

export type SizeOptions = {
  width: number;
  height?: never;
} | {
  height: number;
  width?: never;
};

export interface DOMRendererInstance {
  el: () => HTMLElement | undefined;
}

export interface CardRendererInstance extends Omit<DOMRendererInstance, "el"> {
}

/**
 * 
 * @param hp 体力值
 * @param maxHp 体力上限，可以不传，或者传 0
 * @param armor 护甲值
 * @returns 
 */
export function defineHpConfig(hp: number, maxHp?: number, armor?: number): string {
  if (armor && maxHp) {
    return `${hp}/${maxHp}+${armor}`;
  }
  if (armor && !maxHp) {
    return `${hp}+${armor}`;
  }
  if (maxHp) {
    return `${hp}/${maxHp}`;
  }
  return `${hp}`;
}