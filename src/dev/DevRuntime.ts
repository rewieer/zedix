import DevEnvironmentInterface from "./DevEnvironmentInterface";

/**
 * @class DevRuntime
 * Provide a development environment embedding
 * - automatic reloading of app
 * - asset bundling
 */
class DevRuntime {
  private environments: DevEnvironmentInterface[] = [];

  constructor(envs: DevEnvironmentInterface[]) {
    this.environments = envs;
  }

  start() {
    this.environments.forEach(environment => environment.spawn());
  }
}

export default DevRuntime;
