import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileDto } from "./profile.dto";

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {
  }

  @Get()
  getAll() {
    return this.profileService.find();
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.profileService.findOne(id);
  }

  @Post()
  post(@Body() dto: ProfileDto) {
    return this.profileService.save(dto);
  }

  @Put(":id")
  put(@Param("id") id: string, @Body() dto: ProfileDto) {
    return this.profileService.update(id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.profileService.delete(id);
  }
}
