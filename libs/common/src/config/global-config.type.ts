import type { IAppConfig } from './config.type';

export type GlobalConfig<T = object> = {
  app: IAppConfig;
} & T;
