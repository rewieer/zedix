import ServiceInterface from "../interface/ServiceInterface";

export default abstract class BaseService implements ServiceInterface {
  initialize() {

  }

  integrate(app: Express.Application) {

  }

  abstract getName(): string;
}
