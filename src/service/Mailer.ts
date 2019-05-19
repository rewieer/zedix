import * as nodemailer from "nodemailer";
import BaseService from "./BaseService";

class Mailer extends BaseService {
  public mailer: nodemailer.Transporter;

  constructor(transport, options?) {
    super();
    this.mailer = nodemailer.createTransport(transport, options);
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

  getName(): string {
    return "Mailer";
  }

}

export default Mailer;
