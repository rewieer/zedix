export declare type Metadata = {
    type: string;
    target: () => any;
    methodName: string;
    [prop: string]: any;
};
/**
 * @class MetadataCollector
 * Gather metadata about various objects
 * Typically used with directives
 */
declare class MetadataCollector {
    metadata: Metadata[];
    add(data: Metadata): void;
    getMetadataForObject(object: any): Metadata[];
    clear(): void;
}
declare const _default: MetadataCollector;
export default _default;
