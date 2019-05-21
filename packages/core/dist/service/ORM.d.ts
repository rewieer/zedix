import { Connection, ConnectionOptions, Repository } from "typeorm";
import BaseService from "./BaseService";
declare class ORM extends BaseService {
    options: ConnectionOptions;
    connection: Connection;
    constructor(config: any);
    initialize(): Promise<void>;
    getRepository(type: any): Repository<{}>;
    getName(): string;
}
export default ORM;
