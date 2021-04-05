import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BoardModule } from './board/board.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db-dev.sqlite",
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true
    }),
    BoardModule,
    UserModule,
    ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
