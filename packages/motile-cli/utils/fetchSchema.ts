import { Result } from "@badrap/result";
import fs from "node:fs";
import { packageDirectorySync } from "pkg-dir";

export async function fetchSchema() {
  try {
    const result = await fetch("http://127.0.0.1:3377/schema");

    const packageDirectory = packageDirectorySync();

    if (!packageDirectory) {
      return Result.err(new Error("Could not find package directory"));
    }

    fs.writeFileSync(
      `${packageDirectory}/.motile/schema.ts`,
      await result.text()
    );

    return Result.ok(1);
  } catch (e) {
    return e instanceof Error ? Result.err(e) : Result.err();
  }
}
