import fs from "node:fs";
import path from "node:path";
import importRaw from "./rollup-plugin-import-raw"

export default function importRaw() {
  const importers = {};
  const filter = id => id.endsWith("?raw");
  return {
    name: "rollup-plugin-import-raw",
    resolveId: {
      order: "pre",
      handler(source, importer) {
        if (filter(source)) {
          importers[source] = importer;
          return source;
        }
        return null;
      }
    },
    load: {
      order: "pre",
      async handler(id) {
        if (filter(id)) {
          const importer = importers[id];
          if (!importer) return null;
          id = id.replace(/\?raw$/, "");
          if (id.startsWith(".")) {
            id = path.resolve(path.dirname(importer), id);
          } else {
            const result = await this.resolve(id, importer);
            if (!result) {
              throw new Error(`cannot resolve file: '${id}' `);
            }
            id = result.id;
          }
          return `export default ${JSON.stringify(fs.readFileSync(id, "utf-8"))}`;
        }
        return null;
      }
    }
  };
}
