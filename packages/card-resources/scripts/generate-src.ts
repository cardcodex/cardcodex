// scripts/generate-index.ts

import fs from "fs";
import URL from "url";
import path from "path";
import { glob } from "glob";

const __filename = URL.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resourcesDir = path.join(__dirname, "../resources");
const srcDir = path.join(__dirname, "../src");

// --- 步骤 1: 清理并重建 src 目录 ---
console.log(`Cleaning directory: ${srcDir}`);
// 检查 src 目录是否存在，如果存在则删除
if (fs.existsSync(srcDir)) {
  fs.rmSync(srcDir, { recursive: true, force: true });
}
// 重新创建空的 src 目录
fs.mkdirSync(srcDir);
console.log("Directory cleaned and recreated.");

const outputIndexFile = path.join(srcDir, "index.ts");

const styleDirs = fs
  .readdirSync(resourcesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== "fonts")
  .map(dirent => dirent.name);

// --- 步骤 2: 为每个样式包生成更丰富的入口文件 ---
styleDirs.forEach(dir => {
  const styleDirPath = path.join(resourcesDir, dir);
  const imagesDir = path.join(styleDirPath, "images");
  const assetDir = path.join(styleDirPath, "assets");
  if (fs.existsSync(assetDir)) {
    fs.rmSync(assetDir, { recursive: true, force: true });
  }

  const cssImport = `import '../resources/${dir}/style.css';\n`;

  let imageImports = "";
  let imageExports = "export const images = {\n";

  if (fs.existsSync(imagesDir)) {
    const normalizedImagesDir = imagesDir.replace(/\\/g, "/");
    const imageFiles = glob.sync(`${normalizedImagesDir}/**/*.{png,svg,jpg,jpeg,gif}`);
    imageFiles.forEach((file, index) => {
      const baseName = path.basename(file, path.extname(file));
      const importName = `image${index}`;
      imageImports += `import ${importName} from '../resources/${dir}/images/${path.basename(file)}';\n`;
      imageExports += `  '${baseName.replace(/-/g, "_")}': ${importName},\n`; // 将'-'替换为'_'以得到有效的变量名
    });
  }
  imageExports += "};\n";

  const styleEntryFileContent = `// Auto-generated for ${dir}\n${cssImport}\n${imageImports}\n${imageExports}`;
  const outputStyleEntryPath = path.join(srcDir, `${dir}.ts`);
  fs.writeFileSync(outputStyleEntryPath, styleEntryFileContent, "utf8");
  console.log(`✅ Generated rich entry file: src/${dir}.ts`);
});

// --- 步骤 3: 生成主 index.ts (保持不变) ---
const stylePacksExport = `
export const stylePacks = {
${styleDirs.map(dir => `  '${dir.toUpperCase().replace(/-/g, "_")}': '${dir}',`).join("\n")}
} as const;
`;
const typesExport = `
export type StylePackName = typeof stylePacks[keyof typeof stylePacks];
`;
const mainIndexContent = `// This file is auto-generated to export style names.
${stylePacksExport}
${typesExport}
`;
fs.writeFileSync(outputIndexFile, mainIndexContent, "utf8");
console.log(`✅ Successfully generated main index file: src/index.ts`);
