// thirdparty.d.ts

/** 技能标签的联合类型 */
export type SkillTag = "lord" | "compulsory" | "limit" | "wake";

/** 技能对象结构 */
export interface SkillObject {
  name: string;
  description: string;
  tag?: SkillTag[];
}

/** 插图调整对象结构 */
export interface IllustrationAdjust {
  x: number;
  y: number;
  scale: number;
}

/** 插图对象结构 */
export interface IllustrationObject {
  path: string;
  pathFront?: string;
  adjust: IllustrationAdjust;
}

/** 文本字号选项 */
export type TextSizeType = "auto" | "tiny" | "small" | "normal" | "large";

/**
 * 描述一张卡片所需的所有数据的核心对象结构
 */
export interface CardDataObject {
  kingdom: string;
  name: string | { text: string; font?: string };
  nickname: string;
  /** 例如 "3/5" 或 3.5 */
  hitpoints: number | string;
  style: string;
  illustration: string | IllustrationObject;
  skills: SkillObject[];
  quote: string;
  comment: string[];
  package: string;
  textSize: TextSizeType;
  extra?: { [key: string]: string };
}

// --- 假设存在的全局变量 (根据代码使用情况推断) ---

/** 模板信息 */
interface TemplateInfo {
  path: string;
  name: string;
}

/** 自定义字体信息 */
interface CustomFont {
  name: string;
  font?: string; // 本地字体名
  file?: string; // 字体文件名
}

declare global {
  // 这些变量在你的JS代码中被使用，但未在代码片段中定义
  const TEMPLATES: TemplateInfo[];
  const CUSTOM_FONTS: CustomFont[];
  // 外部库 html2canvas 的简单声明
  function html2canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement>;
}

// --- 模块内可修改的全局变量 ---

/** 额外字段的键名数组 */
declare var EXTRA_SEGMENTS: string[];
/** 技能标签数组 */
declare var SKILL_TAGS: SkillTag[];
/** 文本范围阈值数组 */
declare var TEXT_RANGES: number[];
/** 当前正在处理的卡片数据对象 */
declare var currentItem: Partial<CardDataObject>;
/** 模板相关的 Blob URL 数组 */
declare var templateBlobUrls: string[];
/** 卡片相关的 Blob URL 数组 */
declare var cardBlobUrls: string[];
/** 是否开启防止跨域模式 */
declare var PREVENT_CORS_MODE: boolean;

// --- 导出的函数声明 ---

/** 初始化页面，加载模板和字体 */
export function prepare(): void;

/** 添加一个新的技能输入框 */
export function addSkill(): void;

/** 移除最后一个技能输入框 */
export function removeSkill(): void;

/**
 * 根据 File 对象创建 Object URL
 * @param file 文件对象
 * @returns 返回创建的 URL 字符串
 */
export function getFileURL(file: Blob | File): string;

/**
 * 释放一个之前由 createObjectURL 创建的 Object URL
 * @param url 要释放的 URL 字符串
 */
export function revokeURL(url: string): void;

/** 从文件输入框获取图片路径并设置到在线路径输入框 */
export function getImagePath(): void;
export function getImagePathFront(): void;
export function getImagePathPackage(): void;

/** 从表单输入生成并创建卡片 */
export function createFromInput(): void;

/** 从 JSON 数据创建卡片 */
export function createFromJson(): void;

/** 将表单输入导出为 JSON 格式 */
export function exportJson(): void;

/** 从表单输入生成卡片数据对象 */
export function generateFromInput(): CardDataObject;

/**
 * 加载并应用指定的卡片模板
 * @param template 模板路径
 */
export function loadTemplate(template: string): void;

/**
 * 反馈图像调整后的参数
 * @param image 被调整的图像元素
 */
export function imageAdjustFeedback(image: HTMLImageElement): void;

/**
 * 替换字符串中的特殊字符为 HTML 实体
 * @param str 输入字符串
 * @returns 替换后的字符串
 */
export function replaceSpecialCharacters(str: string): string;

/**
 * 根据卡片数据对象创建卡片DOM
 * @param object 卡片数据对象
 */
export function createCard(object: CardDataObject): void;

/** 调整卡片使其适应窗口大小 */
export function zoomCard(): void;

/** 切换表单界面和 JSON 界面 */
export function switchInterface(this: HTMLInputElement): void;

/** 将 JSON 数据导入到表单中 */
export function exportForm(): void;

/** 将当前卡片渲染为图片 */
export function createImage(): void;

/**
 * 转换垂直文本中的特殊符号
 * @param element 包含垂直文本的元素
 */
export function convertVerticalText(element: HTMLElement): void;

/**
 * 转换元素内文本节点的内容
 * @param element 目标元素
 * @param pattern 正则表达式
 * @param replace 替换用的字符串或回调函数
 */
export function convertText(
  element: HTMLElement,
  pattern: RegExp,
  replace: string | ((substring: string, ...args: any[]) => string)
): void;

/**
 * 获取文本的有效长度（去除HTML标签）
 * @param text 输入文本
 * @returns 文本长度
 */
export function getTextLength(text: string): number;

/** 隐藏图片输出区域 */
export function hideOutput(): void;

/** 在主界面和卡片预览之间滚动 */
export function scrollPage(): void;

/**
 * 弹出提示气泡
 * @param event 鼠标事件
 */
export function popupHintBalloon(event: MouseEvent): void;

/** 导出当前卡片的独立HTML文件内容 */
export function exportCardHTML(): string;

/** 在新标签页中打开卡片的独立HTML文件 */
export function openCardHTML(): void;

/** 开始裁剪图片 */
export function startCrop(): void;

/**
 * 显示或隐藏图片裁剪面板
 * @param show 是否显示
 */
export function showTrimPanel(show: boolean): void;

/**
 * （移动版）加载并解包资源
 * @param style CSSStyleDeclaration 对象
 */
export function loadMobileSrcs(style: CSSStyleDeclaration): void;

/** 转换通用样式 */
export function convertCommonStyle(): void;

/** 根据容器大小设置图片尺寸 */
export function setContainImageSize(): void;

/** 加载字体包 */
export function loadFontPackage(): void;

/**
 * 设置富文本编辑工具栏
 * @param element 目标输入框，为 null 时隐藏
 */
export function setTextToolbar(element: HTMLTextAreaElement | null): void;

/**
 * 为选中文本切换标签对（如 <b>...</b>）
 * @param prefix 标签前缀
 * @param postfix 标签后缀
 */
export function toggleTagPairs(prefix: string, postfix: string): void;

/**
 * 处理编辑器的快捷键
 * @param event 键盘事件
 */
export function editHotkey(event: KeyboardEvent): void;
