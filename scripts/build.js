import { rollup } from "rollup";
import terser from "@rollup/plugin-terser";
import { getRollupConfigs, clearDist } from "./buildBase.js";

async function build() {
  const configs = await getRollupConfigs();
  for (const name in configs) {
    clearDist(name);
    const config = configs[name];
    console.log(`📦 building package: ${name}`);
    const bundle = await rollup({
      input: config.input,
      plugins: [...config.plugins, terser()],
      external: config.external
    });
    const tasks = [];
    for (const output of config.output) {
      tasks.push(bundle.write(output));
    }
    await Promise.all(tasks);
    console.log(`✅ ${name} is built`);
  }
}

build();
