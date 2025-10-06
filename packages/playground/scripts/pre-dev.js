import fs from "node:fs";
import URL from "node:url";
import path from "node:path";

const __dirname = path.dirname(URL.fileURLToPath(import.meta.url));

const publicAssetsDir = path.resolve(__dirname, "../public/assets");
const distAssetsDir = path.resolve(__dirname, "../../card-render/dist/assets");

function copyPublic() {
  let count = 1;
  const total = distAssetsDir.length;
  if (!fs.existsSync(distAssetsDir)) {
    return;
  }

  // 清空 public/assets 目录
  if (fs.existsSync(publicAssetsDir)) {
    fs.rmSync(publicAssetsDir, { recursive: true, force: true });
    console.log(`🗑  clear ${publicAssetsDir}`);
  } else {
    fs.mkdirSync(publicAssetsDir);
    console.log(`📁  create ${publicAssetsDir}`);
  }

  // 复制所有 assets 文件到 public 目录
  fs.readdirSync(distAssetsDir).forEach(file => {
    const source = path.resolve(distAssetsDir, file);
    const dest = path.resolve(publicAssetsDir, file);
    try {
      fs.copyFileSync(source, dest);
      console.log(`📄 [${count}/${total}] copy ${source} into ${dest}`);
    } catch (e) {
    } finally {
      count += 1;
    }
  });
}

copyPublic();
