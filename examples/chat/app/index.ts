import { Motile } from "@motile";
import { messages } from "./messages";
import { users } from "./users";

export const handlers = {
  ...users,
  ...messages,
} satisfies Motile;
