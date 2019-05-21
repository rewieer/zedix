import * as express from "express";
import BaseService from "./BaseService";
declare class Templating extends BaseService {
    viewsPath: any;
    constructor(config: any);
    integrate(app: express.Application): void;
    parse(filename: any, data: any): any;
    getName(): string;
}
export default Templating;
