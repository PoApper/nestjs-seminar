import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  getAll() {
    return this.userService.find();
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  post(@Body() dto: UserDto) {
    return this.userService.save(dto);
  }

  @Put(":id")
  put(@Param("id") id: string, @Body() dto: UserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.userService.delete(id);
  }
}
