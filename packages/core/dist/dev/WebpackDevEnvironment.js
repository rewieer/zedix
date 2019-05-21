"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const webpack = require("webpack");
const devApi_1 = require("./devApi");
const path = require("path");
class WebpackDevEnvironment {
    spawn() {
        const conf = require(path.resolve(__dirname, "../../webpack.config.js"));
        webpack(Object.assign({}, conf({
            mode: "development"
        })), (err, stats) => {
            if (err) {
                devApi_1.logError(err.stack || err);
                // @ts-ignore
                if (err.details) {
                    // @ts-ignore
                    devApi_1.logError(err.details);
                }
            }
            const info = stats.toJson();
            if (stats.hasErrors()) {
                info.errors.forEach(error => devApi_1.logError(chalk_1.default.redBright("Webpack : " + error)));
            }
            devApi_1.log(chalk_1.default.yellowBright.bold("S> --- Webpack ---"));
            devApi_1.log(stats.toString({
                colors: true
            }));
            devApi_1.log(chalk_1.default.yellowBright.bold("S> --- /Webpack ---"));
        });
    }
}
exports.default = WebpackDevEnvironment;
//# sourceMappingURL=WebpackDevEnvironment.js.map