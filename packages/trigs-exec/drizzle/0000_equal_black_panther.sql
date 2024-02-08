-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "chat" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"createdat" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ddl_log" (
	"id" integer PRIMARY KEY NOT NULL,
	"username" text,
	"object_tag" text,
	"ddl_command" text,
	"timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text,
	"iowefjiowejf" varchar
);

*/