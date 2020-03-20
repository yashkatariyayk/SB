import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("language")
export class LanguageEntity {
  @PrimaryGeneratedColumn()
  LanguageId: number;

  @Column({
    length: 255
  })
  Name: string;

  @Column({
    length: 255
  })
  CodeName: string;

  @Column({
    length: 255,
    nullable: true
  })
  Orientation: string;

  @Column({
    length: 255
  })
  CreatedOn: string;

  @Column({
    length: 255
  })
  CreatedBy: string;

  @Column({
    length: 25,
    default: true
  })
  IsActive: boolean;

  @Column({
    length: 25,
    default: false
  })
  IsDeleted: boolean;
}
