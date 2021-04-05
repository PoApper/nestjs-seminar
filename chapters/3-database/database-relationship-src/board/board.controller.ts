import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BoardService } from "./board.service";
import { BoardDto } from "./board.dto";

@Controller("board")
export class BoardController {
  constructor(private readonly boardService: BoardService) {
  }

  @Get()
  getAllBoard() {
    return this.boardService.find();
  }

  @Get(":id")
  getOneBoard(@Param("id") id: string) {
    return this.boardService.findOne(id);
  }

  @Post()
  postBoard(@Body() dto: BoardDto) {
    return this.boardService.save(dto);
  }

  @Put(":id")
  putBoard(@Param("id") id: string, @Body() dto: BoardDto) {
    return this.boardService.update(id, dto);
  }

  @Delete(":id")
  deleteBoard(@Param("id") id: string) {
    return this.boardService.delete(id);
  }

}
