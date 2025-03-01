import { Module } from "@nestjs/common";
import { ApiModule } from "~/api/api.module";

@Module({
  get imports() {
    return [ApiModule];
  },
  get providers() {
    return [];
  },
})
export class ServerModule {}
