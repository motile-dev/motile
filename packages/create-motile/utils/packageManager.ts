import { Result } from "@badrap/result";

export function getPackageManager() {
  if (!process.env.npm_config_user_agent) return Result.err();

  const packageManager = (process.env.npm_config_user_agent.match(/^[^\/]*/) ??
    [])[0];

  return packageManager ? Result.ok(packageManager) : Result.err();
}
