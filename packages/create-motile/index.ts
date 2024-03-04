#!/usr/bin/env node

import { getPackageManager } from "./utils/packageManager.js";
import { $ } from "execa";
import { downloadTemplate } from "giget";
import replaceInFile from "replace-in-file";
import fs from "node:fs";
import chalk from "chalk";
import {
  cancel,
  select,
  intro,
  isCancel,
  outro,
  text,
  spinner,
} from "@clack/prompts";

const packageManager = getPackageManager();

async function run() {
  intro(`Create a new motile project`);

  if (packageManager.isErr) {
    cancel(`Could not identify your package manager`);
    return process.exit(0);
  }

  const projectName = await text({
    message: "What is the name of your project?",
    placeholder: "my-motile-project",
    defaultValue: "my-motile-project",
  });

  if (isCancel(projectName)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  // console.log(`Creating motile project with ${packageManager.value}`);
  const serverUrl = await text({
    message: "Where can we find your motile server?",
    placeholder: "http://127.0.0.1:3377",
    defaultValue: "http://127.0.0.1:3377",
  });

  if (isCancel(serverUrl)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const template = await select({
    message: "What template would you like to use?",
    options: [
      // { name: "Blank", value: "blank", description: "A blank project" },
      {
        label: "Chat",
        hint: "Small example showcasing event sourcing",
        value: "chat",
      },
    ],
  });

  if (isCancel(template)) {
    cancel("Operation cancelled");
    return process.exit(0);
  }

  const s = spinner();
  s.start(`Creating project from template ${template}`);

  await downloadTemplate(`github:motile-dev/motile/examples/${template}`, {
    dir: projectName,
    forceClean: true,
  });

  await replaceInFile({
    files: `${projectName}/package.json`,
    from: /^\s*"name":\s*".*?"/m,
    to: `  "name": "${projectName}"`,
  });

  s.stop(`Project successfully scaffolded`);

  s.start(`Installing packages with ${packageManager.value}`);

  await $({
    cwd: projectName,
  })`${packageManager.value} install`;

  s.stop(`Packages installed`);

  outro(`🎉  Project created successfully  🎉 
  
    Now go and have some fun!

    ${chalk.hex("#666")(`# Change into the project directory`)}
    cd ${projectName}

    ${chalk.hex("#666")(`# Ramp up a database and start the motile server`)}
    ${packageManager.value} run server.up

    ${chalk.hex("#666")(`# Prepare the database for the example`)}
    ${packageManager.value} run db.migrate

    ${chalk.hex("#666")(
      `# Use motile cli to sync your project with the server`
    )}
    ${packageManager.value} run dev
    `);
}

run();
