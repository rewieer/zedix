import LoggerInterface from "./service/LoggerInterface";

export type OrNull<T> = T | null;
export type OrUndefined<T> = T | undefined;
export type Maybe<T> = OrNull<OrUndefined<T>>;
export type StringMap<V> = { [key: string]: V };

export type AppHelpers = {
  getLogger: () => LoggerInterface;
  getURL: () => string;
};
