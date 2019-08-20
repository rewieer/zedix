import * as express from "express";
import * as path from "path";
import * as ejs from "ejs";
import BaseService from "./BaseService";

class Templating extends BaseService {
  public viewsPath;
  constructor(config) {
    super();
    this.viewsPath = path.resolve(config.paths.views);
  }

  $integrate(app: express.Application) {
    app.set("view engine", "ejs");
  }

  parse(filename, data) {
    return ejs.renderFile(path.resolve(this.viewsPath, filename), data);
  }

  $getName(): string {
    return "Templating";
  }
}

export default Templating;
