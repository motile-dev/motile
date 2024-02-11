import { pgTable, integer, text, timestamp, varchar, date } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const trigsDdlLog = pgTable("_trigs_ddl_log", {
	id: integer("id").primaryKey().notNull(),
	username: text("username"),
	objectTag: text("object_tag"),
	ddlCommand: text("ddl_command"),
	timestamp: timestamp("timestamp", { mode: 'string' }),
});

export const chats = pgTable("chats", {
	id: varchar("id").primaryKey().notNull(),
	title: varchar("title"),
	createdat: date("createdat"),
	description: varchar("description"),
});

export const users = pgTable("users", {
	id: varchar("id").primaryKey().notNull(),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
});