import { eq } from "drizzle-orm";
import * as schema from "@trigs/schema";
import { Trigs } from "@trigs";
import { messages } from "./chat/messages";

export const handlers: Trigs = {
  chats: {
    insert: [
      {
        handler: async (record, _db) => {
          console.log(`A chat was created ${record.title}`);
        },

        name: "log",
      },
    ],
  },
  user: {
    insert: [
      {
        handler: async (record, db) => {
          console.log(`Whoop, you got it nearly!: ${record.name}`);

          const users = await db.query.user.findMany({
            where: eq(schema.user.id, "this"),
          });

          console.log(`Another interesting user: ${users.map((c) => c.name)}`);
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
  ...messages,
};
