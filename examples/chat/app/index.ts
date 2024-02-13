import { Trigs } from "@trigs";
import { messages } from "./messages";
import { users } from "./users";

export const handlers: Trigs = {
  ...users,
  ...messages,
};
