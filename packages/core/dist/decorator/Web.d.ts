import { Metadata } from "../core/MetadataCollector";
export interface WebMetata extends Metadata {
    name: string;
    path: string;
    method: string;
}
/**
 * Represent a Web Query
 * @param params
 * @constructor
 */
export default function Web(params: {
    name: string;
    path: string;
    method: string;
}): (target: any, method: any) => void;
