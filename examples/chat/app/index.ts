import { Trigs } from "@trigs";
import { messages } from "./chat/messages";
import { users } from "./users";
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
  ...users,
  ...messages,
};
