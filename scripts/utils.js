import fs from "node:fs";
import URL from "node:url";
import path from "node:path";

export function getRoot(metaURL = import.meta.url) {
  const __filename = URL.fileURLToPath(metaURL);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, "../");
}

/**
 * 将 package.json 的 name 转换为一个有效的大驼峰 (PascalCase) JS 标识符
 * - 如果是 scoped package，则会移除 scope
 * - 将 kebab-case (短横线) 和 snake_case (下划线) 转换为 PascalCase
 *
 * @param name 包名 name 字符串。
 * @returns 转换后的有效 JS 标识符字符串。
 */
export function makeIdentifier(name) {
  // 1. 处理无效输入
  if (!name || typeof name !== "string") {
    return "";
  }

  // 2. 如果是 scoped package，移除 scope 部分
  // (例如，从 '@my-scope/cool-package' 提取 'cool-package')
  const scopeIndex = name.lastIndexOf("/");
  if (scopeIndex !== -1 && name.startsWith("@")) {
    name = name.substring(scopeIndex + 1);
  }

  // 3. 转换为大驼峰命名
  return (
    name
      // 使用正则表达式将短横线和下划线替换为空格
      .replace(/[-_]/g, " ")
      // 匹配每个单词的首字母并将其转为大写
      .replace(/(^|\s)\w/g, match => match.toUpperCase())
      // 移除所有空格，拼接成最终结果
      .replace(/\s/g, "")
  );
}

export function getPackageRoots() {
  const root = getRoot(import.meta.url);
  const pkgDir = path.resolve(root, "./packages");
  const pkgNames = fs.readdirSync(pkgDir);
  return {
    names: pkgNames,
    roots: pkgNames.map(name => path.resolve(pkgDir, name))
  };
}
