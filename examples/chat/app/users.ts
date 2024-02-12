import { Trigs } from "@trigs";
import * as schema from "@trigs/schema";
import { eq } from "drizzle-orm";

export const users: Trigs = {
  users: {
    insert: [
      {
        handler: async (record, db) => {
          console.log(`Whoop, you got it nearly!: ${record.firstName}`);

          const users = await db.query.users.findMany({
            where: eq(schema.users.id, "this"),
          });

          console.log(
            `Another interesting user: ${users.map((c) => c.firstName)}`,
          );
        },

        name: "log",
      },
    ],
    update: [
      {
        handler: (record: any) => console.log(`chat update: ${record}`),
        name: "log",
      },
    ],
  },
};
