import * as nodemailer from "nodemailer";
import BaseService from "./BaseService";

class Mailer extends BaseService {
  public mailer: nodemailer.Transporter;

  constructor(config, options?) {
    super();
    this.mailer = nodemailer.createTransport(config.mailer.transport, config.mailer.options);
  }

  send(options: nodemailer.SendMailOptions) {
    return new Promise((accept, reject) => {
      this.mailer.sendMail(options, (err, info) => {
        if (err) {
          return reject(err);
        }

        return accept(info);
      });
    });
  }

  $getName(): string {
    return "Mailer";
  }
}

export default Mailer;
