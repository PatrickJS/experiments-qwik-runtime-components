import { promises as fs } from "node:fs";
import path from "node:path";

async function safeWriteFile(filePath, content) {
  const dir = path.dirname(filePath);
  // Create directory if it doesn't exist
  await fs.mkdir(dir, { recursive: true });
  // Write file
  await fs.writeFile(filePath, content);
}
export default function (config) {
  const _origin = config.origin;
  const origin = `${_origin}${_origin.endsWith("/") ? "" : "/"}`;
  const _importModule = config.importModule || "@remote";
  const importModule = `${_importModule}${
    _importModule.endsWith("/") ? "" : "/"
  }`;
  return {
    name: "vite-plugin-fetch-types",
    async resolveId(source, importer) {
      if (source.startsWith(importModule)) {
        // Resolve and handle the remote import
        return this.resolve(source, importer, { skipSelf: true }).then(
          (resolved) => {
            return resolved || source;
          }
        );
      }
      return null;
    },
    async load(id) {
      if (id.startsWith(importModule)) {
        const packageName = id.substring(importModule.length);
        const remotePackageJsonUrl = `${origin}package.json`;
        // better way to grab index and types
        const remotePackageUrl = `${origin}`;
        const typesUrl = `${origin}.d.ts`;
        const savePath = path.join(__dirname, `../src/@remotes/${packageName}`);
        const pkg = await fetch(remotePackageJsonUrl).then((res) => res.json());
        pkg.name = packageName; // name must match

        const pkgStr = JSON.stringify(pkg, null, 2);
        const types = await fetch(typesUrl).then((res) => res.text());
        const remoteFile = await fetch(remotePackageUrl).then((res) =>
          res.text()
        );

        // save locally
        await safeWriteFile(path.join(savePath, pkg.main), remoteFile);
        await safeWriteFile(path.join(savePath, pkg.types), types);
        await safeWriteFile(path.join(savePath, `package.json`), pkgStr);

        return remoteFile;
      }
      return null;
    },
  };
}
