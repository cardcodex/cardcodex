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

let count = 1;
const total = styleDirs.length;
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
  console.log(`✅ [${count}/${total}] Generated rich entry file: src/${dir}.ts`);
  count += 1;
});

// --- 步骤 3: 生成主 index.ts (保持不变) ---
const jsImport =
  `${styleDirs.map(dir => `import * as ${dir.toUpperCase().replace(/-/g, "_")} from './${dir}';`).join("\n")}` as const;

const jsExport = `export { ${styleDirs.map(dir => dir.toUpperCase().replace(/-/g, "_")).join(", ")} }` as const;

const stylePacksExport = `export const CardResources = {
${styleDirs.map(dir => `  '${dir.toUpperCase().replace(/-/g, "_")}': ${dir.toUpperCase().replace(/-/g, "_")},`).join("\n")}
} as const;`;

const typesExport = `
export type CardResourcesTypes = typeof CardResources[keyof typeof CardResources];
`;
const mainIndexContent = `// This file is auto-generated to export style names.
${jsImport}

${jsExport}

${stylePacksExport}

${typesExport}
`;
fs.writeFileSync(outputIndexFile, mainIndexContent, "utf8");
console.log(`✅ Successfully generated main index file: src/index.ts`);
