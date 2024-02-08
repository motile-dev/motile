"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// app/index.ts
var app_exports = {};
__export(app_exports, {
  handlers: () => handlers
});
module.exports = __toCommonJS(app_exports);
var import_drizzle_orm = require("drizzle-orm");

// .trigs/schema.ts
var import_pg_core = require("drizzle-orm/pg-core");
var user = (0, import_pg_core.pgTable)("user", {
  id: (0, import_pg_core.varchar)("id").primaryKey().notNull(),
  name: (0, import_pg_core.varchar)("name")
});
var chats = (0, import_pg_core.pgTable)("chats", {
  id: (0, import_pg_core.varchar)("id").primaryKey().notNull(),
  title: (0, import_pg_core.varchar)("title")
});
var messages = (0, import_pg_core.pgTable)("messages", {
  id: (0, import_pg_core.varchar)("id").primaryKey().notNull(),
  text: (0, import_pg_core.varchar)("text")
});
var trigsDdlLog = (0, import_pg_core.pgTable)("_trigs_ddl_log", {
  id: (0, import_pg_core.integer)("id").primaryKey().notNull(),
  username: (0, import_pg_core.text)("username"),
  objectTag: (0, import_pg_core.text)("object_tag"),
  ddlCommand: (0, import_pg_core.text)("ddl_command"),
  timestamp: (0, import_pg_core.timestamp)("timestamp", { mode: "string" })
});

// app/chat/messages.ts
var messages2 = {
  messages: {
    insert: [
      {
        handler: (record) => console.log(`Some message insert: ${record}`),
        name: "log"
      }
    ]
  }
};

// app/index.ts
var handlers = {
  chats: {
    insert: [
      {
        handler: async (record, _db) => {
          console.log(`A chat was created ${record.title}`);
        },
        name: "log"
      }
    ]
  },
  user: {
    insert: [
      {
        handler: async (record, db) => {
          console.log(`Whoop, you got it nearly!: ${record.name}`);
          const users = await db.query.user.findMany({
            where: (0, import_drizzle_orm.eq)(user.id, "this")
          });
          console.log(`Another interesting user: ${users.map((c) => c.name)}`);
        },
        name: "log"
      }
    ],
    update: [
      {
        handler: (record) => console.log(`chat update: ${record}`),
        name: "log"
      }
    ]
  },
  ...messages2
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handlers
});
