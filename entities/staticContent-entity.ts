import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("static_content")
export class StaticContentEntity {
  @PrimaryGeneratedColumn()
  StaticContentId: number;

  @Column({
    length: 255
  })
  Code: string;

  @Column({
    length: 255
  })
  Name: string;

  @Column({
    length: 255
  })
  Value: string;
}
