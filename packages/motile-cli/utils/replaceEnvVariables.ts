export function replaceEnvVariables(code: string): string {
  // This regular expression will match "process.env.VAR_NAME"
  const envVarRegex = /process\.env\.([a-zA-Z_][a-zA-Z0-9_]*)/g;

  return code.replace(envVarRegex, (_match, varName) => {
    const envVarValue = process.env[varName];

    if (envVarValue === undefined) {
      // console.warn(`Environment variable ${varName} is not defined.`);
      return _match;
    }

    return JSON.stringify(envVarValue);
  });
}
