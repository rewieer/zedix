"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const BaseService_1 = require("./BaseService");
class Mailer extends BaseService_1.default {
    constructor(transport, options) {
        super();
        this.mailer = nodemailer.createTransport(transport, options);
    }
    send(options) {
        return new Promise((accept, reject) => {
            this.mailer.sendMail(options, (err, info) => {
                if (err) {
                    return reject(err);
                }
                return accept(info);
            });
        });
    }
    getName() {
        return "Mailer";
    }
}
exports.default = Mailer;
//# sourceMappingURL=Mailer.js.map