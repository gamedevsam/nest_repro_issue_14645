/**
 * https://docs.nestjs.com/modules
 */
import { Global, Module } from "@nestjs/common";
import { ExampleController } from "./example.controller";

@Global()
@Module({
  controllers: [ExampleController],
  providers: [],
  exports: [],
})
export class ExampleModule {}
