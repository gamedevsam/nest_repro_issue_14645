import { LogLevel } from "@nestjs/common";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const ALL_COMPRESSIONS = "br,gzip,deflate";

//#region Server
export const HOST = process.env.HOST || "0.0.0.0"; // 0.0.0.0 is important for dokku
export const PORT = parseInt(process.env.PORT || "3001");

// https://github.com/uNetworking/uWebSockets/blob/master/misc/READMORE.md
export const WS_PORT = parseInt(process.env.WS_PORT || "3003");
export const WS_KEY_FILE_NAME = process.env.WS_KEY_FILE_NAME;
export const WS_CERT_FILE_NAME = process.env.WS_CERT_FILE_NAME;
export const WS_CA_FILE_NAME = process.env.WS_CA_FILE_NAME;
export const WS_PASSPHRASE = process.env.WS_PASSPHRASE;
export const WS_MAX_PAYLOAD_SIZE = process.env.WS_PASSPHRASE;
export const WS_DH_PARAMS_FILE_NAME = process.env.WS_DH_PARAMS_FILE_NAME;
export const WS_SSL_CIPHERS = process.env.WS_SSL_CIPHERS;
export const WS_SSL_PREFER_LOW_MEMORY_USAGE =
  process.env.WS_SSL_PREFER_LOW_MEMORY_USAGE === "true";
/** Maximum amount of seconds that may pass without sending or getting a message. Connection is closed if this timeout passes. Resolution (granularity) for timeouts are typically 4 seconds, rounded to closest. Disable by using 0. Defaults to 120. */
export const WS_IDLE_TIMEOUT = parseInt(process.env.WS_IDLE_TIMEOUT || "120");
/** Maximum length of received message. If a client tries to send you a message larger than this, the connection is immediately closed. Defaults to 16 * 1024. */
export const WS_PAYLOAD_SIZE_LIMIT = parseInt(
  process.env.WS_PAYLOAD_SIZE_LIMIT || "16777216"
); // 16MB by default
/** Maximum number of minutes a WebSocket may be connected before being closed by the server. 0 disables the feature (default). */
export const WS_MAX_LIFETIME = parseInt(process.env.WS_MAX_LIFETIME || "0");
/** What permessage-deflate compression to use. uWS.DISABLED, uWS.SHARED_COMPRESSOR or any of the uWS.DEDICATED_COMPRESSOR_xxxKB. Defaults to uWS.DISABLED. */
export const WS_COMPRESSION = parseInt(process.env.WS_COMPRESSION || "0");
/** Maximum length of allowed backpressure per socket when publishing or sending messages. Slow receivers with too high backpressure will be skipped until they catch up or timeout. Defaults to 64 * 1024. */
export const WS_MAX_BACKPRESSURE = parseInt(
  process.env.WS_MAX_BACKPRESSURE || "8192"
);

export const SOURCE_PATH = process.env.SOURCE_PATH || "src";
export const COOKIE_SECRET = process.env.COOKIE_SECRET || "";
export const OPEN_API_DOCUMENTATION_PAGE =
  process.env.OPEN_API_DOCUMENTATION_PAGE || (IS_DEVELOPMENT ? "api" : "");

export const FASTIFY_MAX_AGE_CACHING = parseInt(
  process.env.FASTIFY_MAX_AGE_CACHING || "31536000"
); // 1 year by default
export const FASTIFY_BODY_SIZE_LIMIT = parseInt(
  process.env.FASTIFY_BODY_SIZE_LIMIT || "16777216"
); // 16MB by default, https://fastify.dev/docs/latest/Reference/Server/#bodylimit
export const FASTIFY_IGNORE_TRAILING_SLASHES =
  process.env.FASTIFY_IGNORE_TRAILING_SLASHES === "true"; // Enabled by default, https://github.com/fastify/fastify/blob/main/docs/Reference/Server.md#ignoretrailingslash
export const FASTIFY_COMPRESSION_THRESHOLD = parseInt(
  process.env.FASTIFY_COMPRESSION_THRESHOLD || "1024"
); // 1MB by default, https://www.npmjs.com/package/@fastify/compress#threshold
export const FASTIFY_COMPRESSION_QUALITY = parseInt(
  process.env.FASTIFY_COMPRESSION_QUALITY || "2"
); // Between 0 and 11, 2 by default, https://www.npmjs.com/package/@fastify/compress#brotlioptions-and-zliboptions
export const FASTIFY_COMPRESSION: string[] = (
  process.env.FASTIFY_COMPRESSION === "*"
    ? ALL_COMPRESSIONS
    : process.env.FASTIFY_COMPRESSION || ALL_COMPRESSIONS
)
  .split(",")
  .filter((test) => !!test && test !== "false");
//#endregion Server

//#region CORS (https://github.com/fastify/fastify-cors)
export const ACCESS_CONTROL_ALLOW_ORIGIN = Array.from(
  new Set(process.env.ACCESS_CONTROL_ALLOW_ORIGIN?.split(","))
).filter(Boolean);
export const ACCESS_CONTROL_MAX_AGE = parseInt(
  process.env.ACCESS_CONTROL_MAX_AGE || "86400"
);
export const ACCESS_CONTROL_ENABLE_CREDENTIALS =
  process.env.ACCESS_CONTROL_ENABLE_CREDENTIALS === "true"; // disabled by default
//#endregion CORS (https://github.com/fastify/fastify-cors)

//#region Debugging / Monitoring
export const FASTIFY_LOGGER = process.env.FASTIFY_LOGGER !== "false";

// https://fastify.dev/docs/latest/Reference/Hooks/#route-level-hooks
// https://fastify.dev/docs/latest/Reference/Hooks/#application-hooks
export const FASTIFY_LOG_HOOKS =
  process.env.FASTIFY_LOG_HOOKS === "false"
    ? []
    : (process.env.FASTIFY_LOG_HOOKS ?? "onRequest,onResponse").split(",");

export const LOG = (process.env.LOG || "log,error,warn,debug,verbose").split(
  ","
) as LogLevel[];

//#endregion Debugging / Monitoring
