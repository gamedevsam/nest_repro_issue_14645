import { NestFastifyApplication } from "@nestjs/platform-fastify";

export async function initSwaggerUi(
  app: NestFastifyApplication,
  apiDocumentationPage: string
) {
  // NOTE: Use dynamic import here to avoid importing packages into memory if this function is not called
  const { SwaggerModule, DocumentBuilder } = await import("@nestjs/swagger");

  const config = new DocumentBuilder()
    .setTitle("App")
    .setVersion("1")
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(apiDocumentationPage, app, document, {
    swaggerOptions: {
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
  });
}
