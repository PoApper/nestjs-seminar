import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from "express";

import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Roles } from './auth/authroization/roles.decorator';
import { UserType } from './user/user';
import { RolesGuard } from './auth/authroization/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getHello(@Req() req): string {
    console.log(req.user);
    return `Hello, ${req.user.name}`;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserType.admin)
  @Get('admin')
  OnlyAdmin(@Req() req): string {
    console.log(req.user);
    return `This is Admin Page.`;
  }
}
