import { Trigs } from "@trigs";
import { escapeHtml as e } from "@kitajs/html";

export const messages = {
  messages: {
    insert: [
      {
        handler: async (record, db) => {
          const users = await db.query.users.findMany();
          const userIds = users.map((u) => u.userId);

          return {
            receivers: userIds.filter((u) => u !== record.userId),
            message: (
              <div id="messages" hx-swap-oob="beforeend">
                <div>{e(record.messageText)}</div>
              </div>
            ),
          };
        },
        type: "htmx",
        name: "Send message to all users except sender",
      },
      {
        handler: (record) => {
          return {
            receivers: [record.userId],
            message: (
              <div id="messages" hx-swap-oob="beforeend">
                <div style="color: red;">{e(record.messageText)}</div>
              </div>
            ),
          };
        },
        type: "htmx",
        name: "Send message to sender",
      },
    ],
  },
} satisfies Trigs;
