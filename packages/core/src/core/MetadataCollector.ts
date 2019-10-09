export type Metadata<TType extends string = string, T extends object = {}> = {
  type: TType;
  class: Function;
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
    // decorators are readed bottom-up, so the last one to be readed is actually the first one the user reads
    this.metadata.unshift(data);
  }

  getMetadataForObject(object): Metadata[] {
    return this.metadata.filter(data => {
      return data.class === object.constructor;
    });
  }

  clear() {
    this.metadata = [];
  }
}

export default new MetadataCollector();
