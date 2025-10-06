import { getRollupConfigs } from "./base.js";
import { watch } from "rollup";

async function dev() {
  const configs = await getRollupConfigs();
  for (const name in configs) {
    const config = configs[name];
  }
}

dev();
