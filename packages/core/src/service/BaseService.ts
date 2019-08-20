import ServiceInterface from "../interface/ServiceInterface";

export default abstract class BaseService implements ServiceInterface {
  abstract $getName(): string;
}
