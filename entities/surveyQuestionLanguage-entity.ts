import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_question_language")
export class SurveyQuestionLanguageEntity {
  @PrimaryGeneratedColumn()
  SurveyQuestionLanguageId: number;

  @Column({
    length: 25
  })
  SurveyQuestionId: number;

  @Column({
    length: 25
  })
  SurveyId: number;

  @Column({
    length: 25
  })
  SurveyPageId: number;

  @Column({
    length: 255
  })
  Name: string;

  @Column("varchar", {
    length: 3000,
    nullable: true
  })
  Description: string;

  @Column({
    length: 25
  })
  LanguageId: number;
}
