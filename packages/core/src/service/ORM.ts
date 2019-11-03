import { Connection, ConnectionOptions, createConnection } from "typeorm";
import BaseService from "./BaseService";

class ORM extends BaseService {
  public options: ConnectionOptions;
  public connection: Connection;

  constructor(config) {
    super();
    this.options = {
      ...config.orm,
    };
  }

  async $initialize() {
    this.connection = await createConnection(this.options);
  }

  public getRepository(type) {
    return this.connection.getRepository(type);
  }

  $getName(): string {
    return "ORM";
  }
}

export default ORM;
