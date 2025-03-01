import { Controller, Get, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("schema")
@Controller("api/example")
export class ExampleController {
  constructor() {}

  @Get(["", "*"])
  get(@Req() req: any) {
    const splitPath = req.url.split("/");
    return splitPath;
  }
}
