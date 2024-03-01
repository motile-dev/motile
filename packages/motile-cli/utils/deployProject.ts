import fs from "node:fs";
import { packageDirectorySync } from "pkg-dir";
import { replaceEnvVariables } from "./replaceEnvVariables.js";
import esbuild from "esbuild";
import { createRequire } from "module";

export const deploy = async () => {
  const packageDirectory = packageDirectorySync();
  const require = createRequire(import.meta.url);

  esbuild.buildSync({
    entryPoints: [`${packageDirectory}/app/index.ts`],
    outfile: `${packageDirectory}/.motile/build/index.js`,
    bundle: true,
    minify: true,
    target: "esnext",
    platform: "node",
    external: ["drizzle-orm", "dotenv"],
  });

  const file = fs.readFileSync(`${packageDirectory}/.motile/build/index.js`, {
    encoding: "utf8",
    flag: "r",
  });

  delete require.cache[`${packageDirectory}/.motile/build/index.js`];
  const app = require(`${packageDirectory}/.motile/build/index.js`);

  const tables = Object.keys(app.handlers);

  const code = replaceEnvVariables(file);

  const res = await fetch(process.env.MOTILE_SERVER_URL + "/deploy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      tables,
    }),
  });

  if (res.ok) {
    console.log("Deployed successfully!");
  }
};
