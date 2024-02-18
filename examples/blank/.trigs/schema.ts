import { pgTable, integer, text, bigserial, timestamp, boolean, foreignKey, uuid, unique, varchar } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const atdatabasesMigrationsVersion = pgTable("atdatabases_migrations_version", {
	id: integer("id").primaryKey().notNull(),
	version: text("version"),
});

export const atdatabasesMigrationsApplied = pgTable("atdatabases_migrations_applied", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	index: integer("index").notNull(),
	name: text("name").notNull(),
	script: text("script").notNull(),
	appliedAt: timestamp("applied_at", { withTimezone: true, mode: 'string' }).notNull(),
	ignoredError: text("ignored_error"),
	obsolete: boolean("obsolete").notNull(),
});

export const trigsDdlLog = pgTable("_trigs_ddl_log", {
	id: integer("id").primaryKey().notNull(),
	username: text("username"),
	objectTag: text("object_tag"),
	ddlCommand: text("ddl_command"),
	timestamp: timestamp("timestamp", { mode: 'string' }),
});

export const messages = pgTable("messages", {
	messageId: uuid("message_id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull().references(() => users.userId, { onDelete: "cascade" } ),
	messageText: text("message_text").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	userId: uuid("user_id").defaultRandom().primaryKey().notNull(),
	username: varchar("username", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		usersEmailKey: unique("users_email_key").on(table.email),
	}
});