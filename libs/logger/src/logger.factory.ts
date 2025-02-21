import { type IncomingMessage, type ServerResponse } from 'http';

import type { GlobalConfig } from '@ecom/common/config';
import { loggingRedactPaths, LogService } from '@ecom/common/constants';
import type { ConfigService } from '@nestjs/config';
import type { Params } from 'nestjs-pino';
import type { GenReqId, Options } from 'pino-http';
import { v4 as uuidV4 } from 'uuid';

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const PinoLevelToGoogleLoggingSeverityLookup = Object.freeze({
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
});

// Updated: Return the raw string, not a JSON stringified version
const genReqId: GenReqId = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  const headerReqId = req.headers['x-request-id'];
  const id: string = typeof headerReqId === 'string' ? headerReqId : uuidV4();
  res.setHeader('X-Request-Id', id);
  return id;
};

const customSuccessMessage = (
  req: IncomingMessage & { id?: string },
  res: ServerResponse<IncomingMessage>,
  responseTime: number,
): string => {
  return `[${req.id}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - ${responseTime} ms`;
};

const customReceivedMessage = (
  req: IncomingMessage & { id?: string },
): string => {
  return `[${req.id}] "${req.method} ${req.url}"`;
};

const customErrorMessage = (
  req: IncomingMessage & { id?: string },
  res: ServerResponse<IncomingMessage>,
  err: Error,
): string => {
  return `[${req.id}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - message: ${err.message}`;
};

function logServiceConfig(logService: LogService): Options {
  switch (logService) {
    case LogService.GoogleLogging:
      return googleLoggingConfig();
    case LogService.Console:
    default:
      return consoleLoggingConfig();
  }
}

function googleLoggingConfig(): Options {
  return {
    messageKey: 'message',
    formatters: {
      level(label, number): object {
        return {
          severity:
            PinoLevelToGoogleLoggingSeverityLookup[label] ??
            PinoLevelToGoogleLoggingSeverityLookup['info'],
          level: number,
        };
      },
    },
  };
}

export function consoleLoggingConfig(): Options {
  return {
    messageKey: 'msg',
    transport: {
      target: 'pino-pretty',
      options: {
        singleLine: true,
        ignore:
          'req.id,req.headers,req.remoteAddress,req.remotePort,res.headers',
      },
    },
  };
}

function useLoggerFactory(configService: ConfigService<GlobalConfig>): Params {
  const logLevel = configService.get('app.logLevel', { infer: true }) ?? 'info';
  const logService: LogService =
    configService.get('app.logService', { infer: true }) ?? LogService.Console;
  const isDebug = configService.get('app.debug', { infer: true }) === true;

  const pinoHttpOptions: Options = {
    level: logLevel,
    // Only attach a custom request ID generator in debug mode
    genReqId: isDebug ? genReqId : undefined,
    serializers: isDebug
      ? {
          req: (req): Record<string, unknown> => {
            req.body = req.raw.body;
            return req as Record<string, unknown>;
          },
        }
      : undefined,
    customSuccessMessage,
    customReceivedMessage,
    customErrorMessage,
    redact: {
      paths: loggingRedactPaths,
      censor: '**GDPR COMPLIANT**',
    },
    ...logServiceConfig(logService),
  };

  return {
    pinoHttp: pinoHttpOptions,
  };
}

export default useLoggerFactory;
