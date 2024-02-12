#!/usr/bin/env node

import { getPackageManager } from "./utils/packageManager.js";
import { input, select } from "@inquirer/prompts";
import { $ } from "execa";
import { downloadTemplate } from "giget";
import replaceInFile from "replace-in-file";
import fs from "node:fs";

async function run() {
  const packageManager = getPackageManager();
  if (packageManager.isErr)
    return console.error(`Package manager could not be determined`);

  console.log(`Creating trigs project with ${packageManager.value}`);

  const projectName = await input({
    message: "What is the name of your project?",
    default: "my-trigs-project",
  });

  const serverUrl = await input({
    message: "Where can we find your trigs server?",
    default: "http://127.0.0.1:3377",
  });

  const template = await select({
    message: "What template would you like to use?",
    choices: [
      { name: "Blank", value: "blank", description: "A blank project" },
      {
        name: "Chat mail notifications",
        value: "chat",
        description: "A simple example app",
      },
    ],
  });

  console.log("Creating project from template ", template);
  await downloadTemplate(`github:trigsdev/trigs/examples/${template}`, {
    dir: projectName,
    forceClean: true,
  });

  await replaceInFile({
    files: `${projectName}/package.json`,
    from: /^\s*"name":\s*".*?"/m,
    to: `  "name": "${projectName}"`,
  });

  fs.writeFileSync(`${projectName}/.env`, `TRIGS_SERVER=${serverUrl}\n`);

  console.log("Installing packages with ", packageManager.value);
  await $({
    cwd: projectName,
  })`${packageManager.value} install`;

  console.log(`
    Project created successfully 🎉

    To get started, run the following commands:

    # Change into the project directory
    cd ${projectName}

    # Ramp up a database and start the server
    ${packageManager.value} up

    # Prepare the database for the example
    ${packageManager.value} db.migrate

    # Use trigs cli sync your project with the server
    ${packageManager.value} dev
    `);
}

run();
