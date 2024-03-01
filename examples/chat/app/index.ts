import { Motile } from "@motile";
import { messages } from "./messages";
import { users } from "./users";
import "@kitajs/html/register";

export const handlers = {
  ...users,
  ...messages,
} satisfies Motile;
