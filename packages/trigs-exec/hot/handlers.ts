import { eq } from "drizzle-orm";
import { Trigs } from "@trigs";
import * as schema from "@trigs/schema";

export const handlers: Trigs = {
  user: {
    insert: [
      {
        handler: async (record, db) => {
          console.log(`Inserted title: ${record.name}`);

          const chats = await db.query.user.findMany({
            where: eq(schema.user.id, "this"),
          });

          console.log(`Another interesting user: ${chats.map((c) => c.name)}`);
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
  // ddlLog: {
  //   insert: [
  //     {
  //       handler: (record) =>
  //         console.log(
  //           `Database has changed: ${JSON.stringify(record.objectTag)}`,
  //         ),
  //       name: "log",
  //     },
  //   ],
  // },
};
