import { Trigs } from "@trigs";
import * as schema from "@trigs/schema";

export const users: Trigs = {
  users: {
    insert: [
      {
        handler: async (record, db) => {
          await db.insert(schema.messages).values({
            messageText: `Hi I'm new here! My name is: ${record.username}`,
            userId: record.userId,
          });
        },
        name: "introduction",
      },
    ],
    update: [
      {
        handler: async (record) => {
          await fetch(
            "https://hooks.slack.com/services/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",
            {
              method: "POST",
              body: JSON.stringify({
                text: `User ${record.email} was just updated`,
              }),
            },
          );
        },
        name: "slack",
      },
    ],
  },
};
