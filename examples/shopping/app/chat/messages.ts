import { Trigs } from "@trigs";

export const messages: Trigs = {
  messages: {
    insert: [
      {
        handler: (record: any) => console.log(`Some message insert: ${record}`),
        name: "log",
      },
    ],
  },
};
