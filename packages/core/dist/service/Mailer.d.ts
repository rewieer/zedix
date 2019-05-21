import * as nodemailer from "nodemailer";
import BaseService from "./BaseService";
declare class Mailer extends BaseService {
    mailer: nodemailer.Transporter;
    constructor(transport: any, options?: any);
    send(options: nodemailer.SendMailOptions): Promise<{}>;
    getName(): string;
}
export default Mailer;
