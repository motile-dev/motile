import fs from "node:fs";
import { packageDirectorySync } from "pkg-dir";
import esbuild from "esbuild";
import { extractKeysFromJSFile } from "./extractKeys.js";
import { createRequire } from "module";

export const deploy = async () => {
  const packageDirectory = packageDirectorySync();
  const require = createRequire(import.meta.url);

  esbuild.buildSync({
    entryPoints: [`${packageDirectory}/app/index.ts`],
    outfile: `${packageDirectory}/.trigs/build/index.js`,
    bundle: true,
    target: "esnext",
    platform: "node",
    external: ["drizzle-orm"],
  });

  const file = fs.readFileSync(`${packageDirectory}/.trigs/build/index.js`, {
    encoding: "utf8",
    flag: "r",
  });

  delete require.cache[`${packageDirectory}/.trigs/build/index.js`];
  const app = require(`${packageDirectory}/.trigs/build/index.js`);

  const tables = Object.keys(app.handlers);
  console.log(tables);

  fetch("http://127.0.0.1:3377/deploy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: file,
      tables,
    }),
  });

  fetch("http://", { });
