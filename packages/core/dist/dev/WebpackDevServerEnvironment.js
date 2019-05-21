"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const addEntries = require("webpack-dev-server/lib/utils/addEntries");
const devApi_1 = require("./devApi");
const path = require("path");
class WebpackDevServerEnvironment {
    spawn() {
        const conf = require(path.resolve(__dirname, "../../webpack.config.js"))({
            mode: "development"
        });
        addEntries(conf, conf.devServer);
        const compiler = webpack(Object.assign({}, conf));
        const server = new WebpackDevServer(compiler, conf.devServer);
        const port = conf.devServer.port || 3009;
        server.listen(port, "localhost", function (err) {
            if (err) {
                devApi_1.logError(err);
            }
            devApi_1.log(chalk_1.default.bold.yellowBright(`S> Webpack runs on port ${port}`));
        });
    }
}
exports.default = WebpackDevServerEnvironment;
//# sourceMappingURL=WebpackDevServerEnvironment.js.map