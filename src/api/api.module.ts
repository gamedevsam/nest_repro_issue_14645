/**
 * https://docs.nestjs.com/modules
 */
import { Module } from "@nestjs/common";
import { ExampleModule } from "./example/example.module";

@Module({
  imports: [ExampleModule],
})
export class ApiModule {}
