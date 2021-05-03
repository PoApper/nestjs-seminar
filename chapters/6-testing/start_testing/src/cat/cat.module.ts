import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cat } from "./cat.entity";
import { CatService } from "./cat.service";
import { CatController } from "./cat.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  providers: [CatService],
  controllers: [CatController],
  exports: [CatService]
})
export class CatModule {}