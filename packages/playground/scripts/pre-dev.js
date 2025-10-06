import URL from "node:url";
import fse from "fs-extra";
import path from "node:path";

const root = path.dirname(URL.fileURLToPath(import.meta.url));

const d = s => path.resolve(root, s);

const distDir = {
  assets: d("../../card-render/dist/assets"),
  fonts: d("../../card-resources/fonts")
};

const publicDir = {
  assets: d("../public/assets"),
  fonts: d("../public/fonts")
};

async function main() {
  fse.rmSync(publicDir.fonts, { recursive: true, force: true });
  fse.rmSync(publicDir.assets, { recursive: true, force: true });
  await fse.copy(distDir.fonts, publicDir.fonts);
  await fse.copy(distDir.assets, publicDir.assets);
}

main();
