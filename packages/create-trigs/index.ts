#!/usr/bin/env node

import { Result } from "@badrap/result";

const packageManager = getPackageManger();
if (packageManager.isOk) console.log(packageManager.value);
else console.log("An error has occured");

function getPackageManger() {
  if (!process.env.npm_config_user_agent) return Result.err();

  const packageManager = (process.env.npm_config_user_agent.match(/^[^\/]*/) ??
    [])[0];

  return packageManager ? Result.ok(packageManager) : Result.err();
}
