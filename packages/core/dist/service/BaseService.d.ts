/// <reference types="express-serve-static-core" />
import ServiceInterface from "../interface/ServiceInterface";
export default abstract class BaseService implements ServiceInterface {
    initialize(): void;
    integrate(app: Express.Application): void;
    abstract getName(): string;
}
