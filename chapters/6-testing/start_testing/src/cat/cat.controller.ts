import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CatDto } from "./cat.dto";
import { CatService } from "./cat.service";

@Controller("cat")
export class CatController {
  constructor(private readonly catService: CatService) {
  }

  @Get()
  getAll() {
    return this.catService.find();
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.catService.findOne(id);
  }

  @Post()
  post(@Body() dto: CatDto) {
    return this.catService.save(dto);
  }

  @Put(":id")
  put(@Param("id") id: string, @Body() dto: CatDto) {
    return this.catService.update(id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.catService.delete(id);
  }
}