#!/usr/bin/env node

import { getPackageManager } from "./utils/packageManager.js";
import { input, select } from "@inquirer/prompts";
import { $ } from "execa";
import { downloadTemplate } from "giget";
import replaceInFile from "replace-in-file";
import fs from "node:fs";
import chalk from "chalk";
import { startSpinner } from "./utils/cli.js";

async function run() {
  const packageManager = getPackageManager();
  if (packageManager.isErr)
    return console.error(`Package manager could not be determined`);

  console.log(`Creating motile project with ${packageManager.value}`);

  const projectName = await input({
    message: "What is the name of your project?",
    default: "my-motile-project",
  });

  const serverUrl = await input({
    message: "Where can we find your motile server?",
    default: "http://127.0.0.1:3377",
  });

  const template = await select({
    message: "What template would you like to use?",
    choices: [
      // { name: "Blank", value: "blank", description: "A blank project" },
      {
        name: "Chat mail notifications",
        value: "chat",
        description: "A simple example app",
      },
    ],
  });

  const stopTemplateDownloadSpinner = startSpinner(
    `Creating project from template ${template}`
  );
  await downloadTemplate(`github:motile-dev/motile/examples/${template}`, {
    dir: projectName,
    forceClean: true,
  });

  await replaceInFile({
    files: `${projectName}/package.json`,
    from: /^\s*"name":\s*".*?"/m,
    to: `  "name": "${projectName}"`,
  });

  stopTemplateDownloadSpinner();

  fs.writeFileSync(`${projectName}/.env`, `MOTILE_SERVER_URL="${serverUrl}"\n`);

  const stopInstallPackagesSpinner = startSpinner(
    `Installing packages with ${packageManager.value}`
  );

  await $({
    cwd: projectName,
  })`${packageManager.value} install`;

  stopInstallPackagesSpinner();

  console.log(`    🎉  Project created successfully  🎉

    Now go an have some fun!

    ${chalk.hex("#666")(`# Change into the project directory`)}
    cd ${projectName}

    ${chalk.hex("#666")(`# Ramp up a database and start the server`)}
    ${packageManager.value} up

    ${chalk.hex("#666")(`# Prepare the database for the example`)}
    ${packageManager.value} db.migrate

    ${chalk.hex("#666")(
      `# Use motile cli to sync your project with the server`
    )}
    ${packageManager.value} dev
    `);
}

run();
