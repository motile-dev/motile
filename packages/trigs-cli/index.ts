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

const program = new Command();

console.log(chalk.green("Welcome to trigs"));

program.version("0.0.1-alpha.7").description("trigs CLI");

program
  .command("deploy")
  .description("Push local changes to trigs")
  .action(deploy);

program
  .command("fetch")
  .description("Fetch the current schema from trigs")
  .action(async () => {
    const result = await fetch("http://127.0.0.1:3377/schema");

    fs.writeFileSync("test/trigs/schema.ts", await result.text());
  });

program
  .command("dev")
  .description(
    "Automatically deploy local changes to trigs and automatically fetch remote schema changes ",
  )
  .action(async () => {
    console.log(
      await Promise.all([
        watchAndDeployInfinitely(),
        pollRemoteSchemaInfinitely(),
      ]),
    );
  });

program
  .command("login")
  .description("Login to trigs")
  .argument(
    "[token]",
    "The token to login with. If not provided, you will be taken to trigs cloud login page.",
  )
  .action((token) => {
    const home = os.homedir();
    const settingsDir = `${home}/.trigs`;
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
