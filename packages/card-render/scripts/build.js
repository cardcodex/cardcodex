import { buildHelper, getRoot } from "../../../scripts/build-tool.js";

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
  const { build } = await buildHelper(root, customOptions, rollupOptionsFn);
  await build({ inspectConfig: true });
}

main();
