import logUpdate from "log-update";
import chalk from "chalk";

// Frame sequence for the spinner
const frames = ["-", "\\", "|", "/"];
let currentFrameIndex = 0;

export function startSpinner(message: string, interval: number = 100) {
  const spinnerInterval = setInterval(() => {
    const frame = frames[currentFrameIndex];
    const coloredFrame = chalk.green(frame); // You can customize the color here
    logUpdate(`\n    ${coloredFrame} ${message}`);

    currentFrameIndex = (currentFrameIndex + 1) % frames.length;
  }, interval);

  // Return a function to stop the spinner
  return () => {
    clearInterval(spinnerInterval);

    logUpdate(`\n   ${chalk.green("✔")} ${message}`);
    console.log("\n");
  };
}
