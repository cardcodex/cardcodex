import URL from "node:url";
import path from "node:path";

const root = path.dirname(URL.fileURLToPath(import.meta.url));

const d = s => path.resolve(root, s);

const distDir = {
  assets: d("../../card-renderer/dist/assets")
};

const publicDir = {
  assets: d("../public/assets")
};


