export type Metadata = {
  type: string;
  target: Function;
  methodName: string;
  [prop: string]: any;
};

/**
 * @class MetadataCollector
 * Gather metadata about various objects
 * Typically used with directives
 */
class MetadataCollector {
  metadata: Metadata[] = [];

  add(data: Metadata) {
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
