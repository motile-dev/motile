import * as schema from "./schema";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type InferSelect<T extends keyof typeof schema> =
  (typeof schema)[T]["$inferSelect"];

type Handler<T extends keyof typeof schema> = {
  handler: (
    record: InferSelect<T>,
    db: PostgresJsDatabase<typeof schema>,
  ) => any;
  type?: HandlerType;
  name: string;
};

type HandlerType = "htmx";

type Actions = "insert" | "update" | "delete";

export type Trigs = {
  [table in keyof typeof schema]?: { [action in Actions]?: Handler<table>[] };
} & {
  htmx?: {
    [event: string]: Handler<any>;
  };
};
