import { getRoot } from "../../../scripts/utils.js";
import { buildHelper } from "../../../scripts/build-tool.js";
import { changeDirCssURLPath } from "../../../scripts/utils.js";

import importRaw from "./rollup-plugin-import-raw.js";

const root = getRoot(import.meta.url);

function rollupOptionsFn(rollupOptions) {
  for (const output of rollupOptions.output) {
    output.globals = {
      vue: "Vue"
    };
  }

  // add first plugin
  rollupOptions.plugins.push(importRaw());
  return rollupOptions;
}

const customOptions = {
  external: ["vue"]
};

async function main() {
  await buildHelper(root);

  const { build, distDir } = await buildHelper(root, customOptions, rollupOptionsFn);
  await build({ inspectConfig: false });

  changeDirCssURLPath(distDir, {
    showLog: true,
    globPattern: "**/*.js"
  });
}

main();
