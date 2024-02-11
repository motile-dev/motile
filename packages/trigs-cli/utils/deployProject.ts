import fs from "node:fs";
import { packageDirectorySync } from "pkg-dir";
import esbuild from "esbuild";
import { createRequire } from "module";

export const deploy = async () => {
  const packageDirectory = packageDirectorySync();
  const require = createRequire(import.meta.url);

  esbuild.buildSync({
    entryPoints: [`${packageDirectory}/app/index.ts`],
    outfile: `${packageDirectory}/.trigs/build/index.js`,
    bundle: true,
    minify: true,
    target: "esnext",
    platform: "node",
    external: ["drizzle-orm", "dotenv"],
  });

  const file = fs.readFileSync(`${packageDirectory}/.trigs/build/index.js`, {
    encoding: "utf8",
    flag: "r",
  });

  delete require.cache[`${packageDirectory}/.trigs/build/index.js`];
  const app = require(`${packageDirectory}/.trigs/build/index.js`);

  const tables = Object.keys(app.handlers);

  const code = replaceEnvVariables(file);

  const res = await fetch(process.env.TRIGS_SERVER_URL + "/deploy", {
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

function replaceEnvVariables(code: string): string {
  // This regular expression will match "process.env.VAR_NAME"
  const envVarRegex = /process\.env\.([a-zA-Z_][a-zA-Z0-9_]*)/g;

  // Replace each match with the value of the environment variable
  return code.replace(envVarRegex, (_match, varName) => {
    // Get the environment variable's value
    const envVarValue = process.env[varName];

    // Ensure it exists and is a string. If it doesn't exist, we just return the original match
    if (envVarValue === undefined) {
      console.warn(`Environment variable ${varName} is not defined.`);
      return _match;
    }

    // Return the value as a string literal (assuming it should be treated as a string)
    // JSON.stringify is used to ensure that the replacements are properly quoted
    // and escaped in the resulting code string.
    return JSON.stringify(envVarValue);
  });
}
