import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "./board.entity";
import { Repository } from "typeorm";
import { BoardDto } from "./board.dto";

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {
  }

  find() {
    return this.boardRepo.find();
  }

  findOne(id: string) {
    return this.boardRepo.findOne({ id: id });
  }

  async save(dto: BoardDto) {
    return this.boardRepo.save({
      title: dto.title,
      content: dto.content,
      views: 0,
    });
  }

  update(id: string, dto: BoardDto) {
    return this.boardRepo.update({ id: id }, {
      title: dto.title,
      content: dto.content
    });
  }

  delete(id: string) {
    return this.boardRepo.delete({ id: id });
  }

}
