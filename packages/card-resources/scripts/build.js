// build.js
import path from "node:path";
import URL from "node:url";
import { rollup } from "rollup";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import postcssUrl from "postcss-url";
import { glob } from "glob";
import { packageJson, clearDist } from "../../../scripts/utils.js";

const __filename = URL.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "../");
const distDir = path.resolve(root, "dist");
const srcDir = path.resolve(root, "src").replace(/\\/g, "/");
const tsconfig = path.resolve(root, "tsconfig.json");
const entryFiles = glob.sync(`${srcDir}/**/*.ts`);

async function build() {
  clearDist(root);
  const pkgJson = await packageJson(root);
  console.log(`📦 building package: ${pkgJson.name}`);

  // 遍历所有入口文件
  for (const entryFile of entryFiles) {
    const entryName = path.basename(entryFile, ".ts");
    console.log(`   🔨 building entry: ${entryName}`);

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
          // ✅ 动态生成 CSS 文件名
          extract: path.resolve(distDir, `${entryName}.css`),
          minimize: true,
          plugins: [
            postcssUrl({
              url: "copy",
              assetsPath: path.resolve(distDir, "assets"),
              useHash: true
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

    console.log(`   ✅ ${entryName} is built`);
  }
  console.log(`🎉 All entries for ${pkgJson.name} are built`);
}

build();
