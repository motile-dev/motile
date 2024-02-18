import { Trigs } from "@trigs";
import { users } from "@trigs/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const messages: Trigs = {
  messages: {
    insert: [
      {
        handler: async (record, db) => {
          const user = await db.query.users.findFirst({
            where: eq(users.userId, record.userId),
          });

          if (!user) return;

          resend.emails.send({
            from: "onboarding@resend.dev",
            to: "dave.alex.maier@gmail.com",
            subject: `New chat message from ${user?.username}`,
            html: `<p>User ${user?.username} sent you a message!</p>
                   <p style="margin-left: 20px">${record.messageText}</p>`,
          });
        },
        name: "email",
      },
    ],
  },
};
