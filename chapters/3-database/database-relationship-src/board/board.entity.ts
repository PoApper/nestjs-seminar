import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @Column()
  views: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}