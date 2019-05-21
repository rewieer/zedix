import DevEnvironmentInterface from "./DevEnvironmentInterface";
declare class NodemonDevEnvironment implements DevEnvironmentInterface {
    private data;
    constructor(data: any);
    spawn(): void;
}
export default NodemonDevEnvironment;
