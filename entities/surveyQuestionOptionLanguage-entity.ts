import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_question_option_language")
export class SurveyQuestionOptionLanguageEntity {
  @PrimaryGeneratedColumn()
  SurveyQuestionOptionLanguageId: number;

  @Column({
    length: 25
  })
  SurveyQuestionOptionId: number;

  @Column({
    length: 25
  })
  SurveyId: number;

  @Column({
    length: 25,
    nullable: true
  })
  SurveyQuestionId: number;

  @Column({
    length: 255,
    nullable: true
  })
  Name: string;

  @Column({
    length: 25
  })
  LanguageId: number;
}
