import { HOST, PORT } from "~/config";
import { bootstrapFastify } from "~/initialization/bootstrap_fastify";
import { initSwaggerUi } from "~/initialization/init_openapi_swagger_ui";
import { ServerModule } from "~/initialization/server.module";

async function bootServer() {
  const fastifyApp = await bootstrapFastify(ServerModule);

  initSwaggerUi(fastifyApp, "api");

  fastifyApp.listen(
    {
      port: PORT,
      host: HOST,
    },
    () => console.log(`✅ Server started: http://${HOST}:${PORT}`)
  );
}

// Web concurrency environment variable instructs how many clusters (processes) will be created to handle the load in this server.
// Each cluster runs in its own isolated process but shares Node's low level network handler, and child processes share the same port.
//
// Heroku recommends the following cluster defaults:
//
// Tier                         Clusters
// free, hobby, standard-1x     1
// standard-2x                  2
// performance-M                5
// performance-L                28
//
//  https://devcenter.heroku.com/articles/node-concurrency
console.log(
  `🏁 Starting Nest server with Node ${process.version} & NODE_ENV=${process.env.NODE_ENV}`
);
bootServer();
