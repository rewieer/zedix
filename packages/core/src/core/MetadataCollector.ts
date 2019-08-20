export type Metadata<TType extends string = string, T extends object = {}> = {
  type: TType;
  target: Function;
  methodName: string;
  [prop: string]: any;
} & T;

/**
 * @class MetadataCollector
 * Gather metadata about various objects
 * Typically used with directives
 */
class MetadataCollector {
  metadata: Metadata[] = [];

  add<TMeta extends Metadata>(data: TMeta) {
    this.metadata.push(data);
  }

  getMetadataForObject(object): Metadata[] {
    return this.metadata.filter(data => data.target === object.constructor);
  }

  clear() {
    this.metadata = [];
  }
}

export default new MetadataCollector();
