import { pgTable, varchar, integer, text, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const user = pgTable("user", {
	id: varchar("id").primaryKey().notNull(),
	name: varchar("name"),
});

export const chats = pgTable("chats", {
	id: varchar("id").primaryKey().notNull(),
	title: varchar("title"),
});

export const messages = pgTable("messages", {
	id: varchar("id").primaryKey().notNull(),
	text: varchar("text"),
});

export const trigsDdlLog = pgTable("_trigs_ddl_log", {
	id: integer("id").primaryKey().notNull(),
	username: text("username"),
	objectTag: text("object_tag"),
	ddlCommand: text("ddl_command"),
	timestamp: timestamp("timestamp", { mode: 'string' }),
});