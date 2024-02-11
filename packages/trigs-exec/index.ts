import { Elysia, t } from "elysia";
import { handlers } from "./hot/handlers.js";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./drizzle/schema";
import { objectToCamel, toCamel } from "ts-case-convert";
import { refreshSchema } from "./utils/refreshSchema";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@0.0.0.0:5432/postgres";

const queryClient = postgres(databaseUrl);
const db = drizzle(queryClient, { schema });

const app = new Elysia()
  .post(
    "/api/event",
    ({ body }) => {
      console.log("Event", body.data.name);
      if (body.data.name == "_trigs_ddl_log") {
        refreshSchema(databaseUrl);
        return;
      }
      // @ts-ignore
      handlers[toCamel(body.data.name)][body.data.type].forEach(
        (handler: any) =>
          handler.handler(objectToCamel(body.data.new_record), db),
      );
    },
    {
      body: t.Object({
        data: t.Object({
          name: t.String(),
          timestamp: t.String(),
          type: t.String(),
          source: t.Any(),
          changes: t.Any(),
          old_record: t.Any(),
          new_record: t.Any(),
        }),
        event_type: t.String(),
      }),
    },
  )
  .get("/api/handlers/tables", () => {
    return { tables: Object.keys(handlers) };
  })
  .get("/api/schema", () => {
    return Bun.file("drizzle/schema.ts").text();
  })
  .post(
    "api/handlers",
    ({ body }) => {
      Bun.write("hot/handlers.js", body.code);
      console.log("Wrote handlers to hot/handlers.js");
      return "ok";
    },
    {
      body: t.Object({
        code: t.String(),
        tables: t.Array(t.String()),
      }),
    },
  )
  .post("api/schema/refresh", () => {
    refreshSchema(databaseUrl);
  })
  .listen({ port: 4020, hostname: "0.0.0.0" });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
