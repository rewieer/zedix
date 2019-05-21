"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const chalk_1 = require("chalk");
const MetadataCollector_1 = require("./MetadataCollector");
const RequestContext_1 = require("./RequestContext");
/**
 * @class App
 * Core class
 *
 * Service custom fields :
 * __zxcfgr__ : configurator. If provided, the app calls it in order to instantiate the object.
 */
class App {
    constructor() {
        this.services = {};
        this.routers = {};
        this.url = null;
    }
    initialize() {
        let _that = this;
        this.app = express();
        this.app.use(bodyParser.json({ limit: "10mb" }));
        this.app.use(function (req, res, next) {
            if (_that !== null) {
                _that.url = req.protocol + "://" + req.get("host");
                _that = null; // clear ref for G.C
            }
            res.locals.app = new RequestContext_1.default();
            next();
        });
    }
    /*
    App => Request / Response router
    Returns a response for a request
    It has a router queue in which various components pass
    App => Authorization Handler => Router
     */
    configure(conf) {
        return __awaiter(this, void 0, void 0, function* () {
            this.services = {};
            this.routers = conf.routers.slice();
            this.logger = conf.logger;
            this.initialize();
            // Create helpers so that services / middlewares can access App's public internals
            const helpers = {
                getURL: () => {
                    return this.url;
                },
                getLogger: () => {
                    return this.logger;
                }
            };
            // - Step 1 : load services and configure them
            for (let service of conf.services) {
                let serviceConf = service.__zxcfgr__
                    ? service.__zxcfgr__(conf.config)
                    : [conf.config];
                const instance = new service(...serviceConf);
                if (this.services[instance.getName()]) {
                    throw new Error("A service with name " + instance.getName() + " already exists.");
                }
                this.services[instance.getName()] = instance;
            }
            let curService;
            for (let name of Object.keys(this.services)) {
                curService = this.services[name];
                if (typeof curService.initialize === "function") {
                    yield curService.initialize();
                }
                if (typeof curService.integrate === "function") {
                    curService.integrate(this.app);
                }
            }
            // - Step 2 : configure middlewares
            conf.middlewares.forEach(mdw => {
                this.app.use((req, res, next) => {
                    mdw.handle(req, res.locals.app, next);
                });
            });
            // - Step 3 : configure controllers
            conf.controllers.forEach(obj => {
                const metadata = MetadataCollector_1.default.getMetadataForObject(obj);
                conf.routers.forEach(router => router.receiveMetadata(obj, metadata));
            });
            // - Step 4 : integrate routers with Express
            conf.routers.forEach(router => {
                router.integrate(this.app, helpers);
            });
            return this;
        });
    }
    getService(name) {
        return this.services[name];
    }
    getRouter(at) {
        return this.routers[at];
    }
    run(port) {
        this.app.listen(port, () => {
            console.log(chalk_1.default.bold.yellowBright("Z> Server is running on port " + port));
        });
    }
}
exports.default = new App();
//# sourceMappingURL=App.js.map