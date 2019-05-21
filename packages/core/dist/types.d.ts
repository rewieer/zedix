import LoggerInterface from "./service/LoggerInterface";
export declare type OrNull<T> = T | null;
export declare type OrUndefined<T> = T | undefined;
export declare type Maybe<T> = OrNull<OrUndefined<T>>;
export declare type StringMap<V> = {
    [key: string]: V;
};
export declare type AppHelpers = {
    getLogger: () => LoggerInterface;
    getURL: () => string;
};
