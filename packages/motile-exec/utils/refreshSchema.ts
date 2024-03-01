export async function refreshSchema(databaseUrl: string) {
  console.log("refreshing schema");
  const proc = Bun.spawn([
    "bunx",
    "drizzle-kit",
    "introspect:pg",
    "--connectionString",
    databaseUrl,
    "--out",
    "/usr/src/app/drizzle",
    "--driver",
    "pg",
  ]);
  await proc.exited;
  const output = await new Response(proc.stdout).text();
  console.log(output);
}
