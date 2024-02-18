import { pgTable, integer, text, bigserial, timestamp, boolean, unique, serial, varchar, foreignKey } from "drizzle-orm/pg-core"
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

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	username: varchar("username", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		usersUsernameKey: unique("users_username_key").on(table.username),
		usersEmailKey: unique("users_email_key").on(table.email),
	}
});

export const posts = pgTable("posts", {
	id: serial("id").primaryKey().notNull(),
	authorId: integer("author_id").references(() => users.id, { onDelete: "cascade" } ),
	title: varchar("title", { length: 255 }).notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const comments = pgTable("comments", {
	id: serial("id").primaryKey().notNull(),
	postId: integer("post_id").references(() => posts.id, { onDelete: "cascade" } ),
	authorId: integer("author_id").references(() => users.id, { onDelete: "cascade" } ),
	content: text("content").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});