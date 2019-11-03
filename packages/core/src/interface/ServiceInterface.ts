/**
 * @interface ServiceInterface
 * A service is a class who depends on the app lifecycle.
 */
interface ServiceInterface {
  /**
   * Returns the name of the service. It's a way to find the service.
   */
  $getName(): string;

  /**
   * Initialize the service.
   */
  $initialize?();

  /**
   * Integrates the service into the express application (if necessary).
   * @param app
   */
  $integrate?(app: Express.Application);
}

export default ServiceInterface;
