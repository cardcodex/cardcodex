import { getRollupConfigs } from "./buildBase.js";
import { watch } from "rollup";

async function dev() {
  const configs = await getRollupConfigs();
  for (const name in configs) {
    const config = configs[name];
    const watcher = watch(
      config.output.map(o => ({
        input: config.input,
        plugins: config.plugins,
        external: config.external,
        output: o,
        watch: config.watch
      }))
    );
    watcher.on("event", event => {
      if (event.code === "START") {
        console.log(`👁️ start watching: ${name}`);
      } else if (event.code === "ERROR") {
        console.error(`❌ ${name} package build error:`, event.error);
      } else if (event.code === "BUNDLE_START") {
        console.log(`📦 building package: ${name}`);
      } else if (event.code === "BUNDLE_END") {
        console.log(`✅ ${name} is built`);
      }
    });
  }
}

dev();
