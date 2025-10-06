import { getRoot } from "../../../scripts/utils.js";
import { buildHelper } from "../../../scripts/build-tool.js";
import { changeDirCssURLPath } from "../../../scripts/utils.js";

const root = getRoot(import.meta.url);

function rollupOptionsFn(rollupOptions) {
  for (const output of rollupOptions.output) {
    output.globals = {
      vue: "Vue"
    };
  }
}

async function main() {
  await buildHelper(root);
  const customOptions = {
    external: ["vue"]
  };
  const { build, distDir } = await buildHelper(root, {}, rollupOptionsFn);
  await build({ inspectConfig: false });

  changeDirCssURLPath(distDir, {
    showLog: true,
    globPattern: "**/*.js"
  });
}

main();
