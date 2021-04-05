import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Profile } from "./profile.entity";
import { ProfileDto } from "./profile.dto";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>
  ) {
  }

  find() {
    return this.profileRepo.find({ relations: ["user"] });
  }

  findOne(id: string) {
    return this.profileRepo.findOne({ id: id });
  }

  async save(dto: ProfileDto) {
    return this.profileRepo.save({
      gender: dto.gender,
    });
  }

  update(id: string, dto: ProfileDto) {
    return this.profileRepo.update({ id: id }, {
      gender: dto.gender,
    });
  }

  delete(id: string) {
    return this.profileRepo.delete({ id: id });
  }

}
