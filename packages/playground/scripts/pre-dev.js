import URL from "node:url";
import fse from "fs-extra";
import path from "node:path";

const root = path.dirname(URL.fileURLToPath(import.meta.url));

const d = s => path.resolve(root, s);

const distDir = {
  assets: d("../../card-render/dist/assets")
};

const publicDir = {
  assets: d("../public/assets")
};

async function main() {
  fse.rmSync(publicDir.assets, { recursive: true, force: true });
  await fse.copy(distDir.assets, publicDir.assets);
}

main();
