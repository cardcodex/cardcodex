
export type RendererModeType = "svg" | "canvas" | "image" | "dom";


interface IHpData {
  /** 当前 HP */
  hp: number;
  /** 已损失的 HP (MaxHP - 当前HP) */
  drained: number;
  /** 溢出值 (例如护盾或临时HP) */
  overflow: number;
  /** 用于UI显示的限制值 */
  limit: number;
  /** 最大 HP (不含溢出值) */
  maxhp: number;
  /** 总计有效 HP (MaxHP + 溢出值) */
  total: number;
}

/**
 * 从多种格式的输入中解析HP数据。
 * 支持的格式:
 * - 数字: `100`, `80.5` (80 HP, 5 drained)
 * - 字符串 "A/B": `"80/100"` (80 HP, 100 MaxHP)
 * - 字符串 "A/B+C": `"80/100+20"` (80 HP, 100 MaxHP, 20 overflow)
 * - 字符串 "A+C": `"100+20"` (100 HP, 20 overflow, 此时HP被视为MaxHP)
 * @param input 数字或特定格式的字符串
 * @returns {IHpData} 解析后的HP数据对象
 */
export function parseHpData(input: number | string): IHpData {
  let hp: number = 0;
  let maxhp: number = 0;
  let overflow: number = 0;

  // 步骤 1: 将不同格式的输入统一解析为 hp, maxhp, overflow
  if (typeof input === 'string') {
    let match: RegExpMatchArray | null;

    // 格式: "A/B+C" (例如 "80/100+20")
    if ((match = input.match(/^(\d+)\/(\d+)\+(\d+)$/))) {
      hp = parseInt(match[1]!, 10);
      maxhp = parseInt(match[2]!, 10);
      overflow = parseInt(match[3]!, 10);
    }
    // 格式: "A/B" (例如 "80/100" 或过量治疗 "120/100")
    else if ((match = input.match(/^(\d+)\/(\d+)$/))) {
      hp = parseInt(match[1]!, 10);
      maxhp = parseInt(match[2]!, 10);
    }
    // 格式: "A+C" (例如 "100+20")
    else if ((match = input.match(/^(\d+)\+(\d+)$/))) {
      // 原始逻辑：将溢出值加到当前HP上
      const baseHp = parseInt(match[1]!, 10);
      overflow = parseInt(match[2]!, 10);
      hp = baseHp + overflow;
      maxhp = baseHp; // A 被视为最大血量
    }
    // 格式: 数字字符串 (例如 "80.5")
    else {
      const num = parseFloat(input);
      hp = Math.trunc(num);
      maxhp = hp + Math.round((num % 1) * 10);
    }
  }
  // 格式: 数字 (例如 80.5)
  else if (typeof input === 'number') {
    hp = Math.trunc(input);
    // 小数部分被视为 drained, 反推出 maxhp
    maxhp = hp + Math.round((input % 1) * 10);
  }

  // 步骤 2: 根据解析出的值计算 drained 并处理过量治疗
  let drained = maxhp - hp;

  if (drained < 0) {
    overflow += -drained; // 将过量治疗的数值加到 overflow 上
    drained = 0;          // drained 不应为负数
    hp = maxhp;           // HP 被修正为最大值
  }

  // 步骤 3: 计算最终的派生值
  // 原始 limit 逻辑: `Math.min(drained ? Number(hp) : Number(hp) - overflow, 100)`
  // 当 drained > 0 时，基准是 hp；当 drained = 0 时，基准是 hp - overflow (即 maxhp)
  const limitBase = drained > 0 ? hp : maxhp;
  const limit = Math.min(limitBase, 100);
  const total = maxhp + overflow;

  return { hp, drained, overflow, limit, maxhp, total };
}