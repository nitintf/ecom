import type { Environment } from '../constants';

export interface IAppConfig {
  nodeEnv: `${Environment}`;
  isHttps: boolean;
  name: string;
  appPrefix: string;
  url: string;
  port: number;
  debug: boolean;
  fallbackLanguage: string;
  appLogging: boolean;
  logLevel: string;
  logService: string;
  corsOrigin: boolean | string | RegExp | Array<string | RegExp>;
}
