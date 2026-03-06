import { Params } from 'nestjs-pino';

const HEADERS_TO_REDACT = ['authorization', 'x-device-hash'];
const KEYS_TO_REDACT = ['pid', 'hostname'];

const redactedPaths = HEADERS_TO_REDACT.map(
  (key) => `req.headers["${key}"]`,
).concat(KEYS_TO_REDACT);

const ignoredFieldsForPretty = HEADERS_TO_REDACT.map(
  (key) => `req.headers.${key}`,
).concat(KEYS_TO_REDACT);

const createLoggerConfig = (env: string): Params =>
  env !== 'production'
    ? {
        pinoHttp: {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              levelFirst: true,
              translateTime: 'UTC:yyyy-mm-dd HH:MM:ss',
              ignore: ignoredFieldsForPretty.join(','),
            },
          },
        },
      }
    : {
        pinoHttp: {
          redact: {
            paths: redactedPaths,
            remove: true,
          },
          mixin() {
            return {
              dateTime: new Date().toISOString(),
            };
          },
        },
      };

export default createLoggerConfig;
