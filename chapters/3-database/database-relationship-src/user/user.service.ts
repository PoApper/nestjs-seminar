import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { UserDto } from "./user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {
  }

  find() {
    return this.userRepo.find();
  }

  findOne(id: string) {
    return this.userRepo.findOne({ id: id });
  }

  save(dto: UserDto) {
    return this.userRepo.save({
      name: dto.name
    });
  }

  update(id: string, dto: UserDto) {
    return this.userRepo.update({ id: id }, {
      name: dto.name,
    });
  }

  delete(id: string) {
    return this.userRepo.delete({ id: id });
  }
}
