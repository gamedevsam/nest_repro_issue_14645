import compression, { FastifyCompressOptions } from "@fastify/compress";
import cookieParser from "@fastify/cookie";
import { Logger, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { FastifyReply, FastifyRequest, FastifyServerOptions } from "fastify";
import { contentParser } from "fastify-multer";
import { constants } from "zlib";
import {
  ACCESS_CONTROL_ALLOW_ORIGIN,
  ACCESS_CONTROL_ENABLE_CREDENTIALS,
  ACCESS_CONTROL_MAX_AGE,
  COOKIE_SECRET,
  FASTIFY_BODY_SIZE_LIMIT,
  FASTIFY_COMPRESSION,
  FASTIFY_COMPRESSION_QUALITY,
  FASTIFY_COMPRESSION_THRESHOLD,
  FASTIFY_IGNORE_TRAILING_SLASHES,
  FASTIFY_LOG_HOOKS,
  FASTIFY_LOGGER,
  LOG,
} from "~/config";

const logger = new Logger("Fastify");

export async function bootstrapFastify(
  module: any,
  options?: {
    fastifyConfig?: FastifyServerOptions;
    onCreatedHook?: (app: NestFastifyApplication) => void;
    errorHandler?: (
      error: Error,
      request: FastifyRequest,
      reply: FastifyReply
    ) => any | Promise<any>;
  }
) {
  // UNLEASH: Wait until feature flags are loaded
  // await featureFlagsStore.getFeatureFlags();

  const app = await NestFactory.create<NestFastifyApplication>(
    module,
    new FastifyAdapter({
      ...options?.fastifyConfig,
      logger: FASTIFY_LOGGER,
      bodyLimit: FASTIFY_BODY_SIZE_LIMIT,
      ignoreTrailingSlash: FASTIFY_IGNORE_TRAILING_SLASHES,
    }),
    {
      logger: LOG,
      rawBody: true,
    }
  );
  const fastify = app.getHttpAdapter().getInstance();
  /**
   * Fastify Route Hooks: https://fastify.dev/docs/latest/Reference/Hooks/#route-level-hooks
   */
  // https://fastify.dev/docs/latest/Reference/Hooks/#preparsing
  fastify.addHook("preParsing", (req, _res, payload, done) => {
    FASTIFY_LOG_HOOKS.includes("preParsing") &&
      logger.debug(`preParsing: ${req.url}`);
    done(null, payload);
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#prevalidation
  fastify.addHook("preValidation", (req, _res, done) => {
    FASTIFY_LOG_HOOKS.includes("preValidation") &&
      logger.debug(`preValidation: ${req.url}`);
    done();
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#prehandler
  fastify.addHook("preHandler", (req, _res, done) => {
    FASTIFY_LOG_HOOKS.includes("preHandler") &&
      logger.debug(`preHandler: ${req.url}`);
    done();
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#preserialization
  fastify.addHook("preSerialization", (req, _res, payload, done) => {
    FASTIFY_LOG_HOOKS.includes("preSerialization") &&
      logger.debug(`preSerialization: ${req.url}`);
    done(null, payload);
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#onerror
  fastify.addHook("onError", (req, _res, _error, done) => {
    FASTIFY_LOG_HOOKS.includes("onError") &&
      logger.debug(`onError: ${req.url}`);
    done();
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#onsend
  fastify.addHook("onSend", (req, _res, payload, done) => {
    FASTIFY_LOG_HOOKS.includes("onSend") && logger.debug(`onSend: ${req.url}`);
    done(null, payload);
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#onresponse
  fastify.addHook("onResponse", (req, _res, done) => {
    FASTIFY_LOG_HOOKS.includes("onResponse") &&
      logger.debug(`onResponse: ${req.url}`);
    done();
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#ontimeout
  fastify.addHook("onTimeout", (req, _res, done) => {
    FASTIFY_LOG_HOOKS.includes("onTimeout") &&
      logger.debug(`onTimeout: ${req.url}`);
    done();
  });
  fastify.addHook("onRequestAbort", (req, done) => {
    FASTIFY_LOG_HOOKS.includes("onRequestAbort") &&
      logger.debug(`onRequestAbort: ${req.url}`);
    done();
  });
  /**
   * Fastify Application Hooks: https://fastify.dev/docs/latest/Reference/Hooks/#application-hooks
   */
  // https://fastify.dev/docs/latest/Reference/Hooks/#onready
  fastify.addHook("onReady", (done) => {
    FASTIFY_LOG_HOOKS.includes("onReady") && logger.debug("onReady");
    done();
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#onlisten
  fastify.addHook("onListen", (done) => {
    FASTIFY_LOG_HOOKS.includes("onListen") && logger.debug("onListen");
    done();
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#onclose
  fastify.addHook("onClose", (_instance, done) => {
    FASTIFY_LOG_HOOKS.includes("onClose") && logger.debug("onClose");
    done();
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#preclose
  fastify.addHook("preClose", (done) => {
    FASTIFY_LOG_HOOKS.includes("preClose") && logger.debug("preClose");
    done();
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#onroute
  // onRoute is very noisy and redundant since NestJS already prints routes
  /* fastify.addHook('onRoute', (routeOptions) => {
    FASTIFY_LOG_HOOKS.includes('onRoute') && logger.debug(`onRoute ${printJson(routeOptions)}`);
  }); */
  fastify.addHook("onRegister", (_instance, _opts) => {
    FASTIFY_LOG_HOOKS.includes("onRegister") && logger.debug("onRegister");
  });
  // https://fastify.dev/docs/latest/Reference/Hooks/#onrequest
  fastify.addHook("onRequest", (req, _res, done) => {
    FASTIFY_LOG_HOOKS.includes("onRequest") &&
      logger.debug(`onRequest: ${req.url}`);
    done();
  });

  options?.onCreatedHook?.(app);

  // https://github.com/fastify/fastify-cors
  app.enableCors({
    origin: ACCESS_CONTROL_ALLOW_ORIGIN,
    maxAge: ACCESS_CONTROL_MAX_AGE,
    credentials: ACCESS_CONTROL_ENABLE_CREDENTIALS,
  });

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: "Version",
  });

  if (FASTIFY_COMPRESSION.length > 0) {
    logger.log(`🗜️ Enabling compression: ${FASTIFY_COMPRESSION}`);
    // https://www.npmjs.com/package/@fastify/compress
    // Brotli ('br') compression results in better compression at the cost of server performance.
    // Use 'br' if you have a CDN in front of the server, otherwise use 'gzip' & 'deflate'.
    await app.register(compression, {
      encodings: FASTIFY_COMPRESSION as FastifyCompressOptions["encodings"],
      threshold: FASTIFY_COMPRESSION_THRESHOLD,
      brotliOptions: {
        params: {
          [constants.BROTLI_PARAM_QUALITY]: FASTIFY_COMPRESSION_QUALITY,
        },
      },
    });
  }

  // https://www.npmjs.com/package/fastify-raw-body
  await app.register(import("fastify-raw-body"), {
    global: false,
  });

  // https://www.npmjs.com/package/@fastify/cookie
  await app.register(cookieParser, {
    secret: COOKIE_SECRET,
  });

  // https://www.npmjs.com/package/@webundsoehne/nest-fastify-file-upload
  await app.register(contentParser);

  return app;
}
