interface ServiceInterface {
  getName() : string;
  initialize();
  integrate(app: Express.Application);
}

export default ServiceInterface;
