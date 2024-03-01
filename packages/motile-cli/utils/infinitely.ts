import Watcher from "watcher";
import { fetchSchema } from "./fetchSchema.js";
import { deploy } from "./deployProject.js";
import chalk from "chalk";

export const watchAndDeployInfinitely = async () => {
  const watcher = new Watcher("app/", {
    recursive: true,
    ignoreInitial: true,
  });

  watcher.on("all", (event) => {
    if (event === "add" || event === "change" || event === "unlink") {
      deploy();
    }
  });

  // Initial deploy
  deploy();
};

export const pollRemoteSchemaInfinitely = async () => {
  while (true) {
    const res = await fetchSchema();

    if (res.isErr) {
      console.log(
        res.error.message.includes("fetch failed")
          ? chalk.red(
              "Server could not be found. Check if your server is running and reachable.\nRetrying in 10 seconds"
            )
          : res.error.message
      );
      await new Promise((resolve) => setTimeout(resolve, 9000));
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
