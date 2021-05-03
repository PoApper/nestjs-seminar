import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cat } from "./cat.entity";
import { CatDto } from "./cat.dto";

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepo: Repository<Cat>
  ) {
  }

  find() {
    return this.catRepo.find();
  }

  findOne(id: string) {
    return this.catRepo.findOne({ id: id });
  }

  save(dto: CatDto) {
    return this.catRepo.save({
      name: dto.name
    });
  }

  update(id: string, dto: CatDto) {
    return this.catRepo.update({ id: id }, {
      name: dto.name
    });
  }

  delete(id: string) {
    return this.catRepo.delete({ id: id });
  }
}