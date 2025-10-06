import fs from "node:fs";
import URL from "node:url";
import path from "node:path";
import vue from "@vitejs/plugin-vue";
import alias from "@rollup/plugin-alias";
import postcssImport from "postcss-import";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";

import deepmerge from "deepmerge";
import { rollup, watch } from "rollup";
import { makeIdentifier } from "./utils.js";

export async function packageJson(root) {
  const jsonPath = path.resolve(root, "package.json");
  const content = await fs.promises.readFile(jsonPath, "utf-8");
  return JSON.parse(content);
}

export function clearDist(root) {
  const dist = path.resolve(root, "dist");
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true, force: true });
    console.log("🗑️  remove dist directory at: " + dist);
  }
}

export function getRoot(metaURL = import.meta.url) {
  const __filename = URL.fileURLToPath(metaURL);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, "../");
}

export async function buildHelper(root, customOptions, optionFn) {
  const pkgJson = await packageJson(root);
  const tsconfig = path.resolve(root, "tsconfig.json");
  const srcDir = path.resolve(root, "./src");
  const distDir = path.resolve(root, "./dist");
  const entry = path.resolve(root, "./src/index.ts");
  const outputName = makeIdentifier(customOptions?.outputName ?? pkgJson?.buildOptions?.name ?? pkgJson.name);
  const rollupOptions = {
    input: entry,
    plugins: [
      alias({
        entries: [
          {
            find: "@",
            replacement: srcDir
          }
        ]
      }),
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig,
        compilerOptions: {
          outDir: distDir
        }
      }),
      vue({
        template: {
          compilerOptions: {
            nodeTransforms: [
              node => {
                // 过滤掉所有 data-test-id 属性
                if (node.type === 1) {
                  node.props = node.props.filter(prop => prop.type === 6 && prop.name !== "data-test-id");
                }
              }
            ]
          }
        }
      }),
      postcss({
        minimize: true,
        plugins: [postcssImport()]
      }),
      terser()
    ]
  };
  rollupOptions.output = (pkgJson?.buildOptions?.formats ?? []).map(format => ({
    format,
    sourcemap: true,
    name: outputName,
    file: path.resolve(distDir, `index.${format}.js`)
  }));
  rollupOptions.watch = {
    include: path.resolve(root, "src/**"),
    exclude: path.resolve(root, "node_modules/**"),
    clearScreen: false
  };

  const mergedOptions = deepmerge(rollupOptions, customOptions || {});
  if (typeof optionFn === "function") {
    optionFn(mergedOptions);
  }

  const buildFn = async (options = { inspectConfig: false }) => {
    clearDist(root);
    console.log(`📦 building package: ${outputName}`);
    if (options.inspectConfig) {
      console.log(`🔧 check rollup options: -------\n${JSON.stringify(mergedOptions, null, 2)}\n--------\n`);
    }
    const bundle = await rollup(mergedOptions);
    const tasks = [];
    for (const output of mergedOptions.output) {
      tasks.push(bundle.write(output));
    }
    await Promise.all(tasks);
    console.log(`✅ ${outputName} is built`);
  };

  const watchFn = async (options = { inspectConfig: false }) => {
    const watcher = watch(mergedOptions);
    watcher.on("event", event => {
      if (event.code === "START") {
        console.log(`👁️ start watching: ${outputName}`);
      } else if (event.code === "ERROR") {
        console.error(`❌ ${outputName} package build error:`, event.error);
      } else if (event.code === "BUNDLE_START") {
        console.log(`📦 building package: ${outputName}`);
      } else if (event.code === "BUNDLE_END") {
        console.log(`✅ ${outputName} is built`);
      }
    });
  };

  return {
    build: buildFn,
    watch: watchFn,
    rollupOptions: mergedOptions
  };
}
