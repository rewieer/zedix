import DevEnvironmentInterface from "./DevEnvironmentInterface";
/**
 * @class DevRuntime
 * Provide a development environment embedding
 * - automatic reloading of app
 * - asset bundling
 */
declare class DevRuntime {
    private environments;
    constructor(envs: DevEnvironmentInterface[]);
    start(): void;
}
export default DevRuntime;
