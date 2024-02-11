import "dotenv/config";
import { eq } from "drizzle-orm";
import * as schema from "@trigs/schema";
import { Trigs } from "@trigs";
import { messages } from "./chat/messages";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handlers: Trigs = {
  chats: {
    insert: [
      {
        handler: async (record) => {
          console.log("Sending chat notification email");
          resend.emails.send({
            from: "onboarding@resend.dev",
            to: "dave.alex.maier@gmail.com",
            subject: "New chat",
            html: `<p>Yea, new chat created!</p>
            <p><strong>Title:</strong> ${record.title}</p>`,
          });
        },

        name: "infoMail",
      },
    ],
  },
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
  ...messages,
};
