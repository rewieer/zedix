import chalk from "chalk";
import * as nodemon from "nodemon";
import { log } from "./devApi";
import DevEnvironmentInterface from "./DevEnvironmentInterface";

class NodemonDevEnvironment implements DevEnvironmentInterface {
  private data: any;

  constructor(data) {
    this.data = data;
  }

  public spawn() {
    let isInitial = false;

    log(chalk.bold.yellowBright("Zedix - Development Runtime"));
    log(
      "Z> I will take care of running the development environment in background for you :)"
    );

    nodemon(this.data);
    nodemon
      .on("start", function() {
        if (isInitial === true) return;

        isInitial = true;
        log(chalk.bold.yellowBright("Z> Nodemon started!"));
      })
      .on("quit", function() {
        log(chalk.bold.yellowBright("Z> Bye bye !"));
        process.exit(0); // Avoid EIO error
      })
      .on("restart", function() {
        log(chalk.bold.yellowBright("Z> Files changed, reloading..."));
      });
  }
}

export default NodemonDevEnvironment;
