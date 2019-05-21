/// <reference types="express-serve-static-core" />
interface ServiceInterface {
    getName(): string;
    initialize(): any;
    integrate(app: Express.Application): any;
}
export default ServiceInterface;
