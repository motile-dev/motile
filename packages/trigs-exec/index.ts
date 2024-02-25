import { Elysia, t } from "elysia";
import { ElysiaWS } from "elysia/dist/ws";
import { handlers } from "./hot/handlers.js";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./drizzle/schema";
import { objectToCamel, toCamel } from "ts-case-convert";
import { refreshSchema } from "./utils/refreshSchema";
import { ServerWebSocket } from "bun";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@0.0.0.0:5432/postgres";

const queryClient = postgres(databaseUrl);
const db = drizzle(queryClient, { schema });

type MaybePromise<T> = Promise<T> | T;

const connections = new Map<
  string,
  ElysiaWS<ServerWebSocket<{ validator?: any }>>
>();

function sendToReceivers(receivers: string[], message: string) {
  receivers.map((r) => {
    const connection = connections.get(r);
    if (connection) {
      connection.send(message);
    }
  });
}

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
      const response = handlers[toCamel(body.data.name)][body.data.type].map(
        (handler: any) =>
          handler.handler(objectToCamel(body.data.new_record), db),
      ) as MaybePromise<{ receivers: string[]; message: string }>[];

      console.log("Response", response);

      response.map((r) => {
        if (!isPromise(r)) {
          if (Boolean(r)) {
            sendToReceivers(r.receivers, r.message);
          }
        } else
          r.then((rwaited) => {
            if (Boolean(rwaited)) {
              console.log("Response", rwaited.receivers, rwaited.message);
              sendToReceivers(rwaited.receivers, rwaited.message);
            }
          });
      });
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
  .ws("wire", {
    body: t.Any(),
    message(ws, data: any) {
      if (data.token && data.token.length > 0) {
        // @ts-ignore
        connections.set(data.token, ws);
      } else {
        handlers.htmx[data.HEADERS["HX-Target"]].handler(data, db);
      }
    },
  })
  .listen({ port: 4020, hostname: "0.0.0.0" });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

function isPromise<T>(value: MaybePromise<T>): value is Promise<T> {
  return typeof (value as Promise<T>).then === "function";
}
