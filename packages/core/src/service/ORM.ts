import { Connection, ConnectionOptions, createConnection } from "typeorm";
import BaseService from "./BaseService";

class ORM extends BaseService {
  public options: ConnectionOptions;
  public connection: Connection;

  constructor(config) {
    super();
    this.options = {
      ...config.orm,
      type: config.parameters.DATABASE_TYPE,
      host: config.parameters.DATABASE_HOST,
      port: config.parameters.DATABASE_PORT,
      username: config.parameters.DATABASE_USERNAME,
      password: config.parameters.DATABASE_PASSWORD,
      database: config.parameters.DATABASE_NAME
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
