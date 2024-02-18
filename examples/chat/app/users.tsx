import { Trigs } from "@trigs";
import * as schema from "@trigs/schema";
import { sql } from "drizzle-orm";
import { format, parse } from "@formkit/tempo";
import { escapeHtml as e } from "@kitajs/html";

export const users: Trigs = {
  users: {
    insert: [
      {
        handler: async (record, db) => {
          const userCount = (
            await db
              .select({
                count: sql<number>`cast(count(${schema.users.userId}) as int)`,
              })
              .from(schema.users)
          )[0].count;

          const formattedDate = format(
            parse(record.createdAt ?? "now"),
            "medium",
          );

          return {
            receivers: ["1234"],
            message: (
              <div id="notifications" hx-swap-oob="beforeend">
                <div>
                  New user {e(record.username)} created at {e(formattedDate)}{" "}
                  There are now {userCount} users
                </div>
              </div>
            ),
          };
        },
        name: "web",
      },
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
