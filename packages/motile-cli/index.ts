#!/usr/bin/env node

import { Command } from "commander";
import fs from "node:fs";
import os from "node:os";
import chalk from "chalk";
import { deploy } from "./utils/deployProject.js";
import {
  watchAndDeployInfinitely,
  pollRemoteSchemaInfinitely,
} from "./utils/infinitely.js";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: `.env.${process.env.NODE_ENV ?? "development"}` });
config({ path: ".env" });

const program = new Command();

console.log(chalk.green("Welcome to motile"));

program.version("0.0.1-alpha.7").description("motile CLI");

program
  .command("deploy")
  .description("Push local changes to motile")
  .action(deploy);

program
  .command("fetch")
  .description("Fetch the current schema from motile")
  .action(async () => {
    const result = await fetch("http://127.0.0.1:3377/schema");

    fs.writeFileSync("test/motile/schema.ts", await result.text());
  });

program
  .command("dev")
  .description(
    "Automatically deploy local changes to motile and automatically fetch remote schema changes "
  )
  .action(async () => {
    console.log(
      await Promise.all([
        watchAndDeployInfinitely(),
        pollRemoteSchemaInfinitely(),
      ])
    );
  });

program
  .command("login")
  .description("Login to motile")
  .argument(
    "[token]",
    "The token to login with. If not provided, you will be taken to motile cloud login page."
  )
  .action((token) => {
    const home = os.homedir();
    const settingsDir = `${home}/.motile`;
    const credentialsFile = `${settingsDir}/credentials.json`;
    const credentials = { localhost: { token: token } };

    try {
      fs.mkdirSync(settingsDir);
    } catch (e) {}

    fs.writeFileSync(credentialsFile, JSON.stringify(credentials, null, 2));
  });

program
  .command("refresh")
  .description("Manually refresh the serverside schema")
  .argument("[token]")
  .action(async () => {
    console.log("Refreshing schema...");
    const result = await fetch("http://127.0.0.1:3377/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(result.status === 200 ? "Success!" : "Failed!");
  });

program.parse();
