import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.join(__dirname, "../");

async function safeWriteFile(filePath, content) {
  const dir = path.dirname(filePath);
  // Create directory if it doesn't exist
  await fs.mkdir(dir, { recursive: true });
  // Write file
  await fs.writeFile(filePath, content);
}

async function generateRemote({ packageName, origin, importModule }) {
  const remotePackageJsonUrl = `${origin}package.json`;
  // better way to grab index and types
  const remotePackageUrl = `${origin}`;
  const typesUrl = `${origin}.d.ts`;
  const savePath = path.join(__dirname, `../src/@remotes/${packageName}`);
  const pkg = await fetch(remotePackageJsonUrl).then((res) => res.json());
  pkg.name = packageName; // name must match

  const pkgStr = JSON.stringify(pkg, null, 2);
  const types = await fetch(typesUrl).then((res) => res.text());
  const remoteFile = await fetch(remotePackageUrl).then((res) => res.text());

  // save locally
  await safeWriteFile(path.join(savePath, pkg.main), remoteFile);
  await safeWriteFile(path.join(savePath, pkg.types), types);
  await safeWriteFile(path.join(savePath, `package.json`), pkgStr);
}
export default function (config) {
  const _origin = config.origin;
  const origin = `${_origin}${_origin.endsWith("/") ? "" : "/"}`;
  const _importModule = config.importModule || "@remote";
  const importModule = `${_importModule}${
    _importModule.endsWith("/") ? "" : "/"
  }`;
  const packageName = config.packageName || "AppComponents";
  // first build
  generateRemote({
    packageName,
    origin,
    importModule,
  });
  const importPath = `${importModule}${packageName}`;
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
    async handleHotUpdate({ server, file, read }) {
      if (file.endsWith(".tsx")) {
        const contents = await read();
        if (contents.includes(importPath)) {
          // check if contents include @remote
          console.log(
            `File with ./${path.relative(ROOT, file)} has ${importPath}.
Generating: ${packageName} from ${origin} at ${importModule}`
          );
          generateRemote({
            packageName,
            origin,
            importModule,
          });
        }
      }
    },

    async load(id) {
      if (id.startsWith(importModule)) {
        const packageName = id.substring(importModule.length);

        await generateRemote(packageName);

        return remoteFile;
      }
      return null;
    },
  };
}
