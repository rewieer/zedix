export const configurable = (klass, configure) => {
  klass.__zxcfgr__ = configure;
  return klass;
};
