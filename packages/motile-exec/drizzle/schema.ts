import { pgTable, varchar } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const user = pgTable("user", {
	id: varchar("id").primaryKey().notNull(),
	name: varchar("name"),
});