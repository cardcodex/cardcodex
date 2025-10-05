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
import postcssUrl from "postcss-url"; // 导入 postcss-url
import { glob } from "glob";
import { clearDist } from "./bBase.js";

const __filename = URL.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packages = ["card-resources"];
clearDist(packages[0]);
const pkgDir = path.resolve(__dirname, "../packages", packages[0]);
const distDir = path.resolve(pkgDir, "dist");
// 规范化 srcDir 路径并转换为正斜杠，以兼容 glob
const srcDir = path.resolve(pkgDir, "src").replace(/\\/g, "/");
const tsconfig = path.resolve(pkgDir, "tsconfig.json");
const entryFiles = glob.sync(`${srcDir}/**/*.ts`);

const config = {
  input: entryFiles,
  output: [
    {
      dir: distDir,
      format: "esm",
      sourcemap: true,
      entryFileNames: "[name].mjs",
      // 将 terser 放在 output 的 plugins 中是更好的实践
      plugins: [terser()]
    }
    // 如果需要，可以在这里添加其他输出格式，例如 CJS
    // {
    //   dir: distDir,
    //   format: "cjs",
    //   sourcemap: true,
    //   entryFileNames: "[name].cjs",
    //   plugins: [terser()]
    // }
  ],
  plugins: [
    image(),
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: distDir
        }
      }
    }),
    postcss({
      // [name] 占位符会根据入口文件名生成对应的 CSS 文件
      extract: path.resolve(distDir, "[name].css"),
      minimize: true,
      plugins: [
        postcssUrl({
          url: "copy",
          assetsPath: path.resolve(distDir, "assets"), // 确保资源输出到 dist/assets
          useHash: true
        })
      ]
    })
  ],
  external: []
};

async function build() {
  const name = packages[0];
  console.log(`📦 building package: ${name}`);
  const bundle = await rollup({
    input: config.input,
    plugins: config.plugins,
    external: config.external
  });

  const tasks = [];
  for (const output of config.output) {
    tasks.push(bundle.write(output));
  }
  await Promise.all(tasks);

  console.log(`✅ ${name} is built`);
}

build();
