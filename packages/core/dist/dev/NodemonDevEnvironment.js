"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const nodemon = require("nodemon");
const devApi_1 = require("./devApi");
class NodemonDevEnvironment {
    constructor(data) {
        this.data = data;
    }
    spawn() {
        let isInitial = false;
        devApi_1.log(chalk_1.default.bold.yellowBright("Zedix - Development Runtime"));
        devApi_1.log("Z> I will take care of running the development environment in background for you :)");
        nodemon(this.data);
        nodemon
            .on("start", function () {
            if (isInitial === true)
                return;
            isInitial = true;
            devApi_1.log(chalk_1.default.bold.yellowBright("Z> Nodemon started!"));
        })
            .on("quit", function () {
            devApi_1.log(chalk_1.default.bold.yellowBright("Z> Bye bye !"));
            process.exit(0); // Avoid EIO error
        })
            .on("restart", function () {
            devApi_1.log(chalk_1.default.bold.yellowBright("Z> Files changed, reloading..."));
        });
    }
}
exports.default = NodemonDevEnvironment;
//# sourceMappingURL=NodemonDevEnvironment.js.map