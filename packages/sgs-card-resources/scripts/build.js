import fs from "node:fs";
import URL from "node:url";
import path from "node:path";
import postcssUrl from "postcss-url";
import image from "@rollup/plugin-image";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import commonjs from "@rollup/plugin-commonjs";
import prefixer from "postcss-prefix-selector";
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";

import { glob } from "glob";
import { rollup } from "rollup";
import { packageJson, clearDist, changeDirCssURLPath } from "../../../scripts/utils.js";

const __filename = URL.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "../");
const distDir = path.resolve(root, "dist");
const srcDir = path.resolve(root, "src").replace(/\\/g, "/");
const tsconfig = path.resolve(root, "tsconfig.json");
const entryFiles = glob.sync(`${srcDir}/**/*.ts`);

// 单独处理 index.css
async function aggregateCssFiles(directory) {
  console.log("💡 aggregating CSS files into index.css");
  const cssFiles = glob.sync(`${directory}/**/*.css`);
  const indexCssFile = path.resolve(directory, "index.css");
  fs.writeFileSync(indexCssFile, "");

  let combinedCss = "";
  for (const file of cssFiles) {
    // 读取每个CSS文件的内容
    if (file === indexCssFile) continue;
    combinedCss += fs.readFileSync(file, "utf-8") + "\n\n";
  }

  // 将合并后的内容写入 index.css
  fs.writeFileSync(path.resolve(directory, "index.css"), combinedCss);
  console.log(" ✅ index.css has been aggregated.");
}

async function build() {
  clearDist(root);
  const pkgJson = await packageJson(root);
  console.log(`📦 building package: ${pkgJson.name}`);

  // 遍历所有入口文件
  let count = 1;
  const total = entryFiles.length;
  for (const entryFile of entryFiles) {
    const entryName = path.basename(entryFile, ".ts");
    const dynamicPrefix = `[data-card-renderer-type="${entryName}"]`;
    console.log(`   🔨 [${count}/${total}] building entry: ${entryName}`);

    const bundle = await rollup({
      // 每次构建只处理一个入口文件
      input: entryFile,
      plugins: [
        image(),
        nodeResolve(),
        commonjs(),
        typescript({
          tsconfig,
          tsconfigOverride: {
            compilerOptions: {
              declaration: true,
              // 让类型声明文件也输出到 dist 根目录，以便后续合并
              declarationDir: distDir
            }
          }
        }),
        postcss({
          extract: path.resolve(distDir, `${entryName}.css`),
          minimize: true,
          plugins: [
            prefixer({
              prefix: dynamicPrefix,
              exclude: [":root", "html", "body"]
            }),
            postcssUrl({
              url: "copy",
              useHash: true,
              assetsPath: path.resolve(distDir, "assets")
            })
          ]
        })
      ],
      external: []
    });

    // 为当前入口写入打包文件
    await bundle.write({
      dir: distDir,
      format: "esm",
      sourcemap: true,
      // JS 文件名也根据入口名称动态生成
      entryFileNames: `${entryName}.mjs`,
      plugins: [terser()]
    });

    console.log(`   ✅ [${count}/${total}] ${entryName} is built`);
    count += 1;
  }
  changeDirCssURLPath(distDir, { showLog: true });
  aggregateCssFiles(distDir);
  console.log(`🎉 All entries for ${pkgJson.name} are built`);
}

build();
