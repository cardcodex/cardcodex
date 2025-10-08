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
function buildFile(globFiles, filename, directory = distDir) {
  console.log(`💡 aggregating into "${filename}"`);
  const targetFile = path.resolve(directory, filename);
  fs.writeFileSync(targetFile, "");
  let combinedContent = "";
  for (const file of globFiles) {
    if (file === targetFile) continue;
    combinedContent += fs.readFileSync(file, "utf-8") + "\n\n";
  }

  fs.writeFileSync(targetFile, combinedContent);
  console.log(` ✅ "${filename}" has been aggregated.`);
}

async function aggregateCssFiles(directory) {
  const cssFiles = glob.sync(`${directory}/**/*.css`, {
    ignore: ["**/*.inline.css"]
  });
  const cssInlineFiles = glob.sync(`${directory}/**/*.inline.css`);
  buildFile(cssFiles, "index.css", directory);
  buildFile(cssInlineFiles, "index.inline.css", directory);
}

const rollupOptions = (entryFile, isInline) => {
  const entryName = path.basename(entryFile, ".ts");
  const dynamicPrefix = `[data-card-renderer-type="${entryName}"]`;
  const choose = (a, b) => (isInline ? a : b);

  const postcssUrlConfig = choose(
    { url: "inline" },
    {
      url: "copy",
      useHash: true,
      assetsPath: path.resolve(distDir, "assets")
    }
  );

  const extract = choose(path.resolve(distDir, `${entryName}.inline.css`), path.resolve(distDir, `${entryName}.css`));

  const options = {
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
            declarationDir: distDir
          }
        }
      }),
      postcss({
        extract,
        minimize: true,
        plugins: [
          prefixer({
            prefix: dynamicPrefix,
            exclude: [":root", "html", "body"]
          }),
          postcssUrl(postcssUrlConfig)
        ]
      })
    ],
    external: []
  };

  return options;
};

async function build() {
  clearDist(root);
  const pkgJson = await packageJson(root);
  console.log(`📦 building package: ${pkgJson.name}`);

  // 遍历所有入口文件
  let count = 1;
  const total = entryFiles.length;

  for (const entryFile of entryFiles) {
    const entryName = path.basename(entryFile, ".ts");
    console.log(`   🔨 [${count}/${total}] building entry: ${entryName}`);
    const bundle = await rollup(rollupOptions(entryFile, false));
    await bundle.write({
      dir: distDir,
      format: "esm",
      sourcemap: true,
      entryFileNames: `${entryName}.mjs`,
      plugins: [terser()]
    });

    console.log(`   ✅ [${count}/${total}] ${entryName} is built`);
    count += 1;
  }

  count = 1;

  console.log(`💡 Waiting for generating inline css`);
  for (const entryFile of entryFiles) {
    const entryName = path.basename(entryFile, ".ts");
    console.log(`   🔨 [${count}/${total}] building entry: ${entryName} [inline css]`);
    const bundle = await rollup(rollupOptions(entryFile, true));
    await bundle.write({
      dir: distDir,
      format: "esm",
      sourcemap: true,
      entryFileNames: `${entryName}.mjs`,
      plugins: [terser()]
    });

    console.log(`   ✅ [${count}/${total}] ${entryName} [inline css] is built`);
    count += 1;
  }
  changeDirCssURLPath(distDir, { showLog: true });
  aggregateCssFiles(distDir);
  console.log(`🎉 All entries for ${pkgJson.name} are built`);
}

build();
