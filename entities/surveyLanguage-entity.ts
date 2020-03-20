import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_language")
export class SurveyLanguageEntity {
  @PrimaryGeneratedColumn()
  SurveyLanguageId: number;

  @Column({
    length: 255
  })
  SurveyId: number;

  @Column({
    length: 255
  })
  Name: string;

  @Column({
    length: 255
  })
  LanguageId: string;
}
