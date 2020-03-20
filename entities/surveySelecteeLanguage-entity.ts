import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_selectee_language")
export class SurveySelecteeLanguageEntity {
  @PrimaryGeneratedColumn()
  SurveySelecteeLanguageId: number;

  @Column({
    length: 25
  })
  SurveySelecteeId: number;

  @Column({
    length: 255
  })
  FirstName: string;

  @Column({
    length: 255,
    nullable: true
  })
  LastName: string;

  @Column({
    length: 255,
    nullable: true
  })
  Email: string;

  @Column({
    length: 255,
    nullable: true
  })
  Role: string;

  @Column({
    length: 255,
    nullable: true
  })
  Department: string;

  @Column({
    length: 255,
    nullable: true
  })
  Miscellaneous: string;

  @Column({
    length: 25
  })
  LanguageId: number;
}
